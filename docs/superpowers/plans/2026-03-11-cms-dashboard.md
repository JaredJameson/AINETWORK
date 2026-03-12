# CMS Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full CMS dashboard with PostgreSQL, AI agents, and news scanner — content created in dashboard auto-appears on the site.

**Architecture:** Next.js 16 App Router + PostgreSQL (Prisma) on VPS Docker Compose. API routes handle CRUD, protected by JWT middleware. Admin UI at `/admin` ports existing `admin.html` design. Claude agent generates content, Gemini generates thumbnails, node-cron scans news 2x/week.

**Tech Stack:** Next.js 16, Prisma, PostgreSQL 16, bcryptjs, jsonwebtoken, node-cron, @anthropic-ai/sdk, @google/generative-ai, cheerio, multer, Vitest

---

## File Map

**New files — lib/**
- `lib/prisma.js` — singleton Prisma client
- `lib/auth.js` — JWT sign/verify, bcrypt compare
- `lib/agents/content-agent.js` — Claude excerpt/tags/full article
- `lib/agents/thumbnail-agent.js` — Gemini image generation
- `lib/scanner.js` — news scraper + Claude topic extraction

**New files — API routes**
- `app/api/auth/login/route.js`
- `app/api/auth/me/route.js`
- `app/api/auth/logout/route.js`
- `app/api/articles/route.js`
- `app/api/articles/[id]/route.js`
- `app/api/events/route.js`
- `app/api/events/[id]/route.js`
- `app/api/news/route.js`
- `app/api/news/[id]/route.js`
- `app/api/news/drafts/route.js`
- `app/api/news/drafts/[id]/generate/route.js`
- `app/api/news/drafts/[id]/reject/route.js`
- `app/api/categories/route.js`
- `app/api/generate/thumbnail/route.js`
- `app/api/generate/content/route.js`
- `app/api/scan/route.js`
- `app/api/upload/route.js`

**New files — Admin UI**
- `app/admin/page.js` — redirect
- `app/admin/layout.js` — sidebar + auth guard
- `app/admin/login/page.js`
- `app/admin/dashboard/page.js`
- `app/admin/events/page.js`, `new/page.js`, `[id]/page.js`
- `app/admin/articles/page.js`, `new/page.js`, `[id]/page.js`
- `app/admin/news/page.js`, `new/page.js`, `[id]/page.js`
- `app/admin/drafts/page.js`
- `app/admin/categories/page.js`
- `app/admin/settings/page.js`
- `components/admin/AdminSidebar.js`
- `components/admin/MarkdownEditor.js`
- `components/admin/ImagePicker.js`

**New files — infra**
- `prisma/schema.prisma`
- `prisma/seed.js`
- `middleware.ts`
- `instrumentation.ts`
- `Dockerfile`
- `docker-compose.yml`
- `.env.example`
- `scripts/migrate-to-db.js`
- `scripts/hash-password.js`

**Modified files**
- `package.json` — add all new deps
- `next.config.mjs` — serverExternalPackages for Prisma
- `lib/articles.js` — replace fs reads with Prisma
- `app/baza-wiedzy/page.js` — async + force-dynamic
- `app/artykul/[slug]/page.js` — Prisma + revalidatePath
- `app/ai-news/page.js` — Prisma query
- `app/ai-news/[slug]/page.js` — Prisma query
- `app/wydarzenia/page.js` — Prisma query

---

## Chunk 1: Foundation — Prisma + Dependencies

### Task 1: Install dependencies

**Files:** `package.json`

- [ ] Run in `/home/jarek/projects/ainetwork-web`:
```bash
npm install prisma @prisma/client bcryptjs jsonwebtoken node-cron \
  @anthropic-ai/sdk cheerio
npm install --save-dev vitest @vitest/coverage-v8 vite-tsconfig-paths
```

- [ ] Add test script to `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] Commit:
```bash
git add package.json package-lock.json
git commit -m "feat: add cms dependencies"
```

---

### Task 2: Prisma schema

**Files:** `prisma/schema.prisma`

- [ ] Initialize Prisma:
```bash
npx prisma init --datasource-provider postgresql
```

- [ ] Replace generated `prisma/schema.prisma` with:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Article {
  id          String    @id @default(cuid())
  slug        String    @unique
  type        String    // "pillar" | "cluster"
  title       String
  content     String
  excerpt     String
  readingTime String
  date        DateTime
  imageUrl    String?
  published   Boolean   @default(false)
  categoryId  String
  pillarId    String?
  category    Category  @relation(fields: [categoryId], references: [id])
  pillar      Article?  @relation("PillarClusters", fields: [pillarId], references: [id])
  clusters    Article[] @relation("PillarClusters")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Event {
  id        String   @id @default(cuid())
  slug      String   @unique
  brand     String
  title     String
  excerpt   String
  date      DateTime
  time      String
  location  String
  venue     String
  format    String
  seats     String
  free      Boolean  @default(true)
  accent    String
  imageUrl  String?
  status    String   // "upcoming" | "past"
  href      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model News {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  content     String
  excerpt     String
  source      String?
  tags        String[]
  imageUrl    String?
  published   Boolean   @default(false)
  date        DateTime  @default(now())
  readingTime String
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  draft       NewsDraft?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model NewsDraft {
  id          String      @id @default(cuid())
  title       String
  summary     String
  sourceUrl   String
  sourceName  String
  rawContent  String
  tags        String[]
  status      String      // "pending" | "generating" | "published" | "rejected"
  scannedAt   DateTime    @default(now())
  newsId      String?     @unique
  sourceId    String?
  news        News?       @relation(fields: [newsId], references: [id])
  source      ScanSource? @relation(fields: [sourceId], references: [id])
  updatedAt   DateTime    @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  key      String    @unique
  label    String
  color    String
  type     String    // "article" | "news"
  articles Article[]
  news     News[]
}

model ScanSource {
  id            String      @id @default(cuid())
  url           String      @unique
  name          String
  enabled       Boolean     @default(true)
  lastScannedAt DateTime?
  createdAt     DateTime    @default(now())
  drafts        NewsDraft[]
}
```

- [ ] Commit:
```bash
git add prisma/schema.prisma
git commit -m "feat: add prisma schema"
```

---

### Task 3: Prisma client singleton

**Files:** `lib/prisma.js`

- [ ] Write `lib/prisma.js`:
```js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

- [ ] Update `next.config.mjs` to add serverExternalPackages:
```js
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  // ... existing config
};
```

- [ ] Commit:
```bash
git add lib/prisma.js next.config.mjs
git commit -m "feat: prisma singleton client"
```

---

### Task 4: Seed with default categories

**Files:** `prisma/seed.js`

- [ ] Write `prisma/seed.js`:
```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const articleCategories = [
    { key: 'content-marketing', label: 'Content Marketing', color: '#5B8DEF', type: 'article' },
    { key: 'strategia-ai', label: 'Strategia AI', color: '#F5C518', type: 'article' },
    { key: 'narzedzia-modele', label: 'Narzędzia i Modele', color: '#2ECC71', type: 'article' },
  ];
  const newsCategories = [
    { key: 'modele-lmy', label: 'Modele i LLM-y', color: '#5B8DEF', type: 'news' },
    { key: 'narzedzia-workflow', label: 'Narzędzia i workflow', color: '#F5C518', type: 'news' },
    { key: 'biznes-regulacje', label: 'Biznes i regulacje', color: '#2ECC71', type: 'news' },
  ];
  for (const cat of [...articleCategories, ...newsCategories]) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: {},
      create: cat,
    });
  }
  console.log('Seeded categories');
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

- [ ] Add seed script to `package.json`:
```json
"prisma": { "seed": "node prisma/seed.js" }
```

- [ ] Commit:
```bash
git add prisma/seed.js package.json
git commit -m "feat: prisma seed with default categories"
```

---

### Task 5: .env files

**Files:** `.env`, `.env.example`

- [ ] Create `.env.example`:
```env
DATABASE_URL="postgresql://ainetwork:password@localhost:5432/ainetwork"
ADMIN_EMAIL="admin@ainetwork.pl"
ADMIN_PASSWORD_HASH="$2b$10$..."
JWT_SECRET="change-this-to-a-long-random-string"
ANTHROPIC_API_KEY="sk-ant-..."
GEMINI_API_KEY="AIza..."
NEXT_PUBLIC_BASE_URL="http://localhost:3001"
```

- [ ] Copy to `.env` and fill real values (DATABASE_URL pointing to local/Docker Postgres)

- [ ] Generate password hash:
```bash
node -e "const b=require('bcryptjs');b.hash('YOUR_PASSWORD',10).then(h=>console.log(h))"
```
Paste output into `.env` as `ADMIN_PASSWORD_HASH`.

- [ ] Ensure `.env` is in `.gitignore` (verify):
```bash
grep ".env" .gitignore || echo ".env" >> .gitignore
```

- [ ] Commit:
```bash
git add .env.example .gitignore
git commit -m "feat: env example and gitignore"
```

---

### Task 6: Run first migration

- [ ] Start a local PostgreSQL (or Docker):
```bash
docker run --name ainetwork-db -e POSTGRES_DB=ainetwork \
  -e POSTGRES_USER=ainetwork -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:16
```

- [ ] Run migration:
```bash
npx prisma migrate dev --name init
```
Expected: `✓ Generated Prisma Client`

- [ ] Run seed:
```bash
npx prisma db seed
```
Expected: `Seeded categories`

- [ ] Verify in Prisma Studio:
```bash
npx prisma studio
```
Open `http://localhost:5555` — Category table should have 6 rows.

- [ ] Commit:
```bash
git add prisma/migrations
git commit -m "feat: initial db migration"
```

---

## Chunk 2: Auth — JWT + Middleware

### Task 7: Auth helpers

**Files:** `lib/auth.js`, `tests/lib/auth.test.js`

- [ ] Write failing test `tests/lib/auth.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../lib/auth.js';

describe('auth helpers', () => {
  it('signs and verifies a token', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = signToken({ email: 'admin@test.pl' });
    const payload = verifyToken(token);
    expect(payload.email).toBe('admin@test.pl');
  });

  it('returns null for invalid token', () => {
    process.env.JWT_SECRET = 'test-secret';
    expect(verifyToken('bad-token')).toBeNull();
  });
});
```

- [ ] Run test — expect FAIL:
```bash
npm test tests/lib/auth.test.js
```

- [ ] Write `lib/auth.js`:
```js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
```

- [ ] Run test — expect PASS:
```bash
npm test tests/lib/auth.test.js
```

- [ ] Commit:
```bash
git add lib/auth.js tests/lib/auth.test.js
git commit -m "feat: jwt auth helpers"
```

---

### Task 8: Auth API routes

**Files:** `app/api/auth/login/route.js`, `app/api/auth/me/route.js`, `app/api/auth/logout/route.js`

- [ ] Write `app/api/auth/login/route.js`:
```js
import { NextResponse } from 'next/server';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();

  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await comparePassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ email });
  const res = NextResponse.json({ ok: true, user: { email, role: 'admin' } });
  res.cookies.set('ain_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  });
  return res;
}
```

- [ ] Write `app/api/auth/me/route.js`:
```js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const token = req.cookies.get('ain_token')?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ user: { email: payload.email, role: 'admin' } });
}
```

- [ ] Write `app/api/auth/logout/route.js`:
```js
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ain_token', '', { maxAge: 0, path: '/' });
  return res;
}
```

- [ ] Commit:
```bash
git add app/api/auth
git commit -m "feat: auth api routes login/logout/me"
```

---

### Task 9: Middleware

**Files:** `middleware.ts`

- [ ] Write `middleware.ts`:
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('ain_token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/api/articles/:path*',
    '/api/events/:path*',
    '/api/news/:path*',
    '/api/categories/:path*',
    '/api/generate/:path*',
    '/api/scan',
    '/api/upload',
    '/api/auth/me',
    '/api/auth/logout',
  ],
};
```

- [ ] Test manually: `curl http://localhost:3001/api/articles` → should return 401
- [ ] Commit:
```bash
git add middleware.ts
git commit -m "feat: jwt middleware protecting admin and api routes"
```

---

## Chunk 3: CRUD API Routes

### Task 10: Articles API

**Files:** `app/api/articles/route.js`, `app/api/articles/[id]/route.js`

- [ ] Write `app/api/articles/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // optional filter
  const articles = await prisma.article.findMany({
    where: type ? { type } : {},
    include: { category: true, pillar: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(req) {
  const data = await req.json();
  const article = await prisma.article.create({
    data: {
      slug: data.slug,
      type: data.type,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      readingTime: data.readingTime,
      date: new Date(data.date),
      imageUrl: data.imageUrl,
      published: data.published ?? false,
      categoryId: data.categoryId,
      pillarId: data.pillarId || null,
    },
  });
  revalidatePath('/baza-wiedzy');
  revalidatePath('/artykul/' + article.slug);
  return NextResponse.json(article, { status: 201 });
}
```

- [ ] Write `app/api/articles/[id]/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { category: true, clusters: true },
  });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      readingTime: data.readingTime,
      date: data.date ? new Date(data.date) : undefined,
      imageUrl: data.imageUrl,
      published: data.published,
      categoryId: data.categoryId,
      pillarId: data.pillarId || null,
    },
  });
  revalidatePath('/baza-wiedzy');
  revalidatePath('/artykul/' + article.slug);
  return NextResponse.json(article);
}

export async function DELETE(req, { params }) {
  const article = await prisma.article.delete({ where: { id: params.id } });
  revalidatePath('/baza-wiedzy');
  return NextResponse.json({ ok: true });
}
```

- [ ] Commit:
```bash
git add app/api/articles
git commit -m "feat: articles crud api"
```

---

### Task 11: Events API

**Files:** `app/api/events/route.js`, `app/api/events/[id]/route.js`

- [ ] Write `app/api/events/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const events = await prisma.event.findMany({
    where: status ? { status } : {},
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(events);
}

export async function POST(req) {
  const data = await req.json();
  const event = await prisma.event.create({
    data: {
      slug: data.slug,
      brand: data.brand,
      title: data.title,
      excerpt: data.excerpt,
      date: new Date(data.date),
      time: data.time,
      location: data.location,
      venue: data.venue,
      format: data.format,
      seats: data.seats,
      free: data.free ?? true,
      accent: data.accent || '#F5C518',
      imageUrl: data.imageUrl,
      status: data.status || 'upcoming',
      href: data.href || null,
    },
  });
  revalidatePath('/wydarzenia');
  return NextResponse.json(event, { status: 201 });
}
```

- [ ] Write `app/api/events/[id]/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      brand: data.brand,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date ? new Date(data.date) : undefined,
      time: data.time,
      location: data.location,
      venue: data.venue,
      format: data.format,
      seats: data.seats,
      free: data.free,
      accent: data.accent,
      imageUrl: data.imageUrl,
      status: data.status,
      href: data.href,
    },
  });
  revalidatePath('/wydarzenia');
  return NextResponse.json(event);
}

export async function DELETE(req, { params }) {
  await prisma.event.delete({ where: { id: params.id } });
  revalidatePath('/wydarzenia');
  return NextResponse.json({ ok: true });
}
```

- [ ] Commit:
```bash
git add app/api/events
git commit -m "feat: events crud api"
```

---

### Task 12: News API + Drafts

**Files:** `app/api/news/route.js`, `app/api/news/[id]/route.js`, `app/api/news/drafts/route.js`, `app/api/news/drafts/[id]/reject/route.js`

- [ ] Write `app/api/news/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  const news = await prisma.news.findMany({
    include: { category: true },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(news);
}

export async function POST(req) {
  const data = await req.json();
  const news = await prisma.news.create({
    data: {
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      source: data.source,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      published: data.published ?? false,
      date: data.date ? new Date(data.date) : new Date(),
      readingTime: data.readingTime,
      categoryId: data.categoryId,
    },
  });
  revalidatePath('/ai-news');
  return NextResponse.json(news, { status: 201 });
}
```

- [ ] Write `app/api/news/[id]/route.js` (same pattern as articles `[id]` — PUT + DELETE + GET with `revalidatePath('/ai-news')`)

- [ ] Write `app/api/news/drafts/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const drafts = await prisma.newsDraft.findMany({
    where: { status: 'pending' },
    include: { source: true },
    orderBy: { scannedAt: 'desc' },
  });
  return NextResponse.json(drafts);
}
```

- [ ] Write `app/api/news/drafts/[id]/reject/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req, { params }) {
  await prisma.newsDraft.update({
    where: { id: params.id },
    data: { status: 'rejected' },
  });
  return NextResponse.json({ ok: true });
}
```

- [ ] Commit:
```bash
git add app/api/news
git commit -m "feat: news and drafts crud api"
```

---

### Task 13: Categories API

**Files:** `app/api/categories/route.js`

- [ ] Write `app/api/categories/route.js`:
```js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const categories = await prisma.category.findMany({
    where: type ? { type } : {},
    orderBy: { label: 'asc' },
  });
  return NextResponse.json(categories);
}

export async function POST(req) {
  const data = await req.json();
  const category = await prisma.category.create({
    data: { key: data.key, label: data.label, color: data.color, type: data.type },
  });
  return NextResponse.json(category, { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
```

- [ ] Commit:
```bash
git add app/api/categories
git commit -m "feat: categories api"
```

---

### Task 14: Upload API

**Files:** `app/api/upload/route.js`

- [ ] Write `app/api/upload/route.js`:
```js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const EXT_MAP = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const type = formData.get('type') || 'articles'; // articles|events|news
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
```

- [ ] Commit:
```bash
git add app/api/upload
git commit -m "feat: image upload api"
```

---

## Chunk 4: Data Migration

### Task 15: Migration script

**Files:** `scripts/migrate-to-db.js`

- [ ] Write `scripts/migrate-to-db.js`:
```js
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function main() {
  // 1. Load articles.json
  const articlesJson = JSON.parse(
    readFileSync(path.join(__dirname, '../public/articles.json'), 'utf-8')
  );

  // 2. Get category IDs
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.key, c.id]));

  // 3. Migrate pillars first
  for (const p of articlesJson.pillars) {
    const content = readFileSync(
      path.join(__dirname, '../public', p.article_file), 'utf-8'
    ).replace(/^---[\s\S]*?---\n?/, '');

    await prisma.article.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        type: 'pillar',
        title: p.title,
        content,
        excerpt: p.description || '',
        readingTime: p.reading_time || '15 min',
        date: p.date ? new Date(p.date) : new Date(),
        imageUrl: p.image ? '/' + p.image : null,
        published: true,
        categoryId: catMap[p.category] || cats[0].id,
      },
    });
    console.log('Migrated pillar:', p.slug);
  }

  // 4. Build pillar slug→id map
  const pillarRecords = await prisma.article.findMany({ where: { type: 'pillar' } });
  const pillarIdMap = Object.fromEntries(pillarRecords.map(p => [p.slug, p.id]));

  // 5. Migrate cluster articles
  for (const a of articlesJson.articles) {
    const pillarSlug = articlesJson.pillars.find(p => p.id === a.pillar_id)?.slug;
    const content = (() => {
      try {
        return readFileSync(
          path.join(__dirname, '../public', a.article_file), 'utf-8'
        ).replace(/^---[\s\S]*?---\n?/, '');
      } catch { return ''; }
    })();

    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        type: 'cluster',
        title: a.title,
        content,
        excerpt: a.excerpt || '',
        readingTime: a.reading_time || '10 min',
        date: a.date ? new Date(a.date) : new Date(),
        imageUrl: a.image ? '/' + a.image : null,
        published: true,
        categoryId: catMap[a.category] || cats[0].id,
        pillarId: pillarSlug ? pillarIdMap[pillarSlug] : null,
      },
    });
    console.log('Migrated article:', a.slug);
  }

  // 6. Migrate hardcoded events
  const events = [
    {
      slug: 'ai-network-vol4',
      brand: 'AI NETWORK vol.4',
      title: 'Praktyczne wdrożenia AI w biznesie',
      excerpt: 'Czwarta edycja spotkań AI NETWORK dla przedsiębiorców i menedżerów.',
      date: new Date('2026-04-10'),
      time: '17:00–20:00',
      location: 'Bydgoszcz',
      venue: 'WSB Merito',
      format: 'Konferencja',
      seats: '100 miejsc',
      free: true,
      accent: '#F5C518',
      status: 'upcoming',
    },
    {
      slug: 'ai-network-edu',
      brand: 'AI NETWORK EDU',
      title: 'AI w Edukacji — Praktyczny Warsztat dla Nauczycieli',
      excerpt: 'Warsztaty dla nauczycieli i edukatorów.',
      date: new Date('2026-04-30'),
      time: '17:00–20:00',
      location: 'Bydgoszcz',
      venue: 'WSB Merito',
      format: 'Warsztat',
      seats: 'Darmowe',
      free: true,
      accent: '#2ECC71',
      status: 'upcoming',
      href: 'https://edu.ainetwork.pl',
    },
    {
      slug: 'ai-network-plastics',
      brand: 'AI NETWORK PLASTICS',
      title: 'AI w przetwórstwie tworzyw sztucznych',
      excerpt: 'Praktyczne case studies z branży plastics.',
      date: new Date('2026-05-21'),
      time: '10:00–12:00',
      location: 'Kielce',
      venue: 'Targi PLASTPOL',
      format: 'Konferencja',
      seats: '80 miejsc',
      free: true,
      accent: '#5B8DEF',
      status: 'upcoming',
      href: 'https://plastics.ainetwork.pl',
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({ where: { slug: ev.slug }, update: {}, create: ev });
    console.log('Migrated event:', ev.slug);
  }

  console.log('Migration complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

- [ ] Run migration:
```bash
node scripts/migrate-to-db.js
```
Expected: all articles, events logged, no errors.

- [ ] Verify in Prisma Studio:
```bash
npx prisma studio
```
Check Article table — should have all pillars + clusters.

- [ ] Commit:
```bash
git add scripts/migrate-to-db.js
git commit -m "feat: data migration script from json to postgres"
```

---

## Chunk 5: Frontend Refactor

### Task 16: Replace lib/articles.js with Prisma

**Files:** `lib/articles.js`

- [ ] Replace contents of `lib/articles.js`:
```js
import { prisma } from './prisma.js';

export async function getAllArticles() {
  const articles = await prisma.article.findMany({
    where: { published: true, type: 'cluster' },
    include: {
      category: true,
      pillar: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { date: 'desc' },
  });
  return articles.map(normalizeArticle);
}

export async function getPillars() {
  const pillars = await prisma.article.findMany({
    where: { published: true, type: 'pillar' },
    include: { category: true },
    orderBy: { date: 'desc' },
  });
  return pillars.map(normalizePillar);
}

export async function getArticleBySlug(slug) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      pillar: { select: { id: true, title: true, slug: true } },
      clusters: { where: { published: true }, select: { id: true, title: true, slug: true } },
    },
  });
  if (!article) return null;
  if (article.type === 'pillar') return { ...normalizePillar(article), isPillar: true };
  return { ...normalizeArticle(article), isPillar: false };
}

function normalizeArticle(a) {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category?.key,
    category_label: a.category?.label,
    reading_time: a.readingTime,
    date: a.date?.toISOString(),
    image: a.imageUrl,
    pillar: a.pillar,
    pillar_id: a.pillarId,
  };
}

function normalizePillar(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.excerpt,
    category: p.category?.key,
    category_label: p.category?.label,
    reading_time: p.readingTime,
    date: p.date?.toISOString(),
    image: p.imageUrl,
  };
}
```

- [ ] Commit:
```bash
git add lib/articles.js
git commit -m "feat: lib/articles.js now uses prisma"
```

---

### Task 17: Refactor server pages

**Files:** `app/baza-wiedzy/page.js`, `app/artykul/[slug]/page.js`, `app/wydarzenia/page.js`, `app/ai-news/page.js`

- [ ] Update `app/baza-wiedzy/page.js`:
```js
import { getPillars, getAllArticles } from '@/lib/articles';
import KnowledgeClient from './KnowledgeClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Baza Wiedzy AI | AI NETWORK',
  description: 'Praktyczne materiały, przewodniki i case studies ze świata AI w biznesie.',
};

export default async function BazaWiedzyPage() {
  const [pillars, articles] = await Promise.all([getPillars(), getAllArticles()]);
  return <KnowledgeClient pillars={pillars} articles={articles} />;
}
```

- [ ] Update `app/artykul/[slug]/page.js` — remove `generateStaticParams`, replace `fs.readFileSync` with Prisma via `getArticleBySlug`, add `export const revalidate = 60`:
```js
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/articles';
import ArticleClient from './ArticleClient';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | AI NETWORK`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  // content is now in article.content from DB (already has frontmatter stripped)
  return <ArticleClient article={article} markdown={article.content || ''} />;
}
```

- [ ] Update `app/wydarzenia/page.js` — replace hardcoded arrays with Prisma query, convert to server component:
```js
import { prisma } from '@/lib/prisma';
import WydarzeniaClient from './WydarzeniaClient';

export const dynamic = 'force-dynamic';

export default async function WydarzeniaPage() {
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { status: 'upcoming' }, orderBy: { date: 'asc' } }),
    prisma.event.findMany({ where: { status: 'past' }, orderBy: { date: 'desc' } }),
  ]);
  return <WydarzeniaClient upcomingEvents={upcoming} pastEvents={past} />;
}
```

- [ ] Rename `app/wydarzenia/page.js` current client code to `app/wydarzenia/WydarzeniaClient.js` — add `'use client'` directive, accept `{ upcomingEvents, pastEvents }` props instead of hardcoded arrays.

- [ ] Update `app/ai-news/page.js` similarly — extract client component, fetch from Prisma in server component.

- [ ] Test build:
```bash
npm run build
```
Expected: clean build, no TypeScript or module errors.

- [ ] Commit:
```bash
git add app/baza-wiedzy app/artykul app/wydarzenia app/ai-news lib/articles.js
git commit -m "feat: frontend pages now use prisma instead of files"
```

---

## Chunk 6: Admin Layout + Login + Dashboard

### Task 18: Admin global styles and layout

**Files:** `app/admin/layout.js`, `components/admin/AdminSidebar.js`

- [ ] Write `components/admin/AdminSidebar.js`:
```jsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▣' },
  { href: '/admin/events', label: 'Eventy', icon: '📅' },
  { href: '/admin/articles', label: 'Artykuły', icon: '📝' },
  { href: '/admin/news', label: 'AI News', icon: '🗞' },
  { href: '/admin/drafts', label: 'Propozycje', icon: '💡', badge: true },
  { href: '/admin/categories', label: 'Kategorie', icon: '🏷' },
  { href: '/admin/settings', label: 'Ustawienia', icon: '⚙' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    fetch('/api/news/drafts')
      .then(r => r.json())
      .then(d => setDraftCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside style={{
      width: '240px', minHeight: '100vh', flexShrink: 0,
      background: '#111111', borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Montserrat, sans-serif',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ color: '#F5C518', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>
          AI NETWORK
        </span>
        <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>Admin Panel</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px',
              background: active ? 'rgba(245,197,24,0.08)' : 'transparent',
              borderLeft: active ? '3px solid #F5C518' : '3px solid transparent',
              color: active ? '#F5C518' : '#AAAAAA',
              textDecoration: 'none', fontSize: '13px', fontWeight: 600,
              transition: 'all 0.15s',
            }}>
              <span>{item.icon}</span>
              {item.label}
              {item.badge && draftCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#F5C518', color: '#111',
                  borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 800,
                }}>
                  {draftCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={{
        margin: '16px', padding: '10px', borderRadius: '8px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#888', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        fontFamily: 'inherit',
      }}>
        Wyloguj się
      </button>
    </aside>
  );
}
```

- [ ] Write `app/admin/layout.js`:
```jsx
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — AI NETWORK' };

export default function AdminLayout({ children }) {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#0D0D0D', color: '#FFFFFF',
      fontFamily: 'Montserrat, -apple-system, sans-serif',
    }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
```

- [ ] Write `app/admin/page.js` (redirect):
```js
import { redirect } from 'next/navigation';
export default function AdminRoot() {
  redirect('/admin/dashboard');
}
```

- [ ] Commit:
```bash
git add app/admin components/admin/AdminSidebar.js
git commit -m "feat: admin layout and sidebar"
```

---

### Task 19: Login page

**Files:** `app/admin/login/page.js`

- [ ] Write `app/admin/login/page.js`:
```jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Nieprawidłowy email lub hasło');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0D0D0D', fontFamily: 'Montserrat, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '360px', background: '#1A1A1A',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '40px',
      }}>
        <div style={{ color: '#F5C518', fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>
          AI NETWORK
        </div>
        <div style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Panel administracyjny</div>

        {error && (
          <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)',
            borderRadius: '8px', padding: '10px 14px', color: '#E74C3C', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' }}>
          Email
        </label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)} required
          style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: '#fff', fontSize: '14px', fontFamily: 'inherit',
            marginBottom: '16px', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' }}>
          Hasło
        </label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)} required
          style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: '#fff', fontSize: '14px', fontFamily: 'inherit',
            marginBottom: '24px', boxSizing: 'border-box' }}
        />

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px', background: '#F5C518', color: '#111',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
        }}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] Override layout for login (no sidebar):
```jsx
// app/admin/login/layout.js
export default function LoginLayout({ children }) {
  return children;
}
```

- [ ] Test login manually: `npm run dev`, go to `http://localhost:3001/admin/login`
- [ ] Commit:
```bash
git add app/admin/login
git commit -m "feat: admin login page"
```

---

### Task 20: Dashboard page

**Files:** `app/admin/dashboard/page.js`

- [ ] Write `app/admin/dashboard/page.js`:
```jsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [articles, events, news, drafts] = await Promise.all([
    prisma.article.count(),
    prisma.event.count(),
    prisma.news.count({ where: { published: true } }),
    prisma.newsDraft.count({ where: { status: 'pending' } }),
  ]);
  return { articles, events, news, drafts };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const recentArticles = await prisma.article.findMany({
    take: 5, orderBy: { createdAt: 'desc' }, include: { category: true },
  });

  const cards = [
    { label: 'Artykuły', value: stats.articles, href: '/admin/articles', color: '#5B8DEF' },
    { label: 'Eventy', value: stats.events, href: '/admin/events', color: '#F5C518' },
    { label: 'AI News', value: stats.news, href: '/admin/news', color: '#2ECC71' },
    { label: 'Propozycje do przejrzenia', value: stats.drafts, href: '/admin/drafts', color: '#E74C3C' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Witaj w panelu AI NETWORK</p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '40px' }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
              borderTop: `3px solid ${c.color}`, borderRadius: '10px', padding: '20px',
            }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>{c.value}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent content */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
        Ostatnio dodane artykuły
      </h2>
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {recentArticles.map((a, i) => (
          <Link key={a.id} href={`/admin/articles/${a.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', textDecoration: 'none',
            borderBottom: i < recentArticles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              padding: '2px 8px', background: `${a.category?.color}22`,
              borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              color: a.category?.color || '#F5C518', whiteSpace: 'nowrap',
            }}>
              {a.type === 'pillar' ? 'Filar' : 'Artykuł'}
            </span>
            <span style={{ color: '#DDDDDD', fontSize: '13px', flex: 1 }}>{a.title}</span>
            <span style={{ color: '#555', fontSize: '11px' }}>
              {a.createdAt.toLocaleDateString('pl-PL')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add app/admin/dashboard
git commit -m "feat: admin dashboard with stats"
```

---

## Chunk 7: Admin Content Forms

### Task 21: Shared admin components

**Files:** `components/admin/MarkdownEditor.js`, `components/admin/ImagePicker.js`

- [ ] Write `components/admin/MarkdownEditor.js`:
```jsx
'use client';
import { useState } from 'react';
import { marked } from 'marked';

const toolbarButtons = [
  { label: 'B', action: (sel) => `**${sel}**` },
  { label: 'I', action: (sel) => `*${sel}*` },
  { label: 'H2', action: (sel) => `\n## ${sel}\n` },
  { label: 'H3', action: (sel) => `\n### ${sel}\n` },
  { label: '> Quote', action: (sel) => `\n> ${sel}\n` },
  { label: '---', action: () => '\n---\n' },
];

export default function MarkdownEditor({ value, onChange }) {
  const [tab, setTab] = useState('edit');

  function insertMarkdown(fn) {
    const textarea = document.getElementById('md-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || 'tekst';
    const result = fn(selected);
    const newVal = value.slice(0, start) + result + value.slice(end);
    onChange(newVal);
  }

  const btnStyle = {
    padding: '5px 10px', background: '#222', border: '1px solid rgba(255,255,255,0.1)',
    color: '#CCC', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '4px', padding: '8px', background: '#1A1A1A',
        borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
        {toolbarButtons.map(btn => (
          <button key={btn.label} type="button" onClick={() => insertMarkdown(btn.action)} style={btnStyle}>
            {btn.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          {['edit', 'preview'].map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              ...btnStyle,
              background: tab === t ? '#F5C518' : '#222',
              color: tab === t ? '#111' : '#CCC',
            }}>
              {t === 'edit' ? 'Edytor' : 'Podgląd'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'edit' ? (
        <textarea
          id="md-editor"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', minHeight: '400px', padding: '16px',
            background: '#111', color: '#DDD', border: 'none',
            fontSize: '14px', fontFamily: 'monospace', lineHeight: 1.7,
            resize: 'vertical', boxSizing: 'border-box', outline: 'none',
          }}
        />
      ) : (
        <div
          className="article-body"
          style={{ minHeight: '400px', padding: '24px', background: '#111', color: '#DDD' }}
          dangerouslySetInnerHTML={{ __html: marked(value || '') }}
        />
      )}
    </div>
  );
}
```

- [ ] Write `components/admin/ImagePicker.js`:
```jsx
'use client';
import { useState } from 'react';

export default function ImagePicker({ value, onChange, contentType, slug }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  async function generateThumbnail() {
    if (!slug) { setError('Najpierw podaj tytuł (slug)'); return; }
    setGenerating(true);
    setError('');
    const res = await fetch('/api/generate/thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, type: contentType }),
    });
    setGenerating(false);
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      setError('Błąd generowania obrazu. Spróbuj ponownie lub wgraj ręcznie.');
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !slug) return;
    const form = new FormData();
    form.append('file', file);
    form.append('type', contentType);
    form.append('slug', slug);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      setError('Błąd uploadu pliku');
    }
  }

  return (
    <div>
      {value && (
        <img src={value} alt="thumbnail" style={{ width: '100%', maxHeight: '160px',
          objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button type="button" onClick={generateThumbnail} disabled={generating} style={{
          padding: '8px 16px', background: '#F5C518', color: '#111', border: 'none',
          borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          {generating ? 'Generuję...' : '✨ Generuj AI'}
        </button>
        <label style={{
          padding: '8px 16px', background: '#222', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px', fontSize: '12px', color: '#CCC', cursor: 'pointer', fontWeight: 600,
        }}>
          Wgraj plik
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload}
            style={{ display: 'none' }} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange('')} style={{
            padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', fontSize: '12px', color: '#888', cursor: 'pointer',
          }}>✕</button>
        )}
      </div>
      {error && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '6px' }}>{error}</div>}
    </div>
  );
}
```

- [ ] Commit:
```bash
git add components/admin/MarkdownEditor.js components/admin/ImagePicker.js
git commit -m "feat: admin shared components markdown editor and image picker"
```

---

### Task 22: Articles admin pages

**Files:** `app/admin/articles/page.js`, `app/admin/articles/new/page.js`, `app/admin/articles/[id]/page.js`

- [ ] Write `app/admin/articles/page.js`:
```jsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArticlesListPage() {
  const articles = await prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>Artykuły</h1>
        <Link href="/admin/articles/new" style={{
          padding: '10px 20px', background: '#F5C518', color: '#111',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + Nowy artykuł
        </Link>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {articles.map((a, i) => (
          <Link key={a.id} href={`/admin/articles/${a.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', textDecoration: 'none',
            borderBottom: i < articles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: a.type === 'pillar' ? 'rgba(245,197,24,0.15)' : 'rgba(91,141,239,0.15)',
              color: a.type === 'pillar' ? '#F5C518' : '#5B8DEF',
            }}>
              {a.type === 'pillar' ? 'Filar' : 'Cluster'}
            </span>
            <span style={{ flex: 1, color: '#DDD', fontSize: '13px' }}>{a.title}</span>
            <span style={{ color: '#555', fontSize: '11px' }}>{a.category?.label}</span>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: a.published ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)',
              color: a.published ? '#2ECC71' : '#888',
            }}>
              {a.published ? 'Opublikowany' : 'Szkic'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] Write `app/admin/articles/new/page.js` — client component with full form:
```jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImagePicker from '@/components/admin/ImagePicker';

function slugify(str) {
  return str.toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function NewArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: 'cluster', title: '', slug: '', categoryId: '', pillarId: '',
    excerpt: '', readingTime: '10 min', date: new Date().toISOString().split('T')[0],
    imageUrl: '', content: '', published: false,
  });
  const [categories, setCategories] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories?type=article').then(r => r.json()).then(setCategories);
    fetch('/api/articles?type=pillar').then(r => r.json()).then(setPillars);
  }, []);

  function set(key, val) {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'title') next.slug = slugify(val);
      return next;
    });
  }

  async function generateMeta() {
    if (!form.title || !form.content) return;
    setGenerating(true);
    const res = await fetch('/api/generate/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, content: form.content }),
    });
    if (res.ok) {
      const data = await res.json();
      setForm(f => ({ ...f, excerpt: data.excerpt || f.excerpt, readingTime: data.readingTime || f.readingTime }));
    }
    setGenerating(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/articles');
    else setError('Błąd zapisu. Sprawdź czy slug jest unikalny.');
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit',
    boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '32px' }}>Nowy artykuł</h1>

      <form onSubmit={handleSubmit}>
        {/* Type toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['pillar', 'cluster'].map(t => (
            <button key={t} type="button" onClick={() => set('type', t)} style={{
              padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
              fontFamily: 'inherit', cursor: 'pointer',
              background: form.type === t ? '#F5C518' : '#222',
              color: form.type === t ? '#111' : '#888',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              {t === 'pillar' ? 'Filar wiedzy' : 'Artykuł cluster'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Tytuł *</label>
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Kategoria *</label>
            <select style={inputStyle} value={form.categoryId} onChange={e => set('categoryId', e.target.value)} required>
              <option value="">Wybierz...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          {form.type === 'cluster' && (
            <div>
              <label style={labelStyle}>Filar nadrzędny</label>
              <select style={inputStyle} value={form.pillarId} onChange={e => set('pillarId', e.target.value)}>
                <option value="">Brak</option>
                {pillars.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Excerpt</label>
            <button type="button" onClick={generateMeta} disabled={generating} style={{
              fontSize: '11px', background: 'transparent', border: 'none',
              color: '#F5C518', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {generating ? 'Generuję...' : '✨ Generuj przez Claude'}
            </button>
          </div>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Obraz</label>
          <ImagePicker value={form.imageUrl} onChange={v => set('imageUrl', v)}
            contentType="articles" slug={form.slug} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Treść (Markdown)</label>
          <MarkdownEditor value={form.content} onChange={v => set('content', v)} />
        </div>

        {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" onClick={() => set('published', false)} disabled={saving} style={{
            padding: '12px 24px', background: '#333', color: '#CCC', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Zapisz szkic
          </button>
          <button type="submit" onClick={() => set('published', true)} disabled={saving} style={{
            padding: '12px 24px', background: '#F5C518', color: '#111', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {saving ? 'Zapisuję...' : 'Opublikuj →'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] Write `app/admin/articles/[id]/page.js` — same form but pre-populated from `GET /api/articles/[id]`, uses `PUT` instead of `POST`, adds delete button.

- [ ] Commit:
```bash
git add app/admin/articles
git commit -m "feat: admin articles pages list, new, edit"
```

---

### Task 23: Events and News admin pages

**Files:** `app/admin/events/`, `app/admin/news/`

- [ ] Write `app/admin/events/page.js` (list — same pattern as articles list)

- [ ] Write `app/admin/events/new/page.js` — form fields: brand, title, excerpt, date, time, location, venue, format, seats, free (checkbox), accent (color input), href, status (select), ImagePicker

- [ ] Write `app/admin/events/[id]/page.js` — edit form (pre-populated, PUT + DELETE)

- [ ] Write `app/admin/news/page.js`, `new/page.js`, `[id]/page.js` — same pattern as articles but without type/pillar fields, with source and tags fields. Tags: comma-separated input that splits on save.

- [ ] Commit:
```bash
git add app/admin/events app/admin/news
git commit -m "feat: admin events and news pages"
```

---

## Chunk 8: Categories, Settings, Drafts

### Task 24: Categories page

**Files:** `app/admin/categories/page.js`

- [ ] Write `app/admin/categories/page.js`:
```jsx
'use client';
import { useState, useEffect } from 'react';

function slugify(str) {
  return str.toLowerCase()
    .replace(/ą/g,'a').replace(/ę/g,'e').replace(/ó/g,'o').replace(/ś/g,'s')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export default function CategoriesPage() {
  const [articleCats, setArticleCats] = useState([]);
  const [newsCats, setNewsCats] = useState([]);
  const [form, setForm] = useState({ label: '', color: '#5B8DEF', type: 'article' });

  async function load() {
    const [a, n] = await Promise.all([
      fetch('/api/categories?type=article').then(r => r.json()),
      fetch('/api/categories?type=news').then(r => r.json()),
    ]);
    setArticleCats(a);
    setNewsCats(n);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, key: slugify(form.label) }),
    });
    setForm({ label: '', color: '#5B8DEF', type: form.type });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Usunąć kategorię?')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    load();
  }

  function CatList({ cats }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {cats.map(c => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', background: '#1A1A1A',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
          }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: c.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: '#DDD', fontSize: '13px' }}>{c.label}</span>
            <span style={{ color: '#555', fontSize: '11px' }}>{c.key}</span>
            <button onClick={() => handleDelete(c.id)} style={{
              background: 'transparent', border: 'none', color: '#E74C3C',
              cursor: 'pointer', fontSize: '12px',
            }}>Usuń</button>
          </div>
        ))}
      </div>
    );
  }

  const inputStyle = {
    padding: '8px 12px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px', color: '#fff', fontSize: '13px', fontFamily: 'inherit',
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '32px' }}>Kategorie</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Artykuły ({articleCats.length})
          </h2>
          <CatList cats={articleCats} />
        </div>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI News ({newsCats.length})
          </h2>
          <CatList cats={newsCats} />
        </div>
      </div>

      {/* Add form */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>Dodaj kategorię</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <input placeholder="Nazwa kategorii" style={inputStyle} value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
        <input type="color" value={form.color}
          onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
          style={{ width: '44px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
        <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="article">Artykuły</option>
          <option value="news">AI News</option>
        </select>
        <button type="submit" style={{
          padding: '8px 20px', background: '#F5C518', color: '#111',
          border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Dodaj
        </button>
      </form>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add app/admin/categories
git commit -m "feat: admin categories management page"
```

---

### Task 25: Settings and Drafts pages

**Files:** `app/admin/settings/page.js`, `app/admin/drafts/page.js`

- [ ] Write `app/admin/settings/page.js` — shows scan sources list (from `/api/scan-sources`), add new source form, API key display (masked). Add `app/api/scan-sources/route.js` with GET/POST/DELETE using `prisma.scanSource`.

- [ ] Write `app/admin/drafts/page.js`:
```jsx
import { prisma } from '@/lib/prisma';
import DraftsClient from './DraftsClient';

export const dynamic = 'force-dynamic';

export default async function DraftsPage() {
  const drafts = await prisma.newsDraft.findMany({
    where: { status: 'pending' },
    include: { source: true },
    orderBy: { scannedAt: 'desc' },
  });
  return <DraftsClient initialDrafts={drafts} />;
}
```

- [ ] Write `app/admin/drafts/DraftsClient.js` — client component showing draft cards, "Generuj artykuł" button (calls `/api/news/drafts/[id]/generate` with streaming SSE), "Odrzuć" button. Modal shows streaming Claude output. On stream complete: redirect to `/admin/news/[newNewsId]` for editing before publish.

- [ ] Commit:
```bash
git add app/admin/settings app/admin/drafts
git commit -m "feat: admin settings and drafts pages"
```

---

## Chunk 9: AI Agents

### Task 26: Claude content agent

**Files:** `lib/agents/content-agent.js`, `app/api/generate/content/route.js`

- [ ] Write `lib/agents/content-agent.js`:
```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function generateMeta({ title, content }) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Jesteś redaktorem AI NETWORK — platforma wiedzy AI dla biznesu (PL).
Na podstawie poniższego artykułu wygeneruj:
- excerpt: 2-3 zdania, praktyczny, bez lania wody
- readingTime: szacowany czas czytania ("X min", zakładaj 200 słów/min)
Odpowiedz TYLKO JSON: { "excerpt": "...", "readingTime": "X min" }

Tytuł: ${title}

Treść:
${content.slice(0, 2000)}`
    }],
  });

  try {
    return JSON.parse(message.content[0].text);
  } catch {
    return { excerpt: '', readingTime: '10 min' };
  }
}

export async function generateFullArticle({ title, rawContent, onChunk }) {
  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Jesteś ekspertem AI piszącym dla polskich przedsiębiorców i menedżerów.
Napisz artykuł na podstawie poniższego researchu.
Styl: praktyczny, konkretny, bez marketingowego bełkotu, po polsku.
Format: Markdown z nagłówkami H2/H3, listy wypunktowane tam gdzie logiczne, max 800 słów.
Zacznij od razu od treści — bez wstępnych komentarzy.

Research:
${rawContent}`
    }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onChunk(chunk.delta.text);
    }
  }

  const finalMessage = await stream.finalMessage();
  return finalMessage.content[0].text;
}
```

- [ ] Write `app/api/generate/content/route.js`:
```js
import { NextResponse } from 'next/server';
import { generateMeta } from '@/lib/agents/content-agent';

export async function POST(req) {
  const { title, content } = await req.json();
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const meta = await generateMeta({ title, content: content || '' });
  return NextResponse.json(meta);
}
```

- [ ] Write `app/api/news/drafts/[id]/generate/route.js` (streaming SSE):
```js
import { prisma } from '@/lib/prisma';
import { generateFullArticle } from '@/lib/agents/content-agent';
import { generateMeta } from '@/lib/agents/content-agent';
import { revalidatePath } from 'next/cache';

export async function POST(req, { params }) {
  const draft = await prisma.newsDraft.findUnique({ where: { id: params.id } });
  if (!draft) return new Response('Not found', { status: 404 });

  // Mark as generating
  await prisma.newsDraft.update({ where: { id: params.id }, data: { status: 'generating' } });

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

        // Generate meta
        const meta = await generateMeta({ title: draft.title, content: fullText });
        const slug = draft.title.toLowerCase()
          .replace(/[ąćęłńóśźż]/g, c => ({ą:'a',ć:'c',ę:'e',ł:'l',ń:'n',ó:'o',ś:'s',ź:'z',ż:'z'}[c]||c))
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        // Get default news category
        const defaultCat = await prisma.category.findFirst({ where: { type: 'news' } });

        // Create news record
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
          where: { id: params.id },
          data: { status: 'published', newsId: news.id },
        });

        revalidatePath('/ai-news');
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, newsId: news.id })}\n\n`));
        controller.close();
      } catch (err) {
        // Rollback
        await prisma.newsDraft.update({ where: { id: params.id }, data: { status: 'pending' } });
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
```

