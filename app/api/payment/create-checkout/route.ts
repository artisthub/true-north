import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-auth';
import { stripe, SUBSCRIPTION_PRICE, PRODUCT_NAME } from '@/lib/stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();

  try {
    const { token, applicationId, password } = await request.json();

    if (!token || !applicationId || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .eq('payment_link_token', token)
      .eq('status', 'approved')
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: 'Invalid application' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRODUCT_NAME,
              description: `Annual membership for ${application.account_type === 'artist' ? application.artist_name : application.label_name}`,
            },
            unit_amount: SUBSCRIPTION_PRICE * 100, // Convert to cents
            recurring: {
              interval: 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?token=${token}`,
      customer_email: application.email,
      metadata: {
        applicationId: application.id,
        password, // Send plain password for Supabase Auth user creation
        accountType: application.account_type,
        artistName: application.artist_name || '',
        labelName: application.label_name || '',
      },
    });

    return NextResponse.json({
      sessionId: session.id
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}