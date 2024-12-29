import type {
  QueryResolvers,
  MutationResolvers,
  PermissionRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const permissions: QueryResolvers["permissions"] = () => {
  return db.permission.findMany();
};

export const permission: QueryResolvers["permission"] = ({ id }) => {
  return db.permission.findUnique({
    where: { id },
  });
};

export const createPermission: MutationResolvers["createPermission"] = ({
  input,
}) => {
  return db.permission.create({
    data: input,
  });
};

export const updatePermission: MutationResolvers["updatePermission"] = ({
  id,
  input,
}) => {
  return db.permission.update({
    data: input,
    where: { id },
  });
};

export const deletePermission: MutationResolvers["deletePermission"] = ({
  id,
}) => {
  return db.permission.delete({
    where: { id },
  });
};

export const Permission: PermissionRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.permission.findUnique({ where: { id: root?.id } }).organization();
  },
  rolePermissions: (_obj, { root }) => {
    return db.permission
      .findUnique({ where: { id: root?.id } })
      .rolePermissions();
  },
};
