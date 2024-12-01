import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

interface CurrentUser {
  id: string;
  organizationIds: string[];
  globalSettings: {
    defaultOrganizationId?: string;
    [key: string]: any; // To allow for other global settings if needed
  };
}

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  memberships: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).memberships()
  },
  assignment: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).assignment()
  },
  event: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).event()
  },
}


export const setDefaultOrganization: MutationResolvers['setDefaultOrganization'] = async (
  { organizationId },
  { currentUser }
) => {
  if (!currentUser.organizationIds.includes(organizationId)) {
    throw new Error('You do not have access to this organization.');
  }

  return await db.user.update({
    where: { id: currentUser.id },
    data: {
      globalSettings: {
        ...currentUser.globalSettings,
        defaultOrganizationId: organizationId,
      },
    },
  });
};

