import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const supabase = await createServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's pitches (using profile_id which matches auth user id)
    const { data: pitches, error } = await supabase
      .from('pitch_submissions')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      pitches: pitches || []
    });

  } catch (error) {
    console.error('Get pitches error:', error);
    return NextResponse.json(
      { error: 'Failed to get pitches' },
      { status: 500 }
    );
  }
}