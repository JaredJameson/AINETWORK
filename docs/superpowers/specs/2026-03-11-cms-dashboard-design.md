# CMS Dashboard — Design Spec
**Data:** 2026-03-11
**Projekt:** AI NETWORK (ainetwork-web)
**Status:** Approved by user

---

## 1. Cel

Zbudowanie pełnego CMS-a zintegrowanego z istniejącą stroną Next.js, umożliwiającego:
- Zarządzanie artykułami (pillar + cluster), eventami, AI News i kategoriami z poziomu dashboardu
- Automatyczne skanowanie internetu 2x w tygodniu i generowanie propozycji newsów
- Jedno kliknięcie: wybierasz temat → Claude pisze artykuł → Gemini generuje thumbnail → treść pojawia się na stronie
- Deployment na VPS Hostinger via Docker Compose

---

## 2. Architektura

### Stack
- **Frontend + Backend:** Next.js 16 (App Router) — istniejący projekt
- **Baza danych:** PostgreSQL 16 w Docker
- **ORM:** Prisma
- **Auth:** JWT w httpOnly cookie, dane admina w `.env`
- **Agent treści:** Claude API (`claude-sonnet-4-6`)
- **Agent obrazów:** Gemini API (`gemini-2.0-flash-exp`) — nano-banana-pro pattern
- **Harmonogram:** `node-cron` wbudowany w Next.js server

### Deployment (Docker Compose)
```yaml
services:
  app:
    build: .
    ports: ["3001:3000"]
    env_file: .env
    volumes:
      - ./public/assets:/app/public/assets
    depends_on: [db]

  db:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ainetwork
      POSTGRES_USER: ainetwork
      POSTGRES_PASSWORD: ${DB_PASSWORD}

volumes:
  postgres_data:
```

Obrazy (`/public/assets/images/`) persystują jako volume — nie znikają po aktualizacji kontenera.

### Dane — migracja z plików do PostgreSQL
Istniejące dane z `public/articles.json` i hardcoded events/news zostaną zmigrowane do PostgreSQL przez jednorazowy skrypt `scripts/migrate-to-db.js`.

Strony Next.js zmienią się z `lib/articles.js` (odczyt pliku) na zapytania Prisma w server components. Dane zawsze aktualne — zero rebuild po dodaniu treści.

---

## 3. Schemat bazy danych (Prisma)

```prisma
model Article {
  id          String    @id @default(cuid())
  slug        String    @unique
  type        String    // "pillar" | "cluster"
  title       String
  content     String    // markdown
  excerpt     String
  readingTime String    // "12 min"
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
  brand     String   // "AI NETWORK vol.4"
  title     String
  excerpt   String
  date      DateTime
  time      String   // "17:00–20:00"
  location  String
  venue     String
  format    String   // "Konferencja" | "Warsztat"
  seats     String
  free      Boolean  @default(true)
  accent    String   // hex color
  imageUrl  String?
  status    String   // "upcoming" | "past"
  href      String?  // zewnętrzny link (subdomeny)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model News {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  content     String    // markdown
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
  tags        String[]    // PostgreSQL native array — wymaga PostgreSQL jako docelowej bazy
  status      String      // "pending" | "generating" | "published" | "rejected"
  scannedAt   DateTime    @default(now())
  newsId      String?     @unique
  sourceId    String?     // link do ScanSource dla deduplicacji i statystyk
  news        News?       @relation(fields: [newsId], references: [id])
  source      ScanSource? @relation(fields: [sourceId], references: [id])
  updatedAt   DateTime    @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  key      String    @unique // "content-marketing"
  label    String    // "Content Marketing"
  color    String    // "#5B8DEF"
  type     String    // "article" | "news"
  articles Article[]
  news     News[]
}

// Źródła do skanowania newsów (konfigurowane w Ustawieniach)
model ScanSource {
  id        String      @id @default(cuid())
  url       String      @unique
  name      String      // "TechCrunch"
  enabled   Boolean     @default(true)
  lastScannedAt DateTime?
  createdAt DateTime    @default(now())
  drafts    NewsDraft[]
}

```

