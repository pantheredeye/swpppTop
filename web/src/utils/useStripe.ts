// web/src/hooks/useStripe.js
import { useMutation } from '@redwoodjs/web'

const CREATE_BILLING_PORTAL_SESSION = gql`
  mutation CreateBillingPortalSession($input: CreateBillingPortalSessionInput!) {
    createBillingPortalSession(input: $input) {
      url
    }
  }
`

const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($organizationId: String!, $priceId: String!) {
    createStripeCheckoutSession(organizationId: $organizationId, priceId: $priceId) {
      url
    }
  }
`

export const useStripe = () => {
  const [createPortalSession] = useMutation(CREATE_BILLING_PORTAL_SESSION)
  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION)

  const redirectToBillingPortal = async (organizationId) => {
    try {
      const { data } = await createPortalSession({
        variables: { organizationId },
      })
      window.location.href = data.createBillingPortalSession.url
    } catch (error) {
      console.error('Error redirecting to billing portal:', error)
      // toast.error('Failed to access billing portal')
    }
  }

  const redirectToCheckout = async (organizationId, priceId) => {
    try {
      const { data } = await createCheckoutSession({
        variables: { organizationId, priceId },
      })
      window.location.href = data.createStripeCheckoutSession.url
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      // toast.error('Failed to start checkout process')
    }
  }

  return {
    redirectToBillingPortal,
    redirectToCheckout,
  }
}
