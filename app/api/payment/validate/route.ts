import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Payment token is required' },
        { status: 400 }
      );
    }

    // Get application by token
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('payment_link_token', token)
      .eq('status', 'approved')
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: 'Invalid or expired payment link' },
        { status: 400 }
      );
    }

    // Check if user already exists for this application
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', application.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Account already exists for this email' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      application: {
        id: application.id,
        email: application.email,
        first_name: application.first_name,
        last_name: application.last_name,
        account_type: application.account_type,
        artist_name: application.artist_name,
        label_name: application.label_name
      }
    });

  } catch (error) {
    console.error('Payment validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate payment link' },
      { status: 500 }
    );
  }
}