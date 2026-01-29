import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    // Get counts for both submission types
    const [pitchCount, contactCount] = await Promise.all([
      supabase
        .from('pitch_submissions')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
    ]);

    if (pitchCount.error) throw pitchCount.error;
    if (contactCount.error) throw contactCount.error;

    // Get recent submissions (last 7 days) for trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [recentPitch, recentContact] = await Promise.all([
      supabase
        .from('pitch_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
    ]);

    if (recentPitch.error) throw recentPitch.error;
    if (recentContact.error) throw recentContact.error;

    // Get submissions by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [pitchDaily, contactDaily] = await Promise.all([
      supabase
        .from('pitch_submissions')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('contact_submissions')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
    ]);

    if (pitchDaily.error) throw pitchDaily.error;
    if (contactDaily.error) throw contactDaily.error;

    // Group by date
    const dailyStats: Record<string, { pitch: number; contact: number }> = {};

    // Initialize last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStats[dateStr] = { pitch: 0, contact: 0 };
    }

    // Count pitch submissions by date
    pitchDaily.data?.forEach((submission: { created_at: string }) => {
      const dateStr = submission.created_at.split('T')[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].pitch++;
      }
    });

    // Count contact submissions by date
    contactDaily.data?.forEach((submission: { created_at: string }) => {
      const dateStr = submission.created_at.split('T')[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].contact++;
      }
    });

    // Convert to array and sort by date
    const dailyData = Object.entries(dailyStats)
      .map(([date, counts]) => ({
        date,
        ...counts,
        total: counts.pitch + counts.contact
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalSubmissions: {
        pitch: pitchCount.count || 0,
        contact: contactCount.count || 0,
        total: (pitchCount.count || 0) + (contactCount.count || 0)
      },
      recentSubmissions: {
        pitch: recentPitch.count || 0,
        contact: recentContact.count || 0,
        total: (recentPitch.count || 0) + (recentContact.count || 0)
      },
      dailyStats: dailyData
    });

  } catch (error) {
    console.error('Admin stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}