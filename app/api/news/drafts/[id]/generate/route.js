import { prisma } from '@/lib/prisma';
import { generateFullArticle, generateMeta } from '@/lib/agents/content-agent';
import { revalidatePath } from 'next/cache';

export async function POST(req, { params }) {
  const { id } = await params;
  const draft = await prisma.newsDraft.findUnique({ where: { id } });
  if (!draft) return new Response('Not found', { status: 404 });

  await prisma.newsDraft.update({ where: { id }, data: { status: 'generating' } });

  const encoder = new TextEncoder();
  let fullText = '';
  let newsId = null;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await generateFullArticle({
          title: draft.title,
          rawContent: draft.rawContent,
          onChunk: (text) => {
            fullText += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          },
        });

        const meta = await generateMeta({ title: draft.title, content: fullText });
        const slug = draft.title.toLowerCase()
          .replace(/[ąćęłńóśźż]/g, c => ({ą:'a',ć:'c',ę:'e',ł:'l',ń:'n',ó:'o',ś:'s',ź:'z',ż:'z'}[c]||c))
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const defaultCat = await prisma.category.findFirst({ where: { type: 'news' } });

        const news = await prisma.news.create({
          data: {
            slug: `${slug}-${Date.now()}`,
            title: draft.title,
            content: fullText,
            excerpt: meta.excerpt,
            source: draft.sourceName,
            tags: draft.tags,
            readingTime: meta.readingTime,
            published: false,
            categoryId: defaultCat.id,
          },
        });
        newsId = news.id;

        await prisma.newsDraft.update({
          where: { id },
          data: { status: 'published', newsId: news.id },
        });

        revalidatePath('/ai-news');
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, newsId: news.id })}\n\n`));
        controller.close();
      } catch (err) {
        await prisma.newsDraft.update({ where: { id }, data: { status: 'pending' } });
        if (newsId) await prisma.news.delete({ where: { id: newsId } }).catch(() => {});
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