---

## 4. API Routes

Wszystkie chronione JWT middleware (`middleware.ts` sprawdza cookie `ain_token`).

| Method | Route | Opis |
|--------|-------|------|
| POST | `/api/auth/login` | Login, zwraca JWT w httpOnly cookie |
| GET | `/api/auth/me` | Walidacja tokenu |
| POST | `/api/auth/logout` | Czyszczenie cookie |
| GET/POST | `/api/articles` | Lista / nowy artykuł |
| GET/PUT/DELETE | `/api/articles/[id]` | Szczegóły / edycja / usunięcie |
| GET/POST | `/api/events` | Lista / nowy event |
| GET/PUT/DELETE | `/api/events/[id]` | Szczegóły / edycja / usunięcie |
| GET/POST | `/api/news` | Lista / nowy news |
| GET/PUT/DELETE | `/api/news/[id]` | Szczegóły / edycja / usunięcie |
| GET | `/api/news/drafts` | Lista propozycji (NewsDraft) |
| POST | `/api/news/drafts/[id]/generate` | Generuj artykuł z propozycji |
| POST | `/api/news/drafts/[id]/reject` | Odrzuć propozycję |
| GET/POST/DELETE | `/api/categories` | Zarządzanie kategoriami |
| POST | `/api/generate/thumbnail` | Gemini → zwraca URL obrazu |
| POST | `/api/generate/content` | Claude → excerpt/tagi/readingTime |
| POST | `/api/scan` | Uruchom scanner ręcznie |
| POST | `/api/upload` | Upload obrazu (multipart/form-data, max 5MB, JPEG/PNG/WebP) |

---

## 5. Agenci AI

### Agent treści (Claude `claude-sonnet-4-6`)

Wywoływany przy:
1. Kliknięciu "Generuj przez Claude" przy excerptcie/tagach — szybka odpowiedź
2. Kliknięciu "Generuj artykuł" z propozycji newsa — pełny artykuł (streaming)

**Prompt dla excerpt/tagi:**
```
Jesteś redaktorem AI NETWORK — platforma wiedzy AI dla biznesu (PL).
Na podstawie tytułu i treści artykułu wygeneruj:
- excerpt: 2-3 zdania, praktyczny, bez lania wody
- tags: 3-5 tagów (lowercase, po angielsku)
- readingTime: szacowany czas czytania ("X min")
Odpowiedz JSON: { excerpt, tags, readingTime }
```

**Prompt dla pełnego artykułu z propozycji:**
```
Jesteś ekspertem AI piszącym dla polskich przedsiębiorców.
Napisz artykuł na podstawie poniższego researchu.
Styl: praktyczny, konkretny, bez marketingowego bełkotu.
Format: Markdown z nagłówkami H2/H3, max 800 słów.
[research content]
```

### Agent obrazów (Gemini `gemini-2.0-flash-exp`)

Wywoływany przy kliknięciu "Generuj AI" przy polu obrazu.

**Auto-prompt generowany z tytułu:**
```
Dark futuristic tech illustration for article: "{title}"
Style: dark background #0D0D0D, yellow/gold accent #F5C518,
professional, minimalist, no text in image
Aspect: landscape 16:9
```

Obraz zapisywany do `/public/assets/images/{type}/{slug}.png`.

**Kontrakt `/api/generate/thumbnail`:**
- Sukces: `200 { url: "/assets/images/articles/slug.png" }`
- Błąd Gemini (rate limit / NSFW block / timeout): `500 { error: "generation_failed", message: "..." }` — frontend pokazuje toast z błędem, pole obrazu zostaje puste (można spróbować ponownie lub wgrać ręcznie)
- Timeout: 30s — po przekroczeniu zwraca `504`

