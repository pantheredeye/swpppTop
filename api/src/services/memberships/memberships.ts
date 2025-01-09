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

export const findOrgMembers: QueryResolvers['findOrgMembers'] = ({ organizationId }) => {
  return db.membership.findMany({
    where: {
        organizationId: organizationId ,
    },
    select: {
      id: true,
      user: true,
      roles: true,
      status: true,
      invitedEmail: true,
      invitedAt: true,
      invitationExpiresAt: true
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

async function processChunk(
  prisma,
  chunk: InviteMemberInput[],
  organizationId: string
) {
  const results = { successful: [], failed: [] }

  await Promise.all(
    chunk.map(async (invite) => {
      try {
        let membership = null

        if (invite.userId) {
          membership = await handleExistingUserInvite(prisma, {
            userId: invite.userId,
            organizationId,
            roleIds: invite.roleIds,
            email: invite.email,
          })
        } else {
          membership = await handleEmailInvite(prisma, {
            email: invite.email,
            organizationId,
            roleIds: invite.roleIds,
          })
        }

        const roles = await prisma.membershipRole.findMany({
          where: { id: { in: invite.roleIds } },
        })

        results.successful.push({
          userId: membership.userId,
          email: membership.invitedEmail || invite.email,
          status: membership.status,
          roles,
        })
      } catch (error) {
        logger.error(`Failed to process invite for ${invite.email}:`, error)
        results.failed.push({
          email: invite.email,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        })
      }
    })
  )

  return results
}

export const inviteMembers = async ({ input }: { input: InviteMembersInput }) => {
  const { organizationId, invites } = input
  const batchId = crypto.randomUUID()

  if (!invites.length) {
    throw new Error('No invites provided')
  }

  const cacheKey = `invite-batch-${batchId}`

  // Initialize with empty arrays for required fields
  await cache(
    cacheKey,
    () => ({
      status: 'PROCESSING',
      total: invites.length,
      processed: 0,
      results: {
        successful: [], // Ensure this is always initialized as an empty array
        failed: []
      }
    }),
    { expires: 3600 }
  )

  // Start background processing
  processInviteBatch(batchId, organizationId, invites).catch(error => {
    logger.error('Batch processing failed:', error)
    cache(cacheKey, () => ({
      status: 'FAILED',
      error: error.message,
      total: invites.length,
      processed: 0,
      results: {
        successful: [],
        failed: []
      }
    }))
  })

  // Return initial state with required fields
  return {
    batchId,
    status: 'PROCESSING',
    total: invites.length,
    successful: [] // Add this to satisfy the non-nullable requirement
  }
}
async function processInviteBatch(batchId: string, organizationId: string, invites: InviteMemberInput[]) {
  const CHUNK_SIZE = 25
  const cacheKey = `invite-batch-${batchId}`
  let processed = 0

  try {
    for (let i = 0; i < invites.length; i += CHUNK_SIZE) {
      const chunk = invites.slice(i, i + CHUNK_SIZE)

      await db.$transaction(async (prisma) => {
        const results = await processChunk(prisma, chunk, organizationId)
        processed += chunk.length

        // Update progress in cache
        const currentState = await cache(cacheKey, () => ({}))
        await cache(cacheKey, () => ({
          ...currentState,
          status: 'PROCESSING',
          processed,
          results: {
            successful: [...currentState.results.successful, ...results.successful],
            failed: [...currentState.results.failed, ...results.failed]
          }
        }))
      })
    }

    // Mark as complete
    const finalState = await cache(cacheKey, () => ({}))
    await cache(cacheKey, () => ({
      ...finalState,
      status: 'COMPLETED'
    }))
  } catch (error) {
    logger.error(`Batch ${batchId} failed:`, error)
    const currentState = await cache(cacheKey, () => ({}))
    await cache(cacheKey, () => ({
      ...currentState,
      status: 'FAILED',
      error: error.message
    }))
    throw error
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
  });
};

// export const suspendMember = async ({ id, status }: { id: string; status: string }) => {
//   return db.membership.update({
//     where: { id },
//     data: { status },
//   });
// };

export const updateMemberRoles = async ({ id, roles }: { id: string; roles: string[] }) => {
  return db.membership.update({
    where: { id },
    data: {
      roles: {
        set: roles.map((roleId) => ({ id: roleId })),
      },
    },
  });
};

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
