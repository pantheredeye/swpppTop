import { db } from 'src/lib/db'
import Stripe from 'stripe'
import { OrganizationStatus } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

interface StripeEvent {
  type: string
  data: {
    object: Stripe.Subscription
  }
}

export const handler = async (event: { body: string; headers: { [key: string]: string } }) => {
  try {
    const sig = event.headers['stripe-signature']
    let stripeEvent: StripeEvent

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        endpointSecret
      ) as StripeEvent
    } catch (err) {
      return {
        statusCode: 400,
        body: `Webhook Error: ${err.message}`,
      }
    }

    switch (stripeEvent.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object

        await db.organization.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
            priceId: subscription.items.data[0]?.price.id,
            status: getOrgStatus(subscription.status)
          },
        })
        break
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

const getOrgStatus = (stripeStatus: string): OrganizationStatus => {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE'
    case 'past_due':
    case 'unpaid':
      return 'SUSPENDED'
    case 'canceled':
      return 'ARCHIVED'
    default:
      return 'PENDING'
  }
}
