export const schema = gql`
  type MembershipRole {
    id: String!
    name: String!
    scope: PermissionScope!
    membership: [Membership]!
    organization: Organization!
    organizationId: String!
    permissions: [RolePermission]!
    createdAt: DateTime!
    updatedAt: DateTime!
    PendingMembershipRole: [PendingMembershipRole]!
  }

  enum PermissionScope {
    GLOBAL
    ORGANIZATION
    CUSTOM
  }

  type Query {
    membershipRoles: [MembershipRole!]! @requireAuth
    membershipRole(id: String!): MembershipRole @requireAuth
  }

  input CreateMembershipRoleInput {
    name: String!
    scope: PermissionScope!
    organizationId: String!
  }

  input UpdateMembershipRoleInput {
    name: String
    scope: PermissionScope
    organizationId: String
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
`;
