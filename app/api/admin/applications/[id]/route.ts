import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function GET(
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
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Admin application fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = await request.json();
    const { status, review_notes } = body;

    if (!status || !['approved', 'denied'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the application first
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError) throw fetchError;

    // Update application status
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
      review_notes: review_notes || null
    };

    // If approved, generate payment link token
    if (status === 'approved') {
      updateData.payment_link_token = crypto.randomBytes(32).toString('hex');
      updateData.payment_link_sent_at = new Date().toISOString();
    }

    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send notification email (in production, use a proper email service)
    if (status === 'approved') {
      const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?token=${updateData.payment_link_token}`;
      
      // Log the payment URL for now
      console.log('Payment URL for approved application:', paymentUrl);

      // Send Slack notification if configured
      const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (slackWebhookUrl) {
        try {
          await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `Application approved for ${application.first_name} ${application.last_name}`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Application Approved* ✅\n*Name:* ${application.first_name} ${application.last_name}\n*Email:* ${application.email}\n*Type:* ${application.account_type}\n*Payment Link:* ${paymentUrl}`
                  }
                }
              ]
            })
          });
        } catch (slackError) {
          console.error('Failed to send Slack notification:', slackError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      paymentUrl: status === 'approved' ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?token=${updateData.payment_link_token}` : null
    });

  } catch (error) {
    console.error('Admin application update error:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}