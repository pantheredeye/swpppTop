import type {
  QueryResolvers,
  MutationResolvers,
  PendingMembershipRoleRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const pendingMembershipRoles: QueryResolvers["pendingMembershipRoles"] =
  () => {
    return db.pendingMembershipRole.findMany();
  };

export const pendingMembershipRole: QueryResolvers["pendingMembershipRole"] = ({
  id,
}) => {
  return db.pendingMembershipRole.findUnique({
    where: { id },
  });
};

export const createPendingMembershipRole: MutationResolvers["createPendingMembershipRole"] =
  ({ input }) => {
    return db.pendingMembershipRole.create({
      data: input,
    });
  };

export const updatePendingMembershipRole: MutationResolvers["updatePendingMembershipRole"] =
  ({ id, input }) => {
    return db.pendingMembershipRole.update({
      data: input,
      where: { id },
    });
  };

export const deletePendingMembershipRole: MutationResolvers["deletePendingMembershipRole"] =
  ({ id }) => {
    return db.pendingMembershipRole.delete({
      where: { id },
    });
  };

export const PendingMembershipRole: PendingMembershipRoleRelationResolvers = {
  membership: (_obj, { root }) => {
    return db.pendingMembershipRole
      .findUnique({ where: { id: root?.id } })
      .membership();
  },
  role: (_obj, { root }) => {
    return db.pendingMembershipRole
      .findUnique({ where: { id: root?.id } })
      .role();
  },
};
