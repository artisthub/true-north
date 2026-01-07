import { NextResponse } from 'next/server';

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
  if (!slackWebhookUrl) {
    return NextResponse.json(
      { error: 'Server misconfigured: missing Slack webhook URL.' },
      { status: 500 }
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

  const body = buildSlackMessage(payload);

  try {
    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!slackResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to notify Slack.' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Slack webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to notify Slack.' },
      { status: 502 }
    );
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
    '*New “Get Started” submission*',
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
