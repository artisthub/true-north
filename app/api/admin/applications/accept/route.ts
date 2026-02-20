import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendApplicationAcceptedEmailInline } from '@/lib/postmark';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if already accepted or payment complete
    if (application.status === 'approved' || application.status === 'payment_complete') {
      return NextResponse.json(
        { error: 'Application already approved' },
        { status: 400 }
      );
    }

    // Update application status to approved
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (updateError) {
      throw updateError;
    }

    // Generate payment link
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?id=${applicationId}`;
    const annualFee = process.env.NEXT_PUBLIC_ANNUAL_FEE || '999';

    // Send acceptance email
    try {
      await sendApplicationAcceptedEmailInline({
        firstName: application.first_name,
        lastName: application.last_name,
        email: application.email,
        accountType: application.account_type,
        entityName: application.account_type === 'artist' 
          ? application.artist_name 
          : application.label_name,
        applicationId: application.id,
        paymentLink,
        annualFee
      });
    } catch (emailError) {
      console.error('Failed to send acceptance email:', emailError);
      // Don't fail the acceptance if email fails
    }

    // Send Slack notification if configured
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhookUrl) {
      try {
        await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `Application approved! 🎉`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Application Approved*`
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*Applicant:*\n${application.first_name} ${application.last_name}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Type:*\n${application.account_type}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*${application.account_type === 'artist' ? 'Artist' : 'Label'}:*\n${application.account_type === 'artist' ? application.artist_name : application.label_name}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Email:*\n${application.email}`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Payment link sent: ${paymentLink}`
                }
              }
            ]
          })
        });
      } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application approved successfully',
      paymentLink
    });

  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json(
      { error: 'Failed to approve application' },
      { status: 500 }
    );
  }
}