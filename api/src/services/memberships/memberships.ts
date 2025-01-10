import type {
  QueryResolvers,
  MutationResolvers,
  MembershipRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import { cache } from 'src/lib/cache'

export const memberships: QueryResolvers['memberships'] = () => {
  return db.membership.findMany()
}

export const membership: QueryResolvers['membership'] = ({ id }) => {
  return db.membership.findUnique({
    where: { id },
  })
}

export const findOrgMembers: QueryResolvers['findOrgMembers'] = ({
  organizationId,
}) => {
  return db.membership.findMany({
    where: {
      organizationId: organizationId,
    },
    select: {
      id: true,
      user: true,
      roles: true,
      status: true,
      invitedEmail: true,
      invitedAt: true,
      invitationExpiresAt: true,
    },
  })
}

interface InviteMemberInput {
  userId?: string
  email: string
  roleIds: string[]
}

interface InviteMembersInput {
  organizationId: string
  invites: InviteMemberInput[]
}

async function processInviteBatch(batchId, organizationId, invites) {
  const CHUNK_SIZE = 25;
  const cacheKey = `invite-batch-${batchId}`;
  let processed = 0;

  // Local state to reduce cache operations
  let localState = {
    status: 'PROCESSING',
    processed: 0,
    results: {
      successful: [],
      failed: [],
    },
  };

  for (let i = 0; i < invites.length; i += CHUNK_SIZE) {
    const chunk = invites.slice(i, i + CHUNK_SIZE);

    const chunkResults = await Promise.all(
      chunk.map(async (invite) => {
        try {
          const membership = invite.userId
            ? await handleExistingUserInvite(db, {
                userId: invite.userId,
                organizationId,
                roleIds: invite.roleIds,
                email: invite.email,
              })
            : await handleEmailInvite(db, {
                email: invite.email,
                organizationId,
                roleIds: invite.roleIds,
              });

          const roles = await db.membershipRole.findMany({
            where: { id: { in: invite.roleIds } },
          });

          return {
            success: true,
            data: {
              userId: membership.userId,
              email: membership.invitedEmail || invite.email,
              status: membership.status,
              roles,
            },
          };
        } catch (error) {
          logger.error(`Failed to process invite for ${invite.email}:`, error);
          return {
            success: false,
            data: {
              email: invite.email,
              error:
                error instanceof Error
                  ? error.message
                  : 'Unknown error occurred',
            },
          };
        }
      })
    );

    // Update local state
    processed += chunk.length;
    localState.processed = processed;
    localState.results.successful.push(
      ...chunkResults.filter((result) => result.success).map((result) => result.data)
    );
    localState.results.failed.push(
      ...chunkResults.filter((result) => !result.success).map((result) => result.data)
    );

    // Periodically update cache (optional for real-time tracking)
    await cache(cacheKey, () => ({
      ...localState,
    }));
  }

  // Final state update
  await cache(cacheKey, () => ({
    ...localState,
    status: 'COMPLETED',
  }));
}


export const inviteMembers = async ({
  input,
}: {
  input: InviteMembersInput
}) => {
  const { organizationId, invites } = input
  const batchId = crypto.randomUUID()

  if (!invites.length) {
    throw new Error('No invites provided')
  }
  console.log('Invite length: ', invites.length)
  const cacheKey = `invite-batch-${batchId}`

  await cache(
    cacheKey,
    () => ({
      status: 'PROCESSING',
      total: invites.length,
      processed: 0,
      results: {
        successful: [],
        failed: [],
      },
    }),
    { expires: 3600 }
  )

  processInviteBatch(batchId, organizationId, invites).catch((error) => {
    logger.error('Batch processing failed:', error)
    cache(cacheKey, () => ({
      status: 'FAILED',
      error: error.message,
      total: invites.length,
      processed: 0,
      results: {
        successful: [],
        failed: [],
      },
    }))
  })

  return {
    batchId,
    status: 'PROCESSING',
    total: invites.length,
    successful: [],
    failed: [],
  }
}


export const getBatchStatus = async ({ batchId }: { batchId: string }) => {
  const status = await cache(`invite-batch-${batchId}`, () => null)
  if (!status) {
    throw new Error('Batch not found')
  }
  return status
}

async function handleExistingUserInvite(
  prisma,
  {
    userId,
    organizationId,
    roleIds,
    email,
  }: {
    userId: string
    organizationId: string
    roleIds: string[]
    email: string
  }
) {
  const existingMembership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
  })

  if (existingMembership) {
    throw new Error('User is already a member of this organization')
  }

  const membership = await prisma.membership.create({
    data: {
      userId,
      organizationId,
      status: 'INVITED',
      invitedEmail: email,
      invitedAt: new Date(),
      invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      invitationChannel: 'EMAIL',
      roles: {
        connect: roleIds.map((id) => ({ id })),
      },
    },
  })

  await sendInvitationEmail(email, membership.invitationId, organizationId)

  return membership
}

async function handleEmailInvite(
  prisma,
  {
    email,
    organizationId,
    roleIds,
  }: {
    email: string
    organizationId: string
    roleIds: string[]
  }
) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        where: { organizationId },
      },
    },
  })

  if (existingUser?.memberships?.length > 0) {
    throw new Error('User is already a member of this organization')
  }

  const membership = await prisma.membership.create({
    data: {
      organization: {
        connect: { id: organizationId },
      },
      status: 'INVITED',
      invitedEmail: email,
      invitedAt: new Date(),
      invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      invitationChannel: 'EMAIL',
      roles: {
        connect: roleIds.map((id) => ({ id })),
      },
      ...(existingUser
        ? { user: { connect: { id: existingUser.id } } }
        : { userId: null }),
    },
  })

  await sendInvitationEmail(email, membership.invitationId, organizationId)

  return membership
}

async function sendInvitationEmail(
  email: string,
  invitationId: string,
  organizationId: string
) {
  // Implement your email sending logic here
  // You might want to use a service like SendGrid or AWS SES
  logger.info(`Sending invitation email to ${email}`)
}

export const createMembership: MutationResolvers['createMembership'] = ({
  input,
}) => {
  return db.membership.create({
    data: input,
  })
}

export const updateMembership: MutationResolvers['updateMembership'] = ({
  id,
  input,
}) => {
  return db.membership.update({
    data: input,
    where: { id },
  })
}

export const deleteMembership: MutationResolvers['deleteMembership'] = ({
  id,
}) => {
  return db.membership.delete({
    where: { id },
  })
}

export const revokeAccess = async ({ id }: { id: string }) => {
  return db.membership.delete({
    where: { id },
  })
}

// export const suspendMember = async ({ id, status }: { id: string; status: string }) => {
//   return db.membership.update({
//     where: { id },
//     data: { status },
//   });
// };

export const updateMemberRoles = async ({
  id,
  roles,
}: {
  id: string
  roles: string[]
}) => {
  return db.membership.update({
    where: { id },
    data: {
      roles: {
        set: roles.map((roleId) => ({ id: roleId })),
      },
    },
  })
}

export const Membership: MembershipRelationResolvers = {
  user: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).user()
  },
  organization: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).organization()
  },
  roles: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).roles()
  },
  assignment: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).assignment()
  },
  event: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).event()
  },
  media: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).media()
  },
  auditLog: (_obj, { root }) => {
    return db.membership.findUnique({ where: { id: root?.id } }).auditLog()
  },
}
