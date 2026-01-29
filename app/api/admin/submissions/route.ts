import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  try {
    if (type === 'pitch') {
      // Get pitch submissions
      const { data, error, count } = await supabase
        .from('pitch_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return NextResponse.json({
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      });

    } else if (type === 'contact') {
      // Get contact submissions
      const { data, error, count } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return NextResponse.json({
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      });

    } else {
      // Get all submissions with type indicator
      const [pitchResult, contactResult] = await Promise.all([
        supabase
          .from('pitch_submissions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(0, 24), // Get recent 25 of each type
        supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(0, 24)
      ]);

      if (pitchResult.error) throw pitchResult.error;
      if (contactResult.error) throw contactResult.error;

      // Combine and sort by created_at
      const allSubmissions = [
        ...(pitchResult.data || []).map((item: any) => ({ ...item, type: 'pitch' })),
        ...(contactResult.data || []).map((item: any) => ({ ...item, type: 'contact' }))
      ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return NextResponse.json({
        data: allSubmissions,
        pitchTotal: pitchResult.count,
        contactTotal: contactResult.count,
        total: (pitchResult.count || 0) + (contactResult.count || 0)
      });
    }

  } catch (error) {
    console.error('Admin submissions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}