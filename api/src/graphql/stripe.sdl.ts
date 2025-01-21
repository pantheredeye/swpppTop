export const schema = gql`
  type StripePortalResponse {
    url: String!
  }

  type Mutation {
    createBillingPortalSession(organizationId: String!): StripePortalResponse! @requireAuth
    createStripeCheckoutSession(organizationId: String!, priceId: String!): StripePortalResponse! @requireAuth
  }
`