**Manual upload — `/api/upload` (POST multipart/form-data):**
- Pola: `file` (obraz), `type` (articles/events/news), `slug`
- Akceptowane formaty: JPEG, PNG, WebP
- Limit rozmiaru: 5MB
- Zapisuje do `/public/assets/images/{type}/{slug}.{ext}`
- Zwraca: `{ url: "/assets/images/{type}/{slug}.{ext}" }`

### Scanner newsów (node-cron)

Harmonogram: `0 8 * * 1,4` (poniedziałek i czwartek, 8:00)

**Inicjalizacja cron — `instrumentation.ts`:**
Node-cron rejestrowany w `instrumentation.ts` (Next.js 16 feature, tylko po stronie serwera — `runtime === 'nodejs'`). Gwarantuje jedno-razową inicjalizację bez duplikatów przy HMR w dev.

Flow:
1. Scraper pobiera HTML ze skonfigurowanych źródeł (tabela `ScanSource` gdzie `enabled=true`)
2. Claude analizuje zebrany tekst → wyciąga 5-8 tematów jako JSON
3. Deduplicacja: pomija URLe już obecne w `NewsDraft` z ostatnich 7 dni
4. Każdy temat zapisywany jako `NewsDraft` ze statusem `"pending"`, `sourceId` linkuje do `ScanSource`
5. `ScanSource.lastScannedAt` aktualizowane po każdym skanowaniu
6. Dashboard pokazuje badge z liczbą nowych propozycji

---

## 6. Panel admina — `/app/admin/`

### Design
Port istniejącego `admin.html`: dark theme (`#0D0D0D`), yellow accent (`#F5C518`), Montserrat font, sidebar 260px.

### Struktura plików
```
app/admin/
  page.js              ← redirect do /admin/dashboard lub login
  layout.js            ← sidebar + auth check
  login/page.js
  dashboard/page.js
  events/
    page.js            ← lista eventów
    new/page.js        ← formularz
    [id]/page.js       ← edycja
  articles/
    page.js
    new/page.js
    [id]/page.js
  news/
    page.js
    new/page.js
    [id]/page.js
  drafts/page.js       ← propozycje newsów
  categories/page.js
  settings/page.js
```

### Sidebar (7 pozycji)
- Dashboard (statystyki)
- Eventy
- Artykuły
- AI News
- Propozycje *(badge z liczbą pending)*
- Kategorie
- Ustawienia

### Formularze

**Event:**
- Brand, Tytuł, Excerpt, Data, Godzina, Lokalizacja, Venue, Format, Miejsca, Darmowe (checkbox), Kolor akcentu, Link zewnętrzny, Status (upcoming/past), Obraz (AI generuj / upload)

**Artykuł:**
- Typ (Filar / Cluster), Tytuł, Slug (auto), Kategoria, Filar nadrzędny (tylko cluster), Excerpt + "Generuj Claude", Czas czytania (auto), Data, Obraz (AI generuj / upload), Edytor Markdown z live preview

**AI News:**
- Tytuł, Slug (auto), Kategoria, Źródło, Excerpt + "Generuj Claude", Tagi, Czas czytania, Obraz, Edytor Markdown

**Propozycja → artykuł (streaming flow):**
1. Kliknięcie "Generuj artykuł" → `NewsDraft.status = "generating"` → otwiera modal
2. Modal pokazuje streaming response z Claude (Server-Sent Events)
3. Po zakończeniu streamu: `News` record tworzony jako `published=false` → `NewsDraft.status = "published"` → `newsId` linkuje do nowego `News`
4. User widzi gotowy artykuł w edytorze, może edytować przed finalnym opublikowaniem (`published=true`)
5. **Failure recovery:** jeśli stream się przerwie, `NewsDraft.status` wraca do `"pending"`. Niekompletny `News` record (jeśli zdążył powstać) jest usuwany. User może spróbować ponownie.

