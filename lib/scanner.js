import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from './prisma.js';

const client = new Anthropic();

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AINetworkBot/1.0)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractText(html) {
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header, aside').remove();
  const text = $('article, main, .content, body').first().text()
    .replace(/\s+/g, ' ').trim().slice(0, 8000);
  return text;
}

async function extractTopics(text, sourceName) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Przeanalizuj poniższe artykuły ze źródła "${sourceName}" i wyciągnij 3-5 najciekawszych tematów z perspektywy polskiego przedsiębiorcy wdrażającego AI.

Odpowiedz TYLKO jako JSON array:
[{
  "title": "Tytuł po polsku (max 80 znaków)",
  "summary": "2-3 zdania podsumowania po polsku",
  "tags": ["tag1", "tag2"],
  "sourceUrl": "URL artykułu jeśli znasz, lub pusty string"
}]

Artykuły:
${text.slice(0, 12000)}`
    }],
  });

  try {
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch {
    return [];
  }
}

export async function runScan() {
  const sources = await prisma.scanSource.findMany({ where: { enabled: true } });
  if (sources.length === 0) return { scanned: 0, drafts: 0 };

  let totalDrafts = 0;

  for (const source of sources) {
    try {
      const html = await fetchPage(source.url);
      const text = extractText(html);
      const topics = await extractTopics(text, source.name);

      for (const topic of topics) {
        if (topic.sourceUrl) {
          const existing = await prisma.newsDraft.findFirst({
            where: {
              sourceUrl: topic.sourceUrl,
              scannedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          });
          if (existing) continue;
        }

        await prisma.newsDraft.create({
          data: {
            title: topic.title,
            summary: topic.summary,
            sourceUrl: topic.sourceUrl || source.url,
            sourceName: source.name,
            rawContent: text.slice(0, 4000),
            tags: topic.tags || [],
            status: 'pending',
            sourceId: source.id,
          },
        });
        totalDrafts++;
      }

      await prisma.scanSource.update({
        where: { id: source.id },
        data: { lastScannedAt: new Date() },
      });
    } catch (err) {
      console.error(`[Scanner] Error for ${source.url}:`, err.message);
    }
  }

  return { scanned: sources.length, drafts: totalDrafts };
}