- [ ] Commit:
```bash
git add lib/agents/content-agent.js app/api/generate/content app/api/news/drafts
git commit -m "feat: claude content agent and streaming draft generation"
```

---

### Task 27: Gemini thumbnail agent

**Files:** `lib/agents/thumbnail-agent.js`, `app/api/generate/thumbnail/route.js`

- [ ] Write `lib/agents/thumbnail-agent.js`:
```js
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function generateThumbnail({ title, slug, type }) {
  const prompt = `Dark futuristic tech illustration for: "${title}". Style: dark background #0D0D0D, yellow/gold accent #F5C518, professional minimalist, no text in image, landscape format`;

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${err}`);
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
```

- [ ] Write `app/api/generate/thumbnail/route.js`:
```js
import { NextResponse } from 'next/server';
import { generateThumbnail } from '@/lib/agents/thumbnail-agent';

export async function POST(req) {
  const { slug, type = 'articles' } = await req.json();
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  // Get title from DB for better prompt
  const { prisma } = await import('@/lib/prisma');
  const article = await prisma.article.findUnique({ where: { slug } }).catch(() => null);
  const title = article?.title || slug;

  try {
    const url = await generateThumbnail({ title, slug, type });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: 'generation_failed', message: err.message }, { status: 500 });
  }
}
```

