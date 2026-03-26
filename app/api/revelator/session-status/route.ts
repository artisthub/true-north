import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-auth';
import { stripe } from '@/lib/stripe';
import { loginUnprompted, buildRedirectUrl } from '@/lib/revelator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { status: 'error', message: 'Missing session_id' },
      { status: 400 }
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { status: 'error', message: 'Payment system not configured' },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.applicationId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid session' },
        { status: 400 }
      );
    }

    const applicationId = session.metadata.applicationId;

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('profile_id, status')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json({ status: 'pending' });
    }

    if (application.status !== 'payment_complete' || !application.profile_id) {
      return NextResponse.json({ status: 'pending' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('revelator_setup_status, revelator_enterprise_id, id')
      .eq('id', application.profile_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ status: 'pending' });
    }

    if (profile.revelator_setup_status === 'failed') {
      console.error('Revelator setup failed, redirecting without token');
      return NextResponse.json({
        status: 'ready',
        redirectUrl: process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com'
      });
    }

    if (profile.revelator_setup_status !== 'complete') {
      return NextResponse.json({ status: 'pending' });
    }

    try {
      const loginResult = await loginUnprompted(profile.id);
      const redirectUrl = buildRedirectUrl(loginResult.accessToken);

      return NextResponse.json({
        status: 'ready',
        redirectUrl
      });
    } catch (loginError) {
      console.error('Revelator unprompted login failed, redirecting without token:', loginError);
      return NextResponse.json({
        status: 'ready',
        redirectUrl: process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com'
      });
    }

  } catch (error) {
    console.error('Session status check error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to check session status' },
      { status: 500 }
    );
  }
}
