# AI NETWORK CMS — Instrukcja obsługi

Praktyczny przewodnik po codziennej obsłudze panelu administracyjnego.

---

## Pierwsze uruchomienie

### 1. Przygotowanie hasła admina

```bash
node scripts/hash-password.js TwojeHaslo123
```

Skopiuj wynikowy hash i wklej do `.env`:
```env
ADMIN_PASSWORD_HASH="$2b$10$wygenerowany_hash"
```

### 2. Start bazy danych

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 3. Migracja schematu

```bash
npx prisma migrate dev
```

### 4. (Opcjonalnie) Import istniejących danych

```bash
node scripts/migrate-to-db.js
```

Importuje artykuły z `public/articles.json` oraz hardcoded wydarzenia do bazy PostgreSQL.

### 5. Start aplikacji

```bash
npm run dev
```

Aplikacja: `http://localhost:3000`
Panel CMS: `http://localhost:3000/admin`

---

## Logowanie

1. Wejdź na `/admin`
2. Podaj email i hasło z `.env`
3. Po zalogowaniu jesteś przekierowany na dashboard

Sesja trwa 24 godziny. Po tym czasie musisz zalogować się ponownie.

---

## Dashboard

Po zalogowaniu widzisz:

- **Statystyki** — liczba artykułów, wydarzeń, newsów, oczekujących draftów
- **Ostatnie artykuły** — 5 najnowszych z datą i statusem

---

## Zarządzanie artykułami

### Typy artykułów

- **Filar (pillar)** — główny artykuł tematyczny, np. "Kompletny przewodnik po AI w marketingu"
- **Klaster (cluster)** — artykuł powiązany z filarem, np. "5 narzędzi AI do copywritingu"

### Tworzenie artykułu

1. Sidebar → **Artykuły** → przycisk **Nowy artykuł**
2. Wypełnij formularz:
   - **Typ**: Filar lub Klaster
   - **Tytuł**: slug generowany automatycznie
   - **Kategoria**: wybierz z listy
   - **Filar nadrzędny**: (tylko dla klastrów) wybierz powiązany filar
   - **Treść**: edytor Markdown z podglądem
3. Opcjonalnie kliknij **Generuj AI** przy opisie → Claude wygeneruje excerpt i czas czytania
4. Opcjonalnie kliknij **Generuj AI** przy obrazku → Gemini wygeneruje thumbnail dopasowany do treści
5. Kliknij **Zapisz jako szkic** lub **Opublikuj**

### Edycja artykułu

1. Sidebar → **Artykuły** → kliknij artykuł na liście
2. Edytuj dowolne pole
3. Zapisz

### Publikowanie

- Artykuł ze statusem "szkic" nie jest widoczny na stronie
- Przycisk "Opublikuj" zmienia status i artykuł pojawia się na `/baza-wiedzy`
- Zmiana widoczna natychmiast (strony listowe) lub w ciągu 60 sekund (strony artykułów)

---

## Zarządzanie wydarzeniami

### Tworzenie wydarzenia

1. Sidebar → **Wydarzenia** → **Nowe wydarzenie**
2. Wypełnij:
   - **Brand**: np. "AI NETWORK", "AI Breakfast"
   - **Tytuł, opis, data, godziny**
   - **Lokalizacja**: miasto i miejsce
   - **Format**: Konferencja, Workshop, Meetup...
   - **Status**: upcoming lub past
   - **Kolor akcentu**: hex, np. `#F5C518`
   - **Link rejestracji**: URL
3. Generuj thumbnail AI lub wgraj plik
4. Zapisz

### Na stronie

Wydarzenia pojawiają się na `/wydarzenia`. Nadchodzące (upcoming) są wyróżnione.

---

## Zarządzanie wiadomościami AI

### Ręczne tworzenie

1. Sidebar → **Wiadomości** → **Nowa wiadomość**
2. Wypełnij tytuł, excerpt, treść Markdown, tagi, źródło
3. Generuj AI thumbnail
4. Opublikuj

### Automatyczny skaner (zalecany workflow)

1. Najpierw skonfiguruj źródła w **Ustawienia** (patrz sekcja niżej)
2. Skaner działa automatycznie w poniedziałki i czwartki o 8:00
3. Sprawdź nowe drafty: Sidebar → **Drafty**

### Obsługa draftów

W widoku draftów widzisz listę tematów wykrytych przez AI ze źródeł.

Dla każdego drafta masz dwie opcje:

#### Generuj artykuł
1. Kliknij **Generuj** → otwiera się modal
2. Claude streamuje artykuł w czasie rzeczywistym (widzisz tekst przyrastający)
3. Po wygenerowaniu przeczytaj podgląd
4. Kliknij **Zatwierdź i opublikuj** → artykuł trafia na `/ai-news`