- [ ] Commit:
```bash
git add lib/agents/thumbnail-agent.js app/api/generate/thumbnail
git commit -m "feat: gemini thumbnail agent"
```

---

## Chunk 10: News Scanner

### Task 28: Scanner logic

**Files:** `lib/scanner.js`

- [ ] Write `lib/scanner.js`:
```js
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

function extractText(html, url) {
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header, aside').remove();
  const text = $('article, main, .content, body').first().text()
    .replace(/\s+/g, ' ').trim().slice(0, 8000);
  return text;
}

async function extractTopics(texts, sourceName) {
  const combined = texts.join('\n\n---\n\n').slice(0, 12000);

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
  "sourceUrl": "URL artykułu jeśli znasz, lub podaj pusty string"
}]

Artykuły:
${combined}`
    }],
  });

  try {
    const text = message.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
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
      const text = extractText(html, source.url);
      const topics = await extractTopics([text], source.name);

      for (const topic of topics) {
        // Deduplication: skip if similar URL exists in last 7 days
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
      console.error(`Scanner error for ${source.url}:`, err.message);
    }
  }

  return { scanned: sources.length, drafts: totalDrafts };
}
```

- [ ] Write `app/api/scan/route.js` (manual trigger):
```js
import { NextResponse } from 'next/server';
import { runScan } from '@/lib/scanner';

