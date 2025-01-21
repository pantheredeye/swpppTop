import { db } from 'src/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createBillingPortalSession = async ({ input }) => {
  const { organizationId } = input

  // Get current user's membership in the organization
  const currentUser = context.currentUser
  const membership = await db.membership.findFirst({
    where: {
      userId: currentUser.id,
      organizationId: organizationId,
      status: 'ACTIVE',
    },
  })

  if (!membership) {
    throw new Error('Not authorized to access billing for this organization')
  }

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      stripeCustomerId: true,
      billingEmail: true,
      name: true
    }
  })

  if (!organization) {
    throw new Error('Organization not found')
  }

  let { stripeCustomerId } = organization

  // If no Stripe customer exists, create one
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      // TODO: look into currentUser email
      // email: organization.billingEmail || currentUser.email, <-- look into this
      email: organization.billingEmail,
      name: organization.name,
      metadata: {
        organizationId: organizationId
      }
    })

    stripeCustomerId = customer.id

    await db.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customer.id }
    })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.REDWOOD_ENV_FRONTEND_URL}/settings`,
  })

  return {
    url: session.url
  }
}
export const createStripeCheckoutSession = async ({ organizationId, priceId }) => {
  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      stripeCustomerId: true,
      name: true,
      billingEmail: true
    }
  })

  let customer = organization?.stripeCustomerId

  if (!customer) {
    const newCustomer = await stripe.customers.create({
      email: organization.billingEmail,
      name: organization.name,
      metadata: {
        organizationId: organizationId
      }
    })

    customer = newCustomer.id

    await db.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customer }
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customer,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    success_url: `${process.env.REDWOOD_ENV_FRONTEND_URL}/settings?success=true`,
    cancel_url: `${process.env.REDWOOD_ENV_FRONTEND_URL}/settings?canceled=true`,
  })

  return {
    url: session.url
  }
}
