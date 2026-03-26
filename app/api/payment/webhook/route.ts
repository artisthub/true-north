import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-auth';
import { stripe } from '@/lib/stripe';
import { createAccount } from '@/lib/revelator';
import { sendWelcomeRevelatorEmailInline } from '@/lib/email';
import Stripe from 'stripe';

import crypto from 'crypto';

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
              application_id: applicationId,
              revelator_setup_status: 'pending'
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

          // Create Revelator account
          let revelatorResult: { enterpriseId: number } | null = null;
          let revelatorError: string | null = null;

          try {
            const revelatorAccountType = accountType === 'artist' ? 'Launch' : 'Growth';
            const enterpriseName = accountType === 'artist'
              ? (artistName || `${application.first_name} ${application.last_name}`)
              : (labelName || application.company_name || `${application.first_name} ${application.last_name}`);

            revelatorResult = await createAccount({
              email: application.email,
              password: crypto.randomBytes(24).toString('hex'),
              enterpriseName,
              firstname: application.first_name || '',
              lastname: application.last_name || '',
              type: revelatorAccountType as 'Launch' | 'Growth',
              partnerUserId: authUser.user.id,
            });

            await supabase
              .from('profiles')
              .update({
                revelator_enterprise_id: revelatorResult.enterpriseId,
                revelator_setup_status: 'complete',
                revelator_error: null,
              })
              .eq('id', authUser.user.id);

          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            revelatorError = errorMsg;
            console.error('Revelator account creation failed:', errorMsg);

            await supabase
              .from('profiles')
              .update({
                revelator_setup_status: 'failed',
                revelator_error: errorMsg,
              })
              .eq('id', authUser.user.id);
          }

          // Send welcome email (fire and forget)
          sendWelcomeRevelatorEmailInline({
            firstName: application.first_name || '',
            lastName: application.last_name || '',
            email: application.email,
            accountType: accountType as 'artist' | 'label',
            entityName: accountType === 'artist'
              ? (artistName || `${application.first_name} ${application.last_name}`)
              : (labelName || ''),
          }).catch((emailErr) => {
            console.error('Failed to send welcome email:', emailErr);
          });

          // Send notification if Slack webhook is configured
          const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
          if (slackWebhookUrl) {
            const slackBlocks: any[] = [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*New Paid User*\n*Email:* ${application.email}\n*Type:* ${accountType}\n*Name:* ${accountType === 'artist' ? artistName : labelName}`
                }
              }
            ];

            if (revelatorResult) {
              slackBlocks.push({
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Revelator:* Account created (Enterprise ID: ${revelatorResult.enterpriseId})`
                }
              });
            }

            if (revelatorError) {
              slackBlocks.push({
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:warning: *Revelator account creation failed:*\n${revelatorError}`
                }
              });
            }

            await fetch(slackWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: revelatorError
                  ? `New paid user (Revelator setup failed): ${application.email}`
                  : `New paid user! ${application.email}`,
                blocks: slackBlocks
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
              subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);
        } else if (subscription.status === 'active') {
          await supabase
            .from('profiles')
            .update({
              account_status: 'active',
              subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString()
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