export async function POST() {
  const result = await runScan();
  return NextResponse.json(result);
}
```

- [ ] Write `instrumentation.ts` (cron initialization):
```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { runScan } = await import('./lib/scanner');

    // Monday and Thursday at 8:00 AM
    cron.default.schedule('0 8 * * 1,4', async () => {
      console.log('[Scanner] Starting scheduled news scan...');
      try {
        const result = await runScan();
        console.log(`[Scanner] Done: ${result.drafts} new drafts from ${result.scanned} sources`);
      } catch (err) {
        console.error('[Scanner] Error:', err);
      }
    });

    console.log('[Scanner] Cron scheduled (Mon + Thu 8:00)');
  }
}
```

- [ ] Add `instrumentationHook: true` to `next.config.mjs` (required for instrumentation.ts):
```js
const nextConfig = {
  instrumentationHook: true,
  serverExternalPackages: ['@prisma/client'],
  // ... existing
};
```

- [ ] Commit:
```bash
git add lib/scanner.js app/api/scan instrumentation.ts next.config.mjs
git commit -m "feat: news scanner with cron and manual trigger"
```

---

## Chunk 11: Docker + Deploy

### Task 29: Dockerfile

**Files:** `Dockerfile`, `.dockerignore`

- [ ] Write `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] Add to `next.config.mjs`:
```js
output: 'standalone',
```

