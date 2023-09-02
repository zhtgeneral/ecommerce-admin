// stipe widget

import Stripe from 'stripe'

// this version of stripe contains api key and version
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true
})