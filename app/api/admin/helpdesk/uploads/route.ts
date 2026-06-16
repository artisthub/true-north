import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bucketName = 'helpdesk-assets';
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
]);

function sanitizeFileName(value: string) {
  const parts = value.split('.');
  const extension = parts.length > 1 ? parts.pop() || '' : '';
  const baseName = parts.join('.') || 'helpdesk-file';
  const safeBase = baseName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'helpdesk-file';

  return extension ? `${safeBase}.${extension.toLowerCase()}` : safeBase;
}

function markdownForFile(name: string, url: string, type: string) {
  const label = name.replace(/\.[^.]+$/, '') || 'Uploaded file';

  return type.startsWith('image/')
    ? `![${label}](${url})`
    : `[${label}](${url})`;
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: 'File type is not supported' }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'File must be 10 MB or smaller' }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name);
    const month = new Date().toISOString().slice(0, 7);
    const path = `${month}/${crypto.randomUUID()}-${safeName}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    const publicUrl = data.publicUrl;

    return NextResponse.json({
      data: {
        name: file.name,
        path,
        url: publicUrl,
        type: file.type,
        size: file.size,
        markdown: markdownForFile(file.name, publicUrl, file.type),
      },
    });
  } catch (error) {
    console.error('Admin KB upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