- [ ] Write `.dockerignore`:
```
node_modules
.next
.git
.env
*.md
docs/
```

- [ ] Commit:
```bash
git add Dockerfile .dockerignore next.config.mjs
git commit -m "feat: dockerfile for production build"
```

---

### Task 30: Docker Compose

**Files:** `docker-compose.yml`, `docker-compose.dev.yml`

- [ ] Write `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3001:3000"
    env_file: .env
    environment:
      - DATABASE_URL=postgresql://ainetwork:${DB_PASSWORD}@db:5432/ainetwork
    volumes:
      - ./public/assets:/app/public/assets
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ainetwork
      POSTGRES_USER: ainetwork
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ainetwork"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

- [ ] Write `docker-compose.dev.yml` (local dev with DB only):
```yaml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: ainetwork
      POSTGRES_USER: ainetwork
      POSTGRES_PASSWORD: devpassword
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
volumes:
  postgres_dev_data:
```

- [ ] Write `scripts/deploy.sh`:
```bash
#!/bin/bash
set -e
echo "Pulling latest..."
git pull origin main

echo "Building..."
docker compose build --no-cache

echo "Running migrations..."
docker compose run --rm app npx prisma migrate deploy

echo "Starting..."
docker compose up -d

echo "Deploy complete. App running on port 3001."
```

- [ ] Make executable:
```bash
chmod +x scripts/deploy.sh
```

- [ ] Write VPS setup instructions in `docs/vps-setup.md`:
```markdown
# VPS Setup (Hostinger)

