import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type FormPayload = {
  name?: string;
  email?: string;
  artistName?: string;
  catalogSize?: string;
  currentDistributor?: string;
  message?: string;
};

const requiredFields: Array<keyof FormPayload> = ['name', 'email', 'artistName'];

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabase) {
    console.error('Supabase client not initialized. Please configure environment variables.');
    return NextResponse.json(
      { error: 'Database connection not configured. Please contact support.' },
      { status: 503 }
    );
  }

  let payload: FormPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const missingField = requiredFields.find((field) => !payload[field]);
  if (missingField) {
    return NextResponse.json(
      { error: `Missing required field: ${missingField}` },
      { status: 400 }
    );
  }

  // Save to Supabase
  const { error: dbError } = await supabase.from('contact_submissions').insert({
    name: payload.name,
    email: payload.email,
    artist_name: payload.artistName,
    catalog_size: payload.catalogSize,
    current_distributor: payload.currentDistributor,
    message: payload.message
  });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return NextResponse.json(
      { error: 'Failed to save submission.' },
      { status: 500 }
    );
  }

  // Also notify Slack if webhook is configured
  if (slackWebhookUrl) {
    try {
      const body = buildSlackMessage(payload);
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (error) {
      // Log but don't fail the request if Slack notification fails
      console.error('Slack webhook error:', error);
    }
  }

  return NextResponse.json({ success: true });
}

function buildSlackMessage({
  name = '',
  email = '',
  artistName = '',
  catalogSize = '',
  currentDistributor = '',
  message = ''
}: FormPayload) {
  const lines = [
    '*New "Get Started" submission*',
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    `*Artist / Label:* ${artistName}`,
    catalogSize ? `*Catalog Size:* ${catalogSize}` : null,
    currentDistributor ? `*Current Distributor:* ${currentDistributor}` : '*Current Distributor:* (not provided)',
    message ? `*Message:*\n${message}` : '*Message:* (not provided)'
  ].filter(Boolean);

  return {
    text: lines.join('\n')
  };
}
