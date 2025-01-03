import type {
  QueryResolvers,
  MutationResolvers,
  PermissionRelationResolvers,
  Action,
} from 'types/graphql'

import { db } from 'src/lib/db'

export async function checkPermission(
  userId: string,
  organizationId: string,
  action: Action,
  subject: string
) {
  const membership = await db.membership.findFirst({
    where: {
      userId,
      organizationId,
      status: 'ACTIVE',
      deletedAt: null,
    },
    include: {
      roles: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  })

  if (!membership) return false

  // Check both system-defined and organization-specific permissions
  return membership.roles.some((role) =>
    role.permissions.some((rp) => {
      const permission = rp.permission
      return (
        permission.action === action &&
        permission.subject === subject &&
        // Permission is valid if it's either:
        // 1. A system-defined permission
        // 2. An org-specific permission matching the current org
        (permission.isSystemDefined ||
          permission.organizationId === organizationId)
      )
    })
  )
}

export const permissions: QueryResolvers['permissions'] = () => {
  return db.permission.findMany()
}

export const permission: QueryResolvers['permission'] = ({ id }) => {
  return db.permission.findUnique({
    where: { id },
  })
}

export const createPermission: MutationResolvers['createPermission'] = ({
  input,
}) => {
  return db.permission.create({
    data: input,
  })
}

export const updatePermission: MutationResolvers['updatePermission'] = ({
  id,
  input,
}) => {
  return db.permission.update({
    data: input,
    where: { id },
  })
}

export const deletePermission: MutationResolvers['deletePermission'] = ({
  id,
}) => {
  return db.permission.delete({
    where: { id },
  })
}

export const Permission: PermissionRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.permission.findUnique({ where: { id: root?.id } }).organization()
  },
  rolePermissions: (_obj, { root }) => {
    return db.permission
      .findUnique({ where: { id: root?.id } })
      .rolePermissions()
  },
}
