import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-auth';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();

  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata) {
          const {
            applicationId,
            password, // Plain password to create auth user
            accountType,
            artistName,
            labelName
          } = session.metadata;

          // Get the application
          const { data: application, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', applicationId)
            .single();

          if (appError || !application) {
            throw new Error('Application not found');
          }

          // Create Supabase Auth user
          const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: application.email,
            password: password,
            email_confirm: true,
            user_metadata: {
              account_type: accountType,
              artist_name: artistName || null,
              label_name: labelName || null,
              company_name: application.first_name + ' ' + application.last_name
            }
          });

          if (authError) {
            throw authError;
          }

          // Update profile with Stripe data
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              account_status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              application_id: applicationId
            })
            .eq('id', authUser.user.id);

          if (profileError) {
            throw profileError;
          }

          // Update application status
          await supabase
            .from('applications')
            .update({
              status: 'payment_complete',
              profile_id: authUser.user.id
            })
            .eq('id', applicationId);

          // Send notification if Slack webhook is configured
          const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
          if (slackWebhookUrl) {
            await fetch(slackWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `New paid user! 🎉`,
                blocks: [
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `*New Paid User* 💳\n*Email:* ${application.email}\n*Type:* ${accountType}\n*Name:* ${accountType === 'artist' ? artistName : labelName}`
                    }
                  }
                ]
              })
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update profile subscription status
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await supabase
            .from('profiles')
            .update({
              account_status: 'cancelled',
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);
        } else if (subscription.status === 'active') {
          await supabase
            .from('profiles')
            .update({
              account_status: 'active',
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}