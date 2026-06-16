import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('kb_topics')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Admin KB topics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const slug = normalizeSlug(String(body.slug || title));

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('kb_topics')
      .insert({
        title,
        slug,
        description: String(body.description || '').trim(),
        sort_order: Number(body.sort_order || 0),
        published: Boolean(body.published),
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Admin KB topic create error:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