---

## 7. Integracja z frontendem

### Zmiana źródła danych

| Strona | Przed | Po |
|--------|-------|-----|
| `/baza-wiedzy` | `lib/articles.js` → plik JSON | Prisma query w server component |
| `/artykul/[slug]` | `fs.readFileSync()` | Prisma `findUnique` |
| `/wydarzenia` | hardcoded arrays | Prisma query |
| `/ai-news` | hardcoded newsData | Prisma query |

Strony używają `dynamic = 'force-dynamic'` — renderowane server-side przy każdym żądaniu, zawsze aktualne dane bez rebuild.

Wyjątek: `/artykul/[slug]` i `/ai-news/[slug]` — ISR z `revalidate: 60`. Po zapisaniu artykułu/newsa z dashboardu API route wywołuje `revalidatePath('/artykul/' + slug)` i `revalidatePath('/baza-wiedzy')`, co gwarantuje natychmiastową aktualność bez czekania na 60s okno.

`generateStaticParams` usunięty — strony renderują dynamicznie (nie SSG).

---

## 8. Auth

- Dane admina w `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt), `JWT_SECRET`
- Login: sprawdza hash → generuje JWT (24h) → ustawia httpOnly cookie `ain_token`
- Po wygaśnięciu tokenu: `middleware.ts` zwraca 401/redirect do `/admin/login`. Brak refresh tokenu — user loguje się ponownie. Dla single-user admina to wystarczające.
- `middleware.ts` matcher:
  - Chronione: `/admin/:path*`, `/api/articles/:path*`, `/api/events/:path*`, `/api/news/:path*`, `/api/categories/:path*`, `/api/generate/:path*`, `/api/scan`, `/api/upload`
  - Publiczne (bez auth): `/api/auth/login` (POST)
  - Auth-required: `/api/auth/me` (GET), `/api/auth/logout` (POST)
- Single admin user — rozszerzenie o role w przyszłości możliwe przez dodanie tabeli `User`

**Generowanie hasha hasła (setup jednorazowy):**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TWOJE_HASLO', 10).then(h => console.log(h))"
```
Hash kopiujemy do `.env` jako `ADMIN_PASSWORD_HASH`.

---

## 9. Migracja danych

Jednorazowy skrypt `scripts/migrate-to-db.js`:
1. Czyta `public/articles.json` → wstawia artykuły i pillary do PostgreSQL
2. Wstawia hardcoded events z `app/wydarzenia/page.js`
3. Wstawia hardcoded news z `app/ai-news/page.js`
4. Tworzy domyślne kategorie

---

## 10. Kolejność implementacji

1. **Prisma setup** — schema + migracja + seed
2. **Auth API** — login/logout/me + middleware
3. **API routes** — CRUD dla wszystkich modeli
4. **Migracja danych** — skrypt migrate-to-db.js
5. **Frontend refactor** — zamiana lib/articles.js + hardcoded data na Prisma
6. **Admin UI** — layout + login + Dashboard
7. **Admin formularze** — Events → Articles → News → Categories → Settings
8. **Agent Claude** — excerpt/tagi + pełny artykuł
9. **Agent Gemini** — thumbnail generation
10. **Scanner newsów** — scraper + node-cron + zakładka Propozycje
11. **Docker Compose** — Dockerfile + compose + deploy na VPS

---

## 11. Zmienne środowiskowe (`.env`)

```env
# Database
DATABASE_URL="postgresql://ainetwork:password@db:5432/ainetwork"

# Auth
ADMIN_EMAIL="admin@ainetwork.pl"
ADMIN_PASSWORD_HASH="$2b$10$..."   # bcrypt hash
JWT_SECRET="long-random-secret"

# AI APIs
ANTHROPIC_API_KEY="sk-ant-..."
GEMINI_API_KEY="AIza..."

# App
NEXT_PUBLIC_BASE_URL="https://ainetwork.pl"
```
