import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { HelpdeskArticleStatus } from '@/lib/helpdesk';

const statuses: HelpdeskArticleStatus[] = ['draft', 'published', 'archived'];

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseStatus(value: unknown): HelpdeskArticleStatus {
  return statuses.includes(value as HelpdeskArticleStatus) ? (value as HelpdeskArticleStatus) : 'draft';
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
      .from('kb_articles')
      .update({
        title,
        slug,
        excerpt: String(body.excerpt || '').trim(),
        body_markdown: String(body.body_markdown || ''),
        topic_id: body.topic_id || null,
        tags: parseTags(body.tags),
        status: parseStatus(body.status),
        featured: Boolean(body.featured),
      })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Admin KB article update error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('kb_articles')
      .update({ status: 'archived' })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Admin KB article archive error:', error);
    return NextResponse.json({ error: 'Failed to archive article' }, { status: 500 });
  }
}
