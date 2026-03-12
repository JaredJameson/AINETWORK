#!/usr/bin/env node
/**
 * AI NEWS WEEKLY AUTOMATION
 *
 * Weekly workflow:
 * 1. Scrape AI news from key sources
 * 2. Use Claude API to summarize + apply brand voice
 * 3. Generate thumbnail with Gemini
 * 4. Write new article to /public/ai-news/ directory
 * 5. Update /public/ai-news-index.json
 *
 * Run: node scripts/generate-news.js
 * Cron: 0 8 * * 1  (every Monday at 8:00)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const AI_NEWS_DIR = path.join(ROOT, 'public', 'ai-news');
const INDEX_FILE = path.join(ROOT, 'public', 'ai-news-index.json');
const THUMBS_DIR = path.join(ROOT, 'public', 'assets', 'images', 'news');

/* ─── Sources to scrape ──────────────────────────────────── */
const SOURCES = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/', selector: 'article' },
  { name: 'Wired AI', url: 'https://www.wired.com/tag/artificial-intelligence/', selector: 'article' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/', selector: 'article' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/ai/', selector: 'article' },
];

/* ─── AI NETWORK Brand Voice Prompt ─────────────────────── */
const BRAND_VOICE_PROMPT = `
Jesteś redaktorem AI NETWORK — polskiej platformy wiedzy i wydarzeń AI dla firm.

Twój styl pisania:
- Praktyczny i rzeczowy, bez buzzwordów
- Skupiony na zastosowaniach biznesowych (co to oznacza dla polskich firm?)
- Angażujący, ale profesjonalny — jak dobry menedżer, nie akademik
- Krótkie zdania, konkretne dane, jasne wnioski
- Zawsze odpowiadasz na pytanie: "Co z tego wynika dla mnie jako osoby wdrażającej AI w firmie?"

Tagi kategorii:
- "modele-lmy" — nowe modele AI, benchmarki, porównania
- "narzedzia-workflow" — narzędzia, integracje, platformy, automatyzacja
- "biznes-regulacje" — biznes, inwestycje, EU AI Act, case studies, regulacje

Format odpowiedzi (JSON):
{
  "title": "...",
  "slug": "...",
  "category": "...",
  "category_label": "...",
  "excerpt": "...(2-3 zdania w języku polskim)...",
  "body": "...(500-800 słów po polsku, markdown)...",
  "tags": ["...", "..."],
  "source": "...",
  "source_url": "...",
  "reading_time": "X min"
}
`;

/* ─── Main ───────────────────────────────────────────────── */
async function main() {
  console.log('🤖 AI NEWS GENERATOR — start\n');

  // Ensure dirs exist
  fs.mkdirSync(AI_NEWS_DIR, { recursive: true });
  fs.mkdirSync(THUMBS_DIR, { recursive: true });

  // Load existing index
  let index = [];
  if (fs.existsSync(INDEX_FILE)) {
    index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
  }

  // Fetch raw headlines from sources
  const headlines = await scrapeHeadlines();
  console.log(`📰 Zebrano ${headlines.length} nagłówków\n`);

  if (headlines.length === 0) {
    console.log('Brak nowych artykułów. Koniec.');
    return;
  }

  // Init API clients
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Process top 5 headlines
  const toProcess = headlines.slice(0, 5);
  const newArticles = [];

  for (const headline of toProcess) {
    console.log(`⚙️  Przetwarzam: ${headline.title}`);

    try {
      // 1. Generate Polish article with Claude
      const article = await generateArticle(anthropic, headline);
      console.log(`   ✅ Artykuł: ${article.title}`);

      // 2. Generate thumbnail with Gemini
      const thumbPath = await generateThumbnail(genAI, article);
      console.log(`   🎨 Miniatura: ${thumbPath}`);

      // 3. Save markdown file
      const today = new Date().toISOString().split('T')[0];
      const mdFilename = `${today}-${article.slug}.md`;
      const mdPath = path.join(AI_NEWS_DIR, mdFilename);
      fs.writeFileSync(mdPath, article.body, 'utf-8');

      // 4. Add to index
      const indexEntry = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        slug: article.slug,
        title: article.title,
        category: article.category,
        category_label: article.category_label,
        excerpt: article.excerpt,
        date: today,
        reading_time: article.reading_time,
        source: article.source,
        source_url: article.source_url,
        tags: article.tags,
        article_file: `ai-news/${mdFilename}`,
        image: thumbPath ? `assets/images/news/${article.slug}.png` : null,
      };

      newArticles.push(indexEntry);
      console.log(`   📁 Zapisano\n`);

    } catch (err) {
      console.error(`   ❌ Błąd: ${err.message}\n`);
    }
  }

  // Prepend new articles (newest first)
  index = [...newArticles, ...index];
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

  console.log(`\n✅ Gotowe! Dodano ${newArticles.length} nowych artykułów.`);
  console.log(`📊 Łącznie w indeksie: ${index.length} artykułów.`);
}

