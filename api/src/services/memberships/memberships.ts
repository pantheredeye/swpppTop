import type {
  QueryResolvers,
  MutationResolvers,
  MembershipRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

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

// export const inviteMember: MutationResolvers['inviteMember'] = async ({ organizationId, userId, roleId }) => {
//   try {
//     // First check if membership already exists
//     const existingMembership = await db.membership.findUnique({
//       where: {
//         userId_organizationId: {
//           userId,
//           organizationId,
//         },
//       },
//     });

//     if (existingMembership) {
//       throw new Error('User is already a member of this organization');
//     }

//     const membership = await db.membership.create({
//       data: {
//         userId,
//         organizationId,
//         roles: {
//           connect: [{ id: roleId }],
//         },
//         status: 'INVITED',
//         invitationChannel: 'INTERNAL',
//         invitedAt: new Date(),
//         invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       },
//     });

//     return {
//       userId: membership.userId,
//       organizationId: membership.organizationId,
//       status: membership.status,
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Failed to invite member: ${error.message}`);
//     }
//     throw new Error('Failed to invite member');
//   }
// };

interface InviteMemberInput {
  userId?: string
  email: string
  roleIds: string[]
}

interface InviteMembersInput {
  organizationId: string
  invites: InviteMemberInput[]
}

export const inviteMembers = async ({ input }: { input: InviteMembersInput }) => {
  const { organizationId, invites } = input
  const results = { successful: [], failed: [] }

  await db.$transaction(async (prisma) => {
    for (const invite of invites) {
      try {
        let membership

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
        logger.error(error)
        results.failed.push({
          email: invite.email,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        })
      }
    }
  })

  return results
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
