import type {
  QueryResolvers,
  MutationResolvers,
  MembershipRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

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
      status: true
    },
  })
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
