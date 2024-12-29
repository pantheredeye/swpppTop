export const schema = gql`
  type RolePermission {
    id: String!
    role: MembershipRole!
    roleId: String!
    permission: Permission!
    permissionId: String!
    fields: [String]!
    inverted: Boolean!
    createdAt: DateTime!
  }

  type Query {
    rolePermissions: [RolePermission!]! @requireAuth
    rolePermission(id: String!): RolePermission @requireAuth
  }

  input CreateRolePermissionInput {
    roleId: String!
    permissionId: String!
    fields: [String]!
    inverted: Boolean!
  }

  input UpdateRolePermissionInput {
    roleId: String
    permissionId: String
    fields: [String]!
    inverted: Boolean
  }

  type Mutation {
    createRolePermission(input: CreateRolePermissionInput!): RolePermission!
      @requireAuth
    updateRolePermission(
      id: String!
      input: UpdateRolePermissionInput!
    ): RolePermission! @requireAuth
    deleteRolePermission(id: String!): RolePermission! @requireAuth
  }
`;
