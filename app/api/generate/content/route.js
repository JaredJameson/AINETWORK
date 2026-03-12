import { NextResponse } from 'next/server';
import { generateMeta } from '@/lib/agents/content-agent';

export async function POST(req) {
  const { title, content } = await req.json();
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const meta = await generateMeta({ title, content: content || '' });
  return NextResponse.json(meta);
}
