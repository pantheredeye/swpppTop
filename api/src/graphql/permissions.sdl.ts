export const schema = gql`
  type Permission {
    id: String!
    action: Action!
    subject: String!
    conditions: JSON
    description: String
    organization: Organization
    organizationId: String
    rolePermissions: [RolePermission]!
    isSystemDefined: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum Action {
    CREATE
    READ
    WRITE
    DELETE
  }

  type Query {
    permissions: [Permission!]! @requireAuth
    permission(id: String!): Permission @requireAuth
  }

  input CreatePermissionInput {
    action: Action!
    subject: String!
    conditions: JSON
    description: String
    organizationId: String
    isSystemDefined: Boolean!
  }

  input UpdatePermissionInput {
    action: Action
    subject: String
    conditions: JSON
    description: String
    organizationId: String
    isSystemDefined: Boolean
  }

  type Mutation {
    createPermission(input: CreatePermissionInput!): Permission! @requireAuth
    updatePermission(id: String!, input: UpdatePermissionInput!): Permission!
      @requireAuth
    deletePermission(id: String!): Permission! @requireAuth
  }
`;