## 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

## 2. Clone repo
git clone https://github.com/YOUR_REPO/ainetwork-web.git
cd ainetwork-web

## 3. Configure .env
cp .env.example .env
nano .env
# Fill: DB_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET, API keys

## 4. Generate password hash
node -e "const b=require('bcryptjs');b.hash('YOUR_PASSWORD',10).then(h=>console.log(h))"

## 5. First deploy
docker compose up -d db
sleep 5
docker compose run --rm app npx prisma migrate deploy
docker compose run --rm app npx prisma db seed
docker compose run --rm app node scripts/migrate-to-db.js
docker compose up -d

## 6. Nginx reverse proxy (optional, for HTTPS)
# Point nginx to localhost:3001
```

- [ ] Commit:
```bash
git add docker-compose.yml docker-compose.dev.yml scripts/deploy.sh docs/vps-setup.md
git commit -m "feat: docker compose and deployment scripts"
```

---

### Task 31: Final integration test

- [ ] Start full stack locally:
```bash
docker compose -f docker-compose.dev.yml up -d
npm run dev
```

- [ ] Verify checklist:
  - [ ] `GET /api/articles` returns 401 without auth
  - [ ] Login at `http://localhost:3001/admin/login` — redirects to dashboard
  - [ ] Dashboard shows article/event/news counts
  - [ ] Create new article → appears on `/baza-wiedzy`
  - [ ] Create new event → appears on `/wydarzenia`
  - [ ] "Generuj przez Claude" fills excerpt field
  - [ ] "Generuj AI" creates thumbnail image
  - [ ] Add scan source in Settings → run manual scan from `/api/scan` → drafts appear on `/admin/drafts`
  - [ ] Click "Generuj artykuł" on a draft → streaming modal → news created → appears on `/ai-news`

- [ ] Final commit:
```bash
git add .
git commit -m "feat: complete cms dashboard with ai agents and news scanner"
```

---

## Summary

| Chunk | Tasks | Deliverable |
|-------|-------|-------------|
| 1 | 1-6 | Prisma schema + PostgreSQL + seed |
| 2 | 7-9 | Auth (JWT + middleware) |
| 3 | 10-14 | All CRUD API routes |
| 4 | 15 | Data migration from files to DB |
| 5 | 16-17 | Frontend pages using Prisma |
| 6 | 18-20 | Admin layout + login + dashboard |
| 7 | 21-23 | Admin forms (articles, events, news) |
| 8 | 24-25 | Categories + settings + drafts |
| 9 | 26-27 | Claude + Gemini agents |
| 10 | 28 | News scanner + cron |
| 11 | 29-31 | Docker + deploy |

Each chunk is independently deployable and testable. Deploy order: 1 → 2 → 3 → 4 → 5 (site works from DB) → 6-11 (admin + agents).
