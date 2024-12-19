import type {
  QueryResolvers,
  MutationResolvers,
  OrganizationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const organizations: QueryResolvers['organizations'] = () => {
  return db.organization.findMany()
}

export const organization: QueryResolvers['organization'] = ({ id }) => {
  return db.organization.findUnique({
    where: { id },
  })
}

export const createOrganization: MutationResolvers['createOrganization'] = ({
  input,
}) => {
  return db.organization.create({
    data: input,
  })
}

export const updateOrganization: MutationResolvers['updateOrganization'] = ({
  id,
  input,
}) => {
  return db.organization.update({
    data: input,
    where: { id },
  })
}

export const deleteOrganization: MutationResolvers['deleteOrganization'] = ({
  id,
}) => {
  return db.organization.delete({
    where: { id },
  })
}

export const userOrganizations: QueryResolvers['userOrganizations'] = () => {
  const { currentUser } = context
  return db.organization.findMany({
    where: {
      users: {
        some: {
          userId: currentUser.id,
          status: 'ACTIVE',
        },
      },
    },
  })
}

export const setDefaultOrganization: MutationResolvers['setDefaultOrganization'] = async ({ id }) => {
  const { currentUser } = context
  return db.user.update({
    where: { id: currentUser.id },
    data: { defaultOrganizationId: id },
  })
}

export const Organization: OrganizationRelationResolvers = {
  users: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).users()
  },
  sites: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).sites()
  },
  inspection: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).inspection()
  },
  event: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).event()
  },
  membershipRole: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .membershipRole()
  },
  media: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).media()
  },
  inspectionEventDetails: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .inspectionEventDetails()
  },
  assignment: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).assignment()
  },
  permission: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).permission()
  },
}
