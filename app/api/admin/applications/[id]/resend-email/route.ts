import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendApplicationAcceptedEmailInline } from '@/lib/email';
import crypto from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status !== 'approved') {
      return NextResponse.json(
        { error: 'Can only resend email for approved applications' },
        { status: 400 }
      );
    }

    let paymentLinkToken = application.payment_link_token;
    if (!paymentLinkToken) {
      paymentLinkToken = crypto.randomBytes(32).toString('hex');
      await supabase
        .from('applications')
        .update({
          payment_link_token: paymentLinkToken,
          payment_link_sent_at: new Date().toISOString()
        })
        .eq('id', params.id);
    }

    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?token=${paymentLinkToken}`;
    const annualFee = process.env.NEXT_PUBLIC_ANNUAL_FEE || '999';

    await sendApplicationAcceptedEmailInline({
      firstName: application.first_name,
      lastName: application.last_name,
      email: application.email,
      accountType: application.account_type,
      entityName: application.account_type === 'artist'
        ? (application.artist_name || '')
        : (application.label_name || ''),
      applicationId: application.id,
      paymentLink,
      annualFee
    });

    return NextResponse.json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Resend email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
