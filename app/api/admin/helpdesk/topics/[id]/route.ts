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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
      .update({
        title,
        slug,
        description: String(body.description || '').trim(),
        sort_order: Number(body.sort_order || 0),
        published: Boolean(body.published),
      })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Admin KB topic update error:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('kb_topics')
      .update({ published: false })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Admin KB topic archive error:', error);
    return NextResponse.json({ error: 'Failed to archive topic' }, { status: 500 });
  }
}
