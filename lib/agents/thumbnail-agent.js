import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const categoryVisuals = {
  'content-marketing': {
    theme: 'digital content creation, flowing text streams, editorial design elements, creative writing visualization',
    palette: 'blue (#5B8DEF) accents alongside gold (#F5C518)',
  },
  'strategia-ai': {
    theme: 'business strategy, chess pieces on circuit boards, strategic pathways, decision trees, corporate roadmaps',
    palette: 'gold (#F5C518) dominant, warm amber tones',
  },
  'narzedzia-modele': {
    theme: 'AI model interfaces, floating tool dashboards, neural network nodes, connected systems, API endpoints',
    palette: 'green (#2ECC71) accents alongside gold (#F5C518)',
  },
};

const typeThemes = {
  articles: 'knowledge article, educational tech illustration',
  events: 'conference stage, professional meetup, networking event atmosphere',
  news: 'breaking news, real-time data feeds, information pulse, news ticker',
};

function buildPrompt({ title, excerpt, category, type, isPillar }) {
  const visual = categoryVisuals[category];
  const typeTheme = typeThemes[type] || typeThemes.articles;

  const lines = [
    'Create a dark, futuristic, professional illustration.',
    `Topic: "${title}".`,
  ];

  if (excerpt) {
    const short = excerpt.length > 200 ? excerpt.slice(0, 200) + '...' : excerpt;
    lines.push(`Context: ${short}`);
  }

  lines.push(`Visual theme: ${typeTheme}.`);

  if (visual) {
    lines.push(`Visual elements: ${visual.theme}.`);
    lines.push(`Color palette: ${visual.palette} on dark background #0D0D0D.`);
  } else {
    lines.push('Color palette: yellow/gold #F5C518 accents on dark background #0D0D0D.');
  }

  if (isPillar) {
    lines.push('This is a pillar/cornerstone article — make the image more grand, architectural, expansive.');
  }

  lines.push(
    'Style: minimalist, clean, geometric shapes, subtle glow effects, tech aesthetic.',
    'Format: landscape 16:9, no text or letters in the image.',
  );

  return lines.join(' ');
}

export async function generateThumbnail({ title, slug, type, excerpt, category, isPillar }) {
  const prompt = buildPrompt({ title, excerpt, category, type, isPillar });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'placeholder') {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

  if (!imagePart) throw new Error('No image in Gemini response');

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const dir = path.join(process.cwd(), 'public', 'assets', 'images', type);
  await mkdir(dir, { recursive: true });
  const filename = `${slug}.png`;
  await writeFile(path.join(dir, filename), buffer);

  return `/assets/images/${type}/${filename}`;
}
