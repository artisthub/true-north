import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'pitch';

  try {
    const tableName = type === 'pitch' ? 'pitch_submissions' : 'contact_submissions';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data: { ...data, type } });

  } catch (error) {
    console.error('Admin submission fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}