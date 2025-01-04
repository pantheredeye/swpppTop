import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const users: QueryResolvers["users"] = () => {
  return db.user.findMany();
};

export const user: QueryResolvers["user"] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  });
};

export const searchUsers: QueryResolvers["searchUsers"] = async ({
  organizationId,
  searchTerm
}) => {
  if (searchTerm.length < 3) {
    return []
  }

  return db.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        // Exclude users who are already members or invited
        {
          memberships: {
            none: {
              organizationId,
              deletedAt: null,
              OR: [
                { status: 'ACTIVE' },
                { status: 'INVITED' },
                { status: 'PENDING' }
              ]
            }
          }
        }
      ]
    },
    take: 10
  })
}

export const createUser: MutationResolvers["createUser"] = ({ input }) => {
  return db.user.create({
    data: input,
  });
};

export const updateUser: MutationResolvers["updateUser"] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  });
};

export const deleteUser: MutationResolvers["deleteUser"] = ({ id }) => {
  return db.user.delete({
    where: { id },
  });
};

export const User: UserRelationResolvers = {
  memberships: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).memberships();
  },
  defaultOrganization: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .defaultOrganization();
  },
  assignment: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).assignment();
  },
  event: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).event();
  },
};
