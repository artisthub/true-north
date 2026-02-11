import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendApplicationConfirmationEmailInline } from '@/lib/postmark';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.accountType || !data.email || !data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Additional validation for account type specific fields
    if (data.accountType === 'artist' && !data.artistName) {
      return NextResponse.json(
        { error: 'Artist name is required for artist accounts' },
        { status: 400 }
      );
    }

    if (data.accountType === 'label' && !data.labelName) {
      return NextResponse.json(
        { error: 'Label name is required for label accounts' },
        { status: 400 }
      );
    }

    // Check if email already has a pending or approved application
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id, status')
      .eq('email', data.email)
      .in('status', ['pending', 'approved', 'payment_complete'])
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw checkError;
    }

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      );
    }

    // Prepare application data
    const applicationData = {
      account_type: data.accountType,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone || null,

      // Artist fields
      artist_name: data.accountType === 'artist' ? data.artistName : null,
      artist_country: data.accountType === 'artist' ? data.artistCountry : null,
      artist_spotify_url: data.accountType === 'artist' ? data.artistSpotifyUrl : null,
      artist_instagram_handle: data.accountType === 'artist' ? data.artistInstagramHandle : null,
      artist_genre: data.accountType === 'artist' ? data.artistGenre : null,
      artist_sub_genre: data.accountType === 'artist' ? data.artistSubGenre : null,
      artist_years_active: data.accountType === 'artist' && data.artistYearsActive ? parseInt(data.artistYearsActive) : null,
      artist_releases_count: data.accountType === 'artist' && data.artistReleasesCount ? parseInt(data.artistReleasesCount) : null,
      artist_monthly_listeners: data.accountType === 'artist' && data.artistMonthlyListeners ? parseInt(data.artistMonthlyListeners) : null,

      // Label fields
      label_name: data.accountType === 'label' ? data.labelName : null,
      label_country: data.accountType === 'label' ? data.labelCountry : null,
      label_website: data.accountType === 'label' ? data.labelWebsite : null,
      label_roster_size: data.accountType === 'label' && data.labelRosterSize ? parseInt(data.labelRosterSize) : null,
      label_genres: data.accountType === 'label' && data.labelGenres ? data.labelGenres.split(',').map((g: string) => g.trim()) : null,
      label_founded_year: data.accountType === 'label' && data.labelFoundedYear ? parseInt(data.labelFoundedYear) : null,

      // Common fields
      catalog_size: data.catalogSize || null,
      current_distributor: data.currentDistributor || null,
      distribution_goals: data.distributionGoals || null,
      marketing_budget: data.marketingBudget || null,
      team_size: data.teamSize || null,
      revenue_sources: data.revenueSources || [],
      why_true_north: data.whyTrueNorth,
      additional_info: data.additionalInfo || null,

      status: 'pending'
    };

    // Insert application
    const { data: newApplication, error: insertError } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Send confirmation email via Postmark
    try {
      await sendApplicationConfirmationEmailInline({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        accountType: data.accountType,
        entityName: data.accountType === 'artist' ? data.artistName : data.labelName,
        applicationId: newApplication.id
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the application submission if email fails
    }

    // Send Slack notification if webhook is configured
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhookUrl) {
      try {
        await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `New ${data.accountType} application received!`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*New ${data.accountType === 'artist' ? 'Artist' : 'Label'} Application*`
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*Name:*\n${data.firstName} ${data.lastName}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Email:*\n${data.email}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*${data.accountType === 'artist' ? 'Artist' : 'Label'} Name:*\n${data.accountType === 'artist' ? data.artistName : data.labelName}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Country:*\n${data.accountType === 'artist' ? data.artistCountry : data.labelCountry}`
                  }
                ]
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'View in Admin Panel'
                    },
                    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin`
                  }
                ]
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
      applicationId: newApplication.id,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}