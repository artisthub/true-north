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

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('kb_articles')
      .select('*')
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

    const { data, error } = await supabase
      .from('kb_articles')
      .insert({
        title,
        slug,
        excerpt: String(body.excerpt || '').trim(),
        body_markdown: String(body.body_markdown || ''),
        topic_id: body.topic_id || null,
        tags: parseTags(body.tags),
        status: parseStatus(body.status),
        featured: Boolean(body.featured),
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Admin KB article create error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
