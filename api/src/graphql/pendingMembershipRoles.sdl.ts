export const schema = gql`
  type PendingMembershipRole {
    id: String!
    membership: Membership!
    membershipId: String!
    role: MembershipRole!
    roleId: String!
    createdAt: DateTime!
    expiresAt: DateTime
  }

  type Query {
    pendingMembershipRoles: [PendingMembershipRole!]! @requireAuth
    pendingMembershipRole(id: String!): PendingMembershipRole @requireAuth
  }

  input CreatePendingMembershipRoleInput {
    membershipId: String!
    roleId: String!
    expiresAt: DateTime
  }

  input UpdatePendingMembershipRoleInput {
    membershipId: String
    roleId: String
    expiresAt: DateTime
  }

  type Mutation {
    createPendingMembershipRole(
      input: CreatePendingMembershipRoleInput!
    ): PendingMembershipRole! @requireAuth
    updatePendingMembershipRole(
      id: String!
      input: UpdatePendingMembershipRoleInput!
    ): PendingMembershipRole! @requireAuth
    deletePendingMembershipRole(id: String!): PendingMembershipRole!
      @requireAuth
  }
`
