export const schema = gql`
  type Membership {
    id: String!
    user: User!
    userId: String!
    organization: Organization!
    organizationId: String!
    deletedAt: DateTime
    roles: [MembershipRole]!
    settings: JSON
    invitationId: String
    invitedEmail: String
    invitationExpiresAt: DateTime
    invitedAt: DateTime
    joinedAt: DateTime
    invitationAttempts: Int!
    lastInvitationSent: DateTime
    invitationChannel: InvitationChannel!
    assignment: [Assignment]!
    event: [Event]!
    media: [Media]!
    auditLog: [AuditLog]!
    status: MembershipStatus!
    deactivationReason: String
  }

  type Members {
    id: String!
    user: User!
    deletedAt: DateTime
    roles: [MembershipRole]!
    settings: JSON
    invitationId: String
    invitedEmail: String
    invitationExpiresAt: DateTime
    invitedAt: DateTime
    joinedAt: DateTime
    lastInvitationSent: DateTime
    status: MembershipStatus!
    deactivationReason: String
  }

  type InviteMemberResponse {
    userId: String!
    organizationId: String!
    status: MembershipStatus!
  }

  type InviteMemberResult {
    userId: String
    email: String!
    status: MembershipStatus!
    roles: [MembershipRole!]!
  }

  type InviteFailureResult {
    email: String!
    error: String!
  }

  type InviteMembersResponse {
    successful: [InviteMemberResult!]!
    failed: [InviteFailureResult!]!
  }

  enum InvitationChannel {
    EMAIL
    SLACK
    INTERNAL
    EXTERNAL
  }

  enum MembershipStatus {
    INVITED
    ACTIVE
    SUSPENDED
    PENDING
  }

  type Query {
    memberships: [Membership!]! @requireAuth
    membership(id: String!): Membership @requireAuth
    findOrgMembers(organizationId: String!): [Members!]! @requireAuth
  }

  input CreateMembershipInput {
    userId: String!
    organizationId: String!
    deletedAt: DateTime
    settings: JSON
    invitationId: String
    invitedEmail: String
    invitationExpiresAt: DateTime
    invitedAt: DateTime
    joinedAt: DateTime
    invitationAttempts: Int!
    lastInvitationSent: DateTime
    invitationChannel: InvitationChannel!
    status: MembershipStatus!
    deactivationReason: String
  }

  input UpdateMembershipInput {
    userId: String
    organizationId: String
    deletedAt: DateTime
    settings: JSON
    invitationId: String
    invitedEmail: String
    invitationExpiresAt: DateTime
    invitedAt: DateTime
    joinedAt: DateTime
    invitationAttempts: Int
    lastInvitationSent: DateTime
    invitationChannel: InvitationChannel
    status: MembershipStatus
    deactivationReason: String
  }

  input InviteMemberInput {
    userId: String
    email: String!
    roleIds: [String!]!
  }

  input InviteMembersInput {
    organizationId: String!
    invites: [InviteMemberInput!]!
  }

  type RevokeAccessResponse {
    success: Boolean!
    message: String
    deletedMembership: Membership
  }
  type Mutation {
    createMembership(input: CreateMembershipInput!): Membership! @requireAuth
    updateMembership(id: String!, input: UpdateMembershipInput!): Membership!
      @requireAuth
    deleteMembership(id: String!): Membership! @requireAuth
    inviteMember(
      organizationId: String!
      userId: String!
      roleId: String!
    ): InviteMemberResponse! @requireAuth
    revokeAccess(id: String!): RevokeAccessResponse! @requireAuth

    suspendMember(id: String!, status: MembershipStatus!): Membership!
      @requireAuth
    updateMemberRoles(id: String!, roles: [String!]!): Membership! @requireAuth
    inviteMembers(input: InviteMembersInput!): InviteMembersResponse!
      @requireAuth
  }
`
