import { db } from 'src/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const handler = async (event) => {
  try {
    const sig = event.headers['stripe-signature']
    let stripeEvent

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        endpointSecret
      )
    } catch (err) {
      return {
        statusCode: 400,
        body: `Webhook Error: ${err.message}`,
      }
    }

    switch (stripeEvent.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object
        await db.organization.update({
          where: {
            stripeCustomerId: subscription.customer
          },
          data: {
            // Update organization based on subscription status
            status: subscription.status === 'active' ? 'ACTIVE' : 'SUSPENDED',
          },
        })
        break

      // Add more webhook event handlers as needed
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    }
  }
}
