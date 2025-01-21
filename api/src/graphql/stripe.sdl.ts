export const schema = gql`
  type StripePortalResponse {
    url: String!
  }

  input CreateBillingPortalSessionInput {
    organizationId: String!
  }

  type Mutation {
    createBillingPortalSession(input: CreateBillingPortalSessionInput!): StripePortalResponse! @requireAuth
    createStripeCheckoutSession(organizationId: String!, priceId: String!): StripePortalResponse! @requireAuth

  }
`
