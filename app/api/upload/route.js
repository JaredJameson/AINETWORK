import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;
const EXT_MAP = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const type = formData.get('type') || 'articles';
  const slug = formData.get('slug');

  if (!file || !slug) {
    return NextResponse.json({ error: 'file and slug required' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const ext = EXT_MAP[file.type];
  const dir = path.join(process.cwd(), 'public', 'assets', 'images', type);
  await mkdir(dir, { recursive: true });
  const filename = `${slug}.${ext}`;
  await writeFile(path.join(dir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/assets/images/${type}/${filename}` });
}
