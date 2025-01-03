import type {
  QueryResolvers,
  MutationResolvers,
  RolePermissionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const rolePermissions: QueryResolvers['rolePermissions'] = () => {
  return db.rolePermission.findMany()
}

export const rolePermission: QueryResolvers['rolePermission'] = ({ id }) => {
  return db.rolePermission.findUnique({
    where: { id },
  })
}

export const createRolePermission: MutationResolvers['createRolePermission'] =
  ({ input }) => {
    return db.rolePermission.create({
      data: input,
    })
  }

export const updateRolePermission: MutationResolvers['updateRolePermission'] =
  ({ id, input }) => {
    return db.rolePermission.update({
      data: input,
      where: { id },
    })
  }

export const deleteRolePermission: MutationResolvers['deleteRolePermission'] =
  ({ id }) => {
    return db.rolePermission.delete({
      where: { id },
    })
  }

export const RolePermission: RolePermissionRelationResolvers = {
  role: (_obj, { root }) => {
    return db.rolePermission.findUnique({ where: { id: root?.id } }).role()
  },
  permission: (_obj, { root }) => {
    return db.rolePermission
      .findUnique({ where: { id: root?.id } })
      .permission()
  },
}
