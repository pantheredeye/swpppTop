export const schema = gql`
  type User {
    id: String!
    email: String!
    hashedPassword: String!
    salt: String!
    firstName: String
    lastName: String
    phoneNumber: String
    createdAt: DateTime!
    updatedAt: DateTime!
    memberships: [Membership]!
    globalSettings: JSON
    defaultOrganization: Organization!
    defaultOrganizationId: String!
    assignment: [Assignment]!
    event: [Event]!
    lastLoginAt: DateTime
    loginAttempts: Int!
    isLocked: Boolean!
    passwordChangedAt: DateTime
    deletedAt: DateTime
    isActive: Boolean!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    hashedPassword: String!
    salt: String!
    firstName: String
    lastName: String
    phoneNumber: String
    globalSettings: JSON
    defaultOrganizationId: String!
    lastLoginAt: DateTime
    loginAttempts: Int!
    isLocked: Boolean!
    passwordChangedAt: DateTime
    deletedAt: DateTime
    isActive: Boolean!
  }

  input UpdateUserInput {
    email: String
    hashedPassword: String
    salt: String
    firstName: String
    lastName: String
    phoneNumber: String
    globalSettings: JSON
    defaultOrganizationId: String
    lastLoginAt: DateTime
    loginAttempts: Int
    isLocked: Boolean
    passwordChangedAt: DateTime
    deletedAt: DateTime
    isActive: Boolean
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
