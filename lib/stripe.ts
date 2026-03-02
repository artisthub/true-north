import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Stripe secret key not configured. Please add STRIPE_SECRET_KEY to your .env.local file.');
}

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  : null;

export const SUBSCRIPTION_PRICE = 59; // $59/year
export const PRODUCT_NAME = 'True North Annual Membership';
export const STRIPE_PRODUCT_ID = 'prod_U4mWqn0ljX30ws';
export const STRIPE_PRICE_ID = 'price_1T6cxuB0baJBIUTXR0Wiq9DF';