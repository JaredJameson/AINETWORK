# AI News Weekly Automation

## Setup

### 1. Install dependencies for scripts

```bash
npm install @anthropic-ai/sdk @google/generative-ai
```

### 2. Environment variables

Add to `.env` (or `/etc/environment` on VPS):

```env
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
```

### 3. Run manually

```bash
node scripts/generate-news.js
```

### 4. Cron job (VPS, runs every Monday at 8:00)

```bash
crontab -e
```

Add:
```
0 8 * * 1 cd /var/www/ainetwork-web && node scripts/generate-news.js >> logs/news.log 2>&1 && npm run build
```

## What it does

1. **Scrapes** headlines from TechCrunch AI, Wired AI, MIT Tech Review, VentureBeat
2. **Generates** 5 Polish-language articles via Claude Sonnet — brand voice applied
3. **Creates thumbnails** via Gemini image generation (dark, futuristic, #F5C518 accent)
4. **Saves** markdown to `/public/ai-news/` directory
5. **Updates** `/public/ai-news-index.json` index
6. **Rebuilds** the Next.js app (static generation picks up new articles)

## Integrating with the Next.js site

After running, the app reads from `ai-news-index.json` instead of static data.
Update `app/ai-news/page.js` to:

```js
import newsIndexData from '@/public/ai-news-index.json';
```

Or use `fs.readFileSync` in a server component for live data.

## Logs

Check `logs/news.log` for weekly execution output.
