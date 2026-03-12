# AI NETWORK CMS — Dokumentacja techniczna

## Spis treści

1. [Architektura systemu](#architektura-systemu)
2. [Stack technologiczny](#stack-technologiczny)
3. [Baza danych — modele](#baza-danych--modele)
4. [Autoryzacja i bezpieczeństwo](#autoryzacja-i-bezpieczeństwo)
5. [Panel administracyjny](#panel-administracyjny)
6. [API — endpointy](#api--endpointy)
7. [Agenci AI](#agenci-ai)
8. [Skaner wiadomości](#skaner-wiadomości)
9. [Frontend — strony publiczne](#frontend--strony-publiczne)
10. [Pliki i struktura projektu](#pliki-i-struktura-projektu)
11. [Docker i deployment](#docker-i-deployment)
12. [Zmienne środowiskowe](#zmienne-środowiskowe)

---

## Architektura systemu

```
Przeglądarka (admin)           Przeglądarka (użytkownik)
       │                              │
       ▼                              ▼
┌─────────────────────────────────────────────┐
│          Next.js 16 App Router              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ /admin/* │  │ /api/*   │  │ Frontend  │ │
│  │ (client) │  │ (routes) │  │ (server)  │ │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘ │
│       │              │              │       │
│       ▼              ▼              ▼       │
│  ┌─────────────────────────────────────┐    │
│  │         Prisma 7 + PrismaPg        │    │
│  └──────────────┬──────────────────────┘    │
│                 │                           │
│  ┌──────────────┼──────────────────────┐    │
│  │  Claude API  │  Gemini API          │    │
│  │  (content)   │  (thumbnails)        │    │
│  └──────────────┴──────────────────────┘    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  PostgreSQL 16 │
         └────────────────┘
```

**Przepływ danych:**
- Admin tworzy/edytuje treść w `/admin` → API zapisuje do PostgreSQL → Frontend odczytuje server-side
- Skaner automatycznie skanuje źródła → tworzy drafty → admin zatwierdza → Claude generuje artykuł
- Gemini generuje thumbnails kontekstowo (na podstawie tytułu, opisu, kategorii)

---

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---------|------------|--------|
| Framework | Next.js (App Router) | 16.1.6 |
| Baza danych | PostgreSQL | 16 (Alpine) |
| ORM | Prisma + PrismaPg adapter | 7.x |
| Autoryzacja | JWT (jsonwebtoken) + bcryptjs | httpOnly cookies |
| AI — treść | Claude API (Anthropic SDK) | claude-sonnet-4-6 |
| AI — grafiki | Gemini API (REST) | gemini-2.0-flash-exp |
| Scraping | Cheerio | HTML parsing |
| Cron | node-cron | via instrumentation.ts |
| Konteneryzacja | Docker Compose | Multi-stage build |

---

## Baza danych — modele

### Article
Artykuły bazy wiedzy — filary i klastry.

| Pole | Typ | Opis |
|------|-----|------|
| `id` | String (cuid) | Klucz główny |
| `slug` | String (unique) | URL-friendly identyfikator |
| `type` | String | `"pillar"` lub `"cluster"` |
| `title` | String | Tytuł artykułu |
| `content` | String | Treść w Markdown |
| `excerpt` | String | Krótki opis (2-3 zdania) |
| `readingTime` | String | Czas czytania, np. `"10 min"` |
| `date` | DateTime | Data publikacji |
| `imageUrl` | String? | Ścieżka do thumbnails |
| `published` | Boolean | Status publikacji |
| `categoryId` | String | FK → Category |
| `pillarId` | String? | FK → Article (self-relation, dla klastrów) |

**Relacje:** `category` → Category, `pillar` → Article (opcjonalne), `clusters` → Article[] (dla filarów)

### Event
Wydarzenia AI NETWORK.

| Pole | Typ | Opis |
|------|-----|------|
| `slug` | String (unique) | Identyfikator URL |
| `brand` | String | Marka wydarzenia |
| `title` | String | Tytuł |
| `excerpt` | String | Opis |
| `date` | DateTime | Data wydarzenia |
| `time` | String | Godziny, np. `"17:00–20:00"` |
| `location` | String | Miasto |
| `venue` | String | Miejsce |
| `format` | String | Typ wydarzenia |
| `seats` | String | Liczba miejsc |
| `free` | Boolean | Czy bezpłatne |
| `accent` | String | Kolor akcentu (hex) |
| `imageUrl` | String? | Obraz wydarzenia |
| `status` | String | `"upcoming"` lub `"past"` |
| `href` | String? | Link do rejestracji |

### News
Wiadomości AI.

| Pole | Typ | Opis |
|------|-----|------|
| `slug` | String (unique) | Identyfikator URL |
| `title` | String | Tytuł |
| `content` | String | Treść Markdown |
| `excerpt` | String | Podsumowanie |
| `source` | String? | Źródło wiadomości |
| `tags` | String[] | Tagi |
| `imageUrl` | String? | Obraz |
| `published` | Boolean | Opublikowany? |
| `readingTime` | String | Czas czytania |
| `categoryId` | String | FK → Category |

### NewsDraft
Drafty z automatycznego skanowania.

| Pole | Typ | Opis |
|------|-----|------|
| `title` | String | Tytuł tematu |
| `summary` | String | 2-3 zdania podsumowania |
| `sourceUrl` | String | URL źródłowy |
| `sourceName` | String | Nazwa źródła |
| `rawContent` | String | Surowa treść strony |
| `tags` | String[] | Tagi |
| `status` | String | `"pending"` / `"generating"` / `"published"` / `"rejected"` |
| `sourceId` | String? | FK → ScanSource |
| `newsId` | String? | FK → News (po wygenerowaniu) |

### Category
Kategorie dla artykułów i newsów.

| Pole | Typ | Opis |
|------|-----|------|
| `key` | String (unique) | Klucz, np. `"content-marketing"` |
| `label` | String | Wyświetlana nazwa |
| `color` | String | Kolor hex |
| `type` | String | `"article"` lub `"news"` |

### ScanSource
Źródła do automatycznego skanowania newsów.

| Pole | Typ | Opis |
|------|-----|------|
| `url` | String (unique) | URL strony |
| `name` | String | Nazwa źródła |
| `enabled` | Boolean | Aktywne? |
| `lastScannedAt` | DateTime? | Ostatnie skanowanie |

---

## Autoryzacja i bezpieczeństwo

### Mechanizm

1. **Login** (`POST /api/auth/login`): email + hasło → bcrypt compare → JWT token w httpOnly cookie (`ain_token`, 24h)
2. **Proxy** (`proxy.ts`): przechwytuje requesty do `/admin/*` i `/api/*` → weryfikuje JWT → przekierowuje do logowania lub zwraca 401
3. **Logout** (`POST /api/auth/logout`): kasuje cookie

### Chronione ścieżki

- `/admin/(wszystko poza /login)` — przekierowanie do `/admin/login`
- `/api/articles`, `/api/events`, `/api/news`, `/api/categories` — 401
- `/api/generate/*`, `/api/scan*`, `/api/upload` — 401
- `/api/auth/me`, `/api/auth/logout` — 401

### Publiczne endpointy

- `/api/auth/login` — logowanie
- Wszystkie strony frontendowe (`/baza-wiedzy`, `/artykul/*`, `/wydarzenia`, `/ai-news`)

### Konfiguracja admina

Admin jest zdefiniowany w `.env`:
```env
ADMIN_EMAIL="admin@ainetwork.pl"
ADMIN_PASSWORD_HASH="$2b$10$..."  # bcrypt hash
JWT_SECRET="min-32-characters-long-string"
```

Generowanie hasha hasła:
```bash
node scripts/hash-password.js mojehaslo
```

---

## Panel administracyjny

### Dostęp

URL: `http://localhost:3000/admin` (dev) lub `https://domena/admin` (prod)

### Strony

| Ścieżka | Opis |
|----------|------|
| `/admin/login` | Logowanie |
| `/admin/dashboard` | Dashboard — statystyki, ostatnie artykuły |
| `/admin/articles` | Lista artykułów (filary + klastry) |
| `/admin/articles/new` | Nowy artykuł |
| `/admin/articles/[id]` | Edycja artykułu |
| `/admin/events` | Lista wydarzeń |
| `/admin/events/new` | Nowe wydarzenie |
| `/admin/events/[id]` | Edycja wydarzenia |
| `/admin/news` | Lista wiadomości AI |
| `/admin/news/new` | Nowa wiadomość |
| `/admin/news/[id]` | Edycja wiadomości |
| `/admin/categories` | Zarządzanie kategoriami (artykuły + news) |
| `/admin/drafts` | Drafty z automatycznego skanowania |
| `/admin/settings` | Ustawienia skanera, źródła, info o API |

### Styl

- Ciemny motyw: `#0D0D0D` tło, `#F5C518` akcent żółty
- Font: Montserrat (dziedziczony z layoutu)
- Sidebar z ikonami SVG (bez emoji)
- Responsywne formularze

### Komponenty

| Komponent | Ścieżka | Funkcja |
|-----------|---------|---------|
| `AdminSidebar` | `components/admin/AdminSidebar.js` | Nawigacja boczna z badge'em draftów |
| `MarkdownEditor` | `components/admin/MarkdownEditor.js` | Edytor z toolbarem i podglądem |
| `ImagePicker` | `components/admin/ImagePicker.js` | Generowanie AI + upload + usuwanie obrazów |

---

## API — endpointy

### Autoryzacja

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/api/auth/login` | Logowanie (email + password) → cookie |
| POST | `/api/auth/logout` | Wylogowanie |
| GET | `/api/auth/me` | Info o zalogowanym użytkowniku |

### Artykuły

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/articles` | Lista (filtry: `?type=pillar`, `?published=true`) |
| POST | `/api/articles` | Tworzenie artykułu |
| GET | `/api/articles/[id]` | Szczegóły artykułu |
| PUT | `/api/articles/[id]` | Aktualizacja |
| DELETE | `/api/articles/[id]` | Usunięcie |

### Wydarzenia

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/events` | Lista wydarzeń |
| POST | `/api/events` | Tworzenie |
| GET | `/api/events/[id]` | Szczegóły |
| PUT | `/api/events/[id]` | Aktualizacja |
| DELETE | `/api/events/[id]` | Usunięcie |

### Wiadomości

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/news` | Lista newsów |
| POST | `/api/news` | Tworzenie |
| GET | `/api/news/[id]` | Szczegóły |
| PUT | `/api/news/[id]` | Aktualizacja |
| DELETE | `/api/news/[id]` | Usunięcie |
| GET | `/api/news/drafts` | Lista draftów (status=pending) |
| POST | `/api/news/drafts/[id]/generate` | Generowanie artykułu z drafta (SSE stream) |
| POST | `/api/news/drafts/[id]/reject` | Odrzucenie drafta |

### Kategorie

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/categories` | Lista (filtr: `?type=article` / `?type=news`) |
| POST | `/api/categories` | Tworzenie |
| DELETE | `/api/categories` | Usunięcie (body: `{ id }`) |

### Generowanie AI

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/api/generate/content` | Claude: excerpt + readingTime z treści |
| POST | `/api/generate/thumbnail` | Gemini: kontekstowy thumbnail |

### Upload i skanowanie

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/api/upload` | Upload pliku (multipart form) |
| POST | `/api/scan` | Ręczne uruchomienie skanera |
| GET | `/api/scan-sources` | Lista źródeł |
| POST | `/api/scan-sources` | Dodanie źródła |
| DELETE | `/api/scan-sources` | Usunięcie źródła |

---

## Agenci AI

### Content Agent (`lib/agents/content-agent.js`)

**Model:** Claude claude-sonnet-4-6 (Anthropic SDK)

Dwie funkcje:

#### `generateMeta({ title, content })`
- Input: tytuł + treść artykułu
- Output: `{ excerpt, readingTime }` (JSON)
- Użycie: przycisk "Generuj AI" w formularzu artykułu → auto-uzupełnia opis i czas czytania

#### `generateFullArticle({ title, rawContent, onChunk })`
- Input: tytuł + surowy research + callback na chunk
- Output: pełny artykuł Markdown (streamowany)
- Użycie: generowanie artykułu z drafta skanera → SSE stream do przeglądarki

### Thumbnail Agent (`lib/agents/thumbnail-agent.js`)

**Model:** Gemini 2.0 Flash Exp (REST API)

#### `generateThumbnail({ title, slug, type, excerpt, category, isPillar })`

Inteligentny prompt builder — grafika jest dopasowana do:

| Parametr | Wpływ na prompt |
|----------|----------------|
| `title` | Główny temat ilustracji |
| `excerpt` | Kontekst treści (max 200 znaków) |
| `category` | Wizualny motyw + paleta kolorów (patrz tabela) |
| `type` | Typ ilustracji (artykuł/event/news) |
| `isPillar` | Bardziej monumentalna, architektoniczna grafika |

**Mapy wizualne kategorii:**

| Kategoria | Motyw | Paleta |
|-----------|-------|--------|
| `content-marketing` | Strumienie tekstu, elementy edytorskie | Niebieski (#5B8DEF) + złoty |
| `strategia-ai` | Szachy, ścieżki, mapy strategiczne | Złoty (#F5C518) dominujący |
| `narzedzia-modele` | Dashboardy AI, węzły sieci | Zielony (#2ECC71) + złoty |

**Mapy wizualne typów:**

| Typ | Motyw |
|-----|-------|
| `articles` | Edukacyjna ilustracja tech |
| `events` | Scena konferencyjna, networking |
| `news` | Feedy danych, pulsy informacyjne |

**Styl bazowy (zawsze):** ciemne tło #0D0D0D, złoty akcent #F5C518, minimalistyczny, geometryczny, format 16:9, bez tekstu na grafice.

---

## Skaner wiadomości

### Jak działa

1. **Cron** (`instrumentation.ts`): uruchamia `runScan()` w poniedziałki i czwartki o 8:00
2. **Pobieranie** (`lib/scanner.js`): fetch HTML z każdego aktywnego `ScanSource`
3. **Ekstrakcja** (Cheerio): wyciąga tekst z `<article>`, `<main>`, `.content`
4. **Analiza AI** (Claude): wyciąga 3-5 tematów po polsku z perspektywy biznesowej
5. **Deduplikacja**: sprawdza `sourceUrl` w ostatnich 7 dniach
6. **Zapis**: tworzy `NewsDraft` ze statusem `"pending"`

### Workflow redakcyjny

```
Skaner → Draft (pending) → Admin przegląda w /admin/drafts
                             │
                    ┌────────┼────────┐
                    ▼                 ▼
              "Generuj artykuł"  "Odrzuć"
              (SSE streaming)     (status → rejected)
                    │
                    ▼
              Podgląd w modalu
                    │
                    ▼
              "Zatwierdź i opublikuj"
              (tworzy News, status → published)
```

### Konfiguracja źródeł

W `/admin/settings` → dodawanie/usuwanie URL-i:
- Przykład: `https://techcrunch.com/category/artificial-intelligence/`
- Każde źródło ma: URL, nazwę, status (aktywne/wyłączone)
- Można też ręcznie uruchomić skan przyciskiem "Skanuj teraz"

---

## Frontend — strony publiczne

Wszystkie strony publiczne to server components czytające z PostgreSQL przez Prisma.

| Ścieżka | Plik | Rendering | Opis |
|----------|------|-----------|------|
| `/baza-wiedzy` | `app/baza-wiedzy/page.js` | `force-dynamic` | Lista artykułów (filary + klastry) |
| `/artykul/[slug]` | `app/artykul/[slug]/page.js` | `revalidate = 60` | Pojedynczy artykuł |
| `/wydarzenia` | `app/wydarzenia/page.js` | `force-dynamic` | Lista wydarzeń |
| `/ai-news` | `app/ai-news/page.js` | `force-dynamic` | Lista wiadomości AI |
| `/ai-news/[slug]` | `app/ai-news/[slug]/page.js` | `revalidate = 60` | Pojedyncza wiadomość |

**Wzorzec:** Server component (async, Prisma query) → przekazuje dane do Client component (animacje, interaktywność).

**Cache:**
- Strony listowe: `force-dynamic` — zawsze świeże
- Strony szczegółowe: `revalidate = 60` — cache 60s, odświeżane przez `revalidatePath()` po edycji w adminie

---

## Pliki i struktura projektu

```
ainetwork-web/
├── app/
│   ├── admin/                   # Panel CMS
│   │   ├── layout.js            # Layout z sidebar
│   │   ├── page.js              # Redirect → /admin/dashboard
│   │   ├── login/page.js        # Logowanie
│   │   ├── dashboard/page.js    # Dashboard ze statystykami
│   │   ├── articles/            # CRUD artykułów
│   │   │   ├── page.js          # Lista
│   │   │   ├── new/page.js      # Nowy
│   │   │   └── [id]/page.js     # Edycja
│   │   ├── events/              # CRUD wydarzeń
│   │   ├── news/                # CRUD newsów
│   │   ├── categories/page.js   # Kategorie
│   │   ├── drafts/page.js       # Drafty skanera
│   │   └── settings/page.js     # Ustawienia
│   ├── api/                     # REST API
│   │   ├── auth/                # Login/logout/me
│   │   ├── articles/            # Articles CRUD
│   │   ├── events/              # Events CRUD
│   │   ├── news/                # News CRUD + drafts
│   │   ├── categories/          # Categories
│   │   ├── generate/            # AI generation
│   │   ├── upload/              # File upload
│   │   ├── scan/                # Manual scan trigger
│   │   └── scan-sources/        # Scan sources CRUD
│   ├── baza-wiedzy/             # Frontend: knowledge base
│   ├── artykul/[slug]/          # Frontend: article detail
│   ├── wydarzenia/              # Frontend: events
│   └── ai-news/                 # Frontend: AI news
├── components/
│   └── admin/                   # Reusable admin components
│       ├── AdminSidebar.js
│       ├── MarkdownEditor.js
│       └── ImagePicker.js
├── lib/
│   ├── prisma.js                # Prisma singleton (PrismaPg adapter)
│   ├── auth.js                  # JWT + bcrypt helpers
│   ├── articles.js              # Article query helpers
│   ├── scanner.js               # News scanner (Cheerio + Claude)
│   └── agents/
│       ├── content-agent.js     # Claude: meta + full articles
│       └── thumbnail-agent.js   # Gemini: contextual thumbnails
├── prisma/
│   └── schema.prisma            # 6 models
├── scripts/
│   ├── deploy.sh                # Deploy script
│   ├── hash-password.js         # Generowanie bcrypt hash
│   ├── migrate-to-db.js         # Migracja danych z JSON → DB
│   └── generate-news.js         # Test script newsów
├── proxy.ts                     # Auth middleware (JWT verification)
├── instrumentation.ts           # node-cron news scanner schedule
├── next.config.mjs              # Next.js config (standalone, Prisma)
├── docker-compose.yml           # Produkcja (app + db)
├── docker-compose.dev.yml       # Dev (tylko db)
├── Dockerfile                   # Multi-stage build
└── .env                         # Zmienne środowiskowe
```

---

## Docker i deployment

### Lokalne devlopment

```bash
# 1. Uruchom bazę danych
docker compose -f docker-compose.dev.yml up -d

# 2. Migracja schematu
npx prisma migrate dev

# 3. (Opcjonalnie) Seed danych
node scripts/migrate-to-db.js

# 4. Dev server
npm run dev
```

### Produkcja (Docker Compose)

```bash
# docker-compose.yml uruchamia:
# - app (Next.js standalone, port 3001:3000)
# - db (PostgreSQL 16 Alpine, healthcheck)

docker compose up -d --build
```

### Deploy na VPS

```bash
./scripts/deploy.sh
# → git pull → docker build → prisma migrate → docker up
```

### Porty

| Serwis | Port wewnętrzny | Port zewnętrzny |
|--------|-----------------|-----------------|
| Next.js | 3000 | 3001 |
| PostgreSQL (dev) | 5432 | 5437 |
| PostgreSQL (prod) | 5432 | (wewnętrzny) |

---

## Zmienne środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `ADMIN_EMAIL` | Email admina | `admin@ainetwork.pl` |
| `ADMIN_PASSWORD_HASH` | bcrypt hash hasła | `$2b$10$...` |
| `JWT_SECRET` | Klucz do podpisu JWT (min 32 znaki) | `your-secret-key-min-32-chars` |
| `ANTHROPIC_API_KEY` | Klucz API Anthropic (Claude) | `sk-ant-api03-...` |
| `GEMINI_API_KEY` | Klucz API Google (Gemini) | `AIzaSy...` |
| `NEXT_PUBLIC_BASE_URL` | Bazowy URL aplikacji | `http://localhost:3001` |
