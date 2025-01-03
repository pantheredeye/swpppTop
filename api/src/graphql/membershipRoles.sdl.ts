export const schema = gql`
  type MembershipRole {
    id: String!
    name: String!
    organization: Organization
    organizationId: String
    permissions: [RolePermission]!
    memberships: [Membership]!
    isSystemDefined: Boolean!
    PendingMembershipRole: [PendingMembershipRole]!
  }

type FindMembershipRoles {
    id: String!
    name: String!
    organization: Organization
    organizationId: String
    permissions: [RolePermission]!
    isSystemDefined: Boolean!
}

  type Query {
    membershipRoles: [MembershipRole!]! @requireAuth
    membershipRole(id: String!): MembershipRole @requireAuth
    findMembershipRoles(isSystemDefined: Boolean, organizationId: String): [FindMembershipRoles!]! @requireAuth
  }

  input CreateMembershipRoleInput {
    name: String!
    organizationId: String
    isSystemDefined: Boolean!
  }

  input UpdateMembershipRoleInput {
    name: String
    organizationId: String
    isSystemDefined: Boolean
  }

  type Mutation {
    createMembershipRole(input: CreateMembershipRoleInput!): MembershipRole!
      @requireAuth
    updateMembershipRole(
      id: String!
      input: UpdateMembershipRoleInput!
    ): MembershipRole! @requireAuth
    deleteMembershipRole(id: String!): MembershipRole! @requireAuth
  }
`