#### Odrzuć
- Kliknij **Odrzuć** → draft zmienia status na "rejected" i znika z listy

---

## Kategorie

Sidebar → **Kategorie**

Dwie kolumny:
- **Kategorie artykułów** — używane w baza-wiedzy
- **Kategorie newsów** — używane w ai-news

Każda kategoria ma:
- **Klucz** (slug) — np. `content-marketing`
- **Nazwa** — np. "Content Marketing"
- **Kolor** — hex, np. `#5B8DEF`

Domyślne kategorie artykułów:
| Klucz | Nazwa | Kolor |
|-------|-------|-------|
| `content-marketing` | Content Marketing | `#5B8DEF` |
| `strategia-ai` | Strategia AI | `#F5C518` |
| `narzedzia-modele` | Narzędzia i Modele | `#2ECC71` |

---

## Ustawienia skanera

Sidebar → **Ustawienia**

### Źródła skanowania

Dodawaj strony, z których skaner wyciąga tematy newsowe:
1. Podaj URL strony (np. główna strona bloga, strona kategorii)
2. Podaj nazwę źródła
3. Kliknij **Dodaj**

Skaner automatycznie:
- Pobiera HTML
- Wyciąga tekst artykułów
- Pyta Claude o 3-5 najciekawszych tematów dla polskiego przedsiębiorcy
- Tworzy drafty do przeglądu

### Ręczne uruchomienie

Przycisk **Skanuj teraz** → natychmiastowe uruchomienie skanowania.

### Harmonogram

Automatycznie: poniedziałki i czwartki o 8:00 rano (node-cron).

---

## Generowanie obrazów AI

System generuje thumbnails kontekstowo — prompt jest budowany na podstawie:

| Co wpływa | Jak |
|-----------|-----|
| Tytuł | Główny temat ilustracji |
| Opis/excerpt | Kontekst treści artykułu |
| Kategoria | Motyw wizualny i paleta kolorów |
| Typ (artykuł/event/news) | Styl ilustracji |
| Filar wiedzy | Bardziej monumentalna grafika |

Wszystkie grafiki mają spójny styl: ciemne tło (#0D0D0D), złoty akcent (#F5C518), minimalistyczne, geometryczne kształty, format krajobrazowy.

Alternatywnie możesz wgrać własny plik (JPG, PNG, WebP).

---

## Generowanie treści AI

Przycisk **Generuj AI** przy opisie artykułu:
- Claude analizuje tytuł i treść
- Generuje zwięzły excerpt (2-3 zdania)
- Szacuje czas czytania

Przydatne gdy masz treść ale nie chcesz ręcznie pisać opisu.

---

## Edytor Markdown

Edytor w formularzach artykułów i newsów ma:

- **Toolbar**: nagłówki (H2, H3), bold, italic, lista, link, kod, cytat
- **Zakładki**: Edycja / Podgląd
- **Podgląd**: renderuje Markdown w czasie rzeczywistym

Wspierane elementy:
- Nagłówki `## H2`, `### H3`
- **Bold**, *italic*
- Listy (numerowane i punktowane)
- Linki `[tekst](url)`
- Kod inline i bloki kodu
- Cytaty `> tekst`
- Tabele
- Separatory `---`

---

## FAQ

### Artykuł nie pojawia się na stronie
- Sprawdź czy jest opublikowany (nie szkic)
- Strony listowe odświeżają się natychmiast
- Strony artykułów cache'ują się na 60 sekund

### Generowanie obrazu nie działa
- Sprawdź `GEMINI_API_KEY` w `.env`
- Upewnij się, że tytuł (slug) jest uzupełniony
- Sprawdź logi serwera: `npm run dev` w terminalu

### Generowanie treści nie działa
- Sprawdź `ANTHROPIC_API_KEY` w `.env`
- Upewnij się, że tytuł i treść artykułu są wypełnione

### Skaner nie tworzy draftów
- Sprawdź czy masz aktywne źródła w **Ustawienia**
- Spróbuj **Skanuj teraz** ręcznie
- Sprawdź logi: `[Scanner]` w konsoli

### Zapomniałem hasła
Wygeneruj nowy hash i podmień w `.env`:
```bash
node scripts/hash-password.js NoweHaslo123
```
Restart aplikacji po zmianie `.env`.

---

## Skróty i wskazówki

- Slug artykułu generuje się automatycznie z tytułu (polskie znaki → ASCII)
- Obrazy są zapisywane w `public/assets/images/{typ}/{slug}.png`
- Usunięcie kategorii nie kasuje powiązanych artykułów/newsów
- Drafty starsze niż 7 dni z tego samego URL nie są duplikowane
- Format daty w wydarzeniach: ISO (YYYY-MM-DD), wyświetlany po polsku
