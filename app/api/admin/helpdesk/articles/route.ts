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

function parseTagIds(value: unknown) {
  return Array.isArray(value) ? Array.from(new Set(value.map(String).filter(Boolean))) : [];
}

function parseStatus(value: unknown): HelpdeskArticleStatus {
  return statuses.includes(value as HelpdeskArticleStatus) ? (value as HelpdeskArticleStatus) : 'draft';
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('kb_articles')
      .select('*, kb_article_tags(kb_tags(id,name,slug))')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Admin KB articles fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
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

    const { data, error } = await supabase.rpc('save_kb_article', {
      p_id: null, p_title: title, p_slug: slug, p_excerpt: String(body.excerpt || '').trim(),
      p_body_markdown: String(body.body_markdown || ''), p_topic_id: body.topic_id || null,
      p_status: parseStatus(body.status), p_featured: Boolean(body.featured), p_tag_ids: parseTagIds(body.tag_ids),
    });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Admin KB article create error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