/* ─── Scrape headlines ───────────────────────────────────── */
async function scrapeHeadlines() {
  const headlines = [];

  for (const source of SOURCES) {
    try {
      const response = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AINetworkBot/1.0)' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;

      const html = await response.text();

      // Simple headline extraction — look for <title> tags in og:title pattern
      // For production use a proper HTML parser like cheerio
      const titleRegex = /<title[^>]*>([^<]+)<\/title>/gi;
      const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/gi;
      const h3Regex = /<h3[^>]*>([^<]+)<\/h3>/gi;

      const titles = [];
      let match;
      while ((match = h2Regex.exec(html)) !== null && titles.length < 5) {
        const clean = match[1].replace(/&[^;]+;/g, '').trim();
        if (clean.length > 20) titles.push(clean);
      }
      while ((match = h3Regex.exec(html)) !== null && titles.length < 8) {
        const clean = match[1].replace(/&[^;]+;/g, '').trim();
        if (clean.length > 20) titles.push(clean);
      }

      for (const title of titles) {
        headlines.push({ title, source: source.name, source_url: source.url });
      }

    } catch (err) {
      console.warn(`  ⚠️  ${source.name}: ${err.message}`);
    }
  }

  // Deduplicate
  const seen = new Set();
  return headlines.filter(h => {
    if (seen.has(h.title)) return false;
    seen.add(h.title);
    return true;
  });
}

/* ─── Generate article with Claude ──────────────────────── */
async function generateArticle(anthropic, headline) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE_PROMPT}

Nagłówek do opracowania:
"${headline.title}"

Źródło: ${headline.source} (${headline.source_url})

Napisz artykuł po polsku o tym temacie. Zwróć tylko JSON bez markdown code fences.`,
      },
    ],
  });

  const text = message.content[0].text.trim();
  // Strip code fences if present
  const jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(jsonStr);
}

/* ─── Generate thumbnail with Gemini ────────────────────── */
async function generateThumbnail(genAI, article) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });

    const prompt = `Dark tech thumbnail for article: "${article.title}".
Style: dark background (#0A0A0A), yellow/gold accent (#F5C518), futuristic, professional, abstract AI visualization.
Category: ${article.category_label}.
No text. 16:9 aspect ratio. High quality.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['image', 'text'] },
    });

    const imagePart = result.response.candidates[0].content.parts.find(p => p.inlineData);
    if (!imagePart) return null;

    const imageData = Buffer.from(imagePart.inlineData.data, 'base64');
    const filename = `${article.slug}.png`;
    const thumbPath = path.join(THUMBS_DIR, filename);
    fs.writeFileSync(thumbPath, imageData);

    return filename;
  } catch (err) {
    console.warn(`   ⚠️  Miniatura niedostępna: ${err.message}`);
    return null;
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
