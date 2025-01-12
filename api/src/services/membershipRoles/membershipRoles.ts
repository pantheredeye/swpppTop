import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  MembershipRoleRelationResolvers,
  Action,
} from 'types/graphql'

import { db } from 'src/lib/db'

export async function assignSystemRoleToMembership(
  membershipId: string,
  systemRoleName: string,
  tx: Prisma.TransactionClient
) {
  const systemRole = await tx.membershipRole.findFirst({
    where: {
      name: systemRoleName,
      isSystemDefined: true,
    },
  })

  if (!systemRole) {
    throw new Error(`System role "${systemRoleName}" not found`)
  }

  await tx.membership.update({
    where: { id: membershipId },
    data: {
      roles: {
        connect: { id: systemRole.id },
      },
    },
  })

  return systemRole
}

export async function createCustomRole(
  organizationId: string,
  name: string,
  permissions: {
    action: Action
    subject: string
    conditions?: Prisma.InputJsonValue
  }[]
) {
  return db.$transaction(async (tx) => {
    // Create custom permissions
    const createdPermissions = await Promise.all(
      permissions.map((p) =>
        tx.permission.create({
          data: {
            action: p.action,
            subject: p.subject,
            conditions: p.conditions,
            organizationId,
            isSystemDefined: false,
          },
        })
      )
    )

    // Create custom role and link permissions
    return tx.membershipRole.create({
      data: {
        name,
        organizationId,
        isSystemDefined: false,
        permissions: {
          create: createdPermissions.map((p) => ({
            permissionId: p.id,
          })),
        },
      },
    })
  })
}

export const membershipRoles: QueryResolvers['membershipRoles'] = () => {
  return db.membershipRole.findMany()
}

export const membershipRole: QueryResolvers['membershipRole'] = ({ id }) => {
  return db.membershipRole.findUnique({
    where: { id },
  })
}

export const findMembershipRoles: QueryResolvers['findMembershipRoles'] = ({
  isSystemDefined,
  organizationId,
  excludeRoles,
}) => {
  return db.membershipRole.findMany({
    where: {
      AND: [
        {
          OR: [
            { isSystemDefined: isSystemDefined ?? true },
            { organizationId: organizationId },
          ],
        },
        excludeRoles && excludeRoles.length > 0
          ? { name: { notIn: excludeRoles } }
          : {},
      ],
    },
    select: {
      id: true,
      name: true,
      organization: true,
      organizationId: true,
      permissions: true,
      isSystemDefined: true,
    },
  })
}

export const createMembershipRole: MutationResolvers['createMembershipRole'] =
  ({ input }) => {
    return db.membershipRole.create({
      data: input,
    })
  }

export const updateMembershipRole: MutationResolvers['updateMembershipRole'] =
  ({ id, input }) => {
    return db.membershipRole.update({
      data: input,
      where: { id },
    })
  }

export const deleteMembershipRole: MutationResolvers['deleteMembershipRole'] =
  ({ id }) => {
    return db.membershipRole.delete({
      where: { id },
    })
  }

export const MembershipRole: MembershipRoleRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.membershipRole
      .findUnique({ where: { id: root?.id } })
      .organization()
  },
  permissions: (_obj, { root }) => {
    return db.membershipRole
      .findUnique({ where: { id: root?.id } })
      .permissions()
  },
  memberships: (_obj, { root }) => {
    return db.membershipRole
      .findUnique({ where: { id: root?.id } })
      .memberships()
  },
  PendingMembershipRole: (_obj, { root }) => {
    return db.membershipRole
      .findUnique({ where: { id: root?.id } })
      .PendingMembershipRole()
  },
}
