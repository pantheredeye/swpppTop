export const schema = gql`
  type Organization {
    id: String!
    name: String!
    createdAt: DateTime!
    type: String!
    users: [Membership]!
    sites: [Site]!
    settings: JSON
    billingEmail: String
    stripeCustomerId: String
    inspection: [Inspection]!
    event: [Event]!
    membershipRoles: [MembershipRole]!
    media: [Media]!
    inspectionEventDetails: [InspectionEventDetails]!
    assignment: [Assignment]!
    permission: [Permission]!
    deletedAt: DateTime
    status: OrganizationStatus!
    User: [User]!
  }

  type UserOrganization {
    id: String!
    name: String!
    status: String!
    type: String
  }

  enum OrganizationStatus {
    ACTIVE
    SUSPENDED
    ARCHIVED
    PENDING
  }

  type Query {
    organizations: [Organization!]! @requireAuth
    organization(id: String!): Organization @requireAuth
    userOrganizations: [UserOrganization!]! @requireAuth
  }

  input CreateOrganizationInput {
    name: String!
    type: String!
    settings: JSON
    billingEmail: String
    stripeCustomerId: String
    deletedAt: DateTime
    status: OrganizationStatus!
  }

  input UpdateOrganizationInput {
    name: String
    type: String
    settings: JSON
    billingEmail: String
    stripeCustomerId: String
    deletedAt: DateTime
    status: OrganizationStatus
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
      @requireAuth

    updateOrganization(
      id: String!
      input: UpdateOrganizationInput!
    ): Organization! @requireAuth

    deleteOrganization(id: String!): Organization! @requireAuth

    setDefaultOrganization(id: String!): User! @requireAuth
  }
`;
// deleteOrganization(id: String!): Organization! @requireAuth(roles: ["OWNER"])
