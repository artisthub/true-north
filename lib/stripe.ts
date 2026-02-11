import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Stripe secret key not configured. Please add STRIPE_SECRET_KEY to your .env.local file.');
}

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  : null;

export const SUBSCRIPTION_PRICE = 59; // $59/year
export const PRODUCT_NAME = 'True North Annual Membership';