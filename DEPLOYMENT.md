# Deployment Guide

## Environment Variables Required for Vercel

The following environment variables must be set in Vercel:

### Supabase Configuration (Required)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (keep secret!)

### Admin Configuration (Required)
- `ADMIN_PASSWORD` - Password for admin panel access

### Stripe Configuration (Required for payments)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_ANNUAL_FEE` - Annual subscription fee (e.g., 999)

### Email Configuration (Required)
- `POSTMARK_SERVER_TOKEN` - Postmark API token
- `POSTMARK_FROM_EMAIL` - From email address for notifications

### App Configuration (Required)
- `NEXT_PUBLIC_APP_URL` - Full URL of your deployment (e.g., https://truenorth.vercel.app)

### Optional
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select the "True North" project
3. Go to Settings → Environment Variables
4. Add each variable listed above
5. Make sure to select the appropriate environments (Production, Preview, Development)

## Database Setup

Make sure your Supabase database has all the required tables and migrations applied.

## Post-Deployment Checklist

- [ ] Test login functionality at /login
- [ ] Test application form at /apply
- [ ] Test admin panel at /admin/login
- [ ] Test pitch submission at /pitch (requires login)
- [ ] Verify email sending works
- [ ] Test Stripe payment flow