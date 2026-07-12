import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function normalizeName(value: unknown) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function GET() {
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { data, error } = await supabase.from('kb_tags').select('id,name,slug').order('name');
  return error ? NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 }) : NextResponse.json({ data: data || [] });
}

export async function POST(request: Request) {
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const name = normalizeName((await request.json()).name);
  const slug = slugify(name);
  if (!name || !slug) return NextResponse.json({ error: 'Enter a valid tag name' }, { status: 400 });

  const existing = await supabase.from('kb_tags').select('id,name,slug').ilike('name', name).maybeSingle();
  if (existing.data) return NextResponse.json({ data: existing.data });
  const { data, error } = await supabase.from('kb_tags').insert({ name, slug }).select('id,name,slug').single();
  if (error) return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
