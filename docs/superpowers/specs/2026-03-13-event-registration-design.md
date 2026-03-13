# Event Registration Module — Design Spec

## Goal

Add event registration with PDF tickets, QR check-in, seat limits, and admin CRM to the AI NETWORK Next.js site. Email notifications are prepared but disabled until SMTP credentials are provided.

## Current State

- **Event model** exists with basic fields (title, date, location, seats as String)
- **Admin CRUD** for events works (create, edit, delete)
- **Public listing** at `/wydarzenia` with "Zarejestruj się" button (currently links to external href or nowhere)
- **No registration, attendee tracking, or ticket system exists**

## Architecture

### Stack

- Prisma ORM (PostgreSQL) for data
- Next.js API routes for endpoints
- `jspdf` + `qrcode` for PDF ticket generation (server-side)
- `nodemailer` for email (disabled until SMTP configured)
- Existing proxy.ts for auth protection

### New Files

```
prisma/schema.prisma              — add Registration model, update Event
app/api/register/[eventId]/route.js      — POST registration (public, outside /api/events/ to bypass proxy)
app/api/tickets/[code]/route.js          — GET PDF ticket (public)
app/api/registrations/[code]/checkin/route.js — POST check-in (protected)
app/wydarzenia/[slug]/rejestracja/page.js    — public registration form
app/wydarzenia/[slug]/rejestracja/RegistrationForm.js — client form component
app/wydarzenia/[slug]/rejestracja/sukces/page.js — success page with ticket download
app/check-in/[code]/page.js             — QR scan landing (protected by proxy)
app/check-in/[code]/CheckInClient.js     — client check-in component
app/admin/events/[id]/registrations/page.js — admin CRM list
app/admin/events/[id]/registrations/RegistrationsClient.js — client CRM component
lib/email.js                             — nodemailer setup (disabled by default)
lib/ticket.js                            — PDF generation logic
```

---

## 1. Database Schema

### Event model changes

```prisma
model Event {
  id               String         @id @default(cuid())
  slug             String         @unique
  brand            String
  title            String
  excerpt          String
  date             DateTime
  time             String
  location         String
  venue            String
  format           String
  maxSeats         Int?           // null = unlimited, replaces old "seats" String
  free             Boolean        @default(true)
  accent           String
  imageUrl         String?
  status           String         // "upcoming" | "past"
  href             String?
  registrationOpen Boolean        @default(true)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  registrations    Registration[]
}
```

**Migration note:** `seats` (String?) removed, replaced by `maxSeats` (Int?). Existing events with seats like "Darmowe" or "120" need manual migration — set maxSeats to parsed int or null.

### New Registration model

```prisma
model Registration {
  id          String    @id @default(cuid())
  eventId     String
  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  firstName   String
  lastName    String
  email       String
  company     String?
  phone       String?
  ticketCode  String    @unique  // format: "XXXXX" (5 uppercase alphanumeric chars)
  checkedIn   Boolean   @default(false)
  checkedInAt DateTime?
  createdAt   DateTime  @default(now())

  @@unique([eventId, email])  // one registration per email per event
  @@index([eventId])
}
```

### Ticket Code Generation

- Format: 5 uppercase alphanumeric characters (A-Z, 0-9), e.g. "K8M2X"
- Generated using `crypto.randomBytes` mapped to charset
- 36^5 = ~60M combinations — sufficient for event scale
- On unique constraint violation (collision): retry up to 3 times with new random code
- No slug prefix — keeps codes short and scannable

---

## 2. Public Registration Flow

### Step 1: Registration Form

**Route:** `/wydarzenia/[slug]/rejestracja`

- Server component loads event by slug
- Guards: event must exist, `registrationOpen === true`, AND `event.date > now()` (regardless of status field)
- Shows seat availability: "X z Y miejsc zajętych" or "Rejestracja otwarta" (when maxSeats is null)
- If full or closed or past: shows message, no form
- Client form fields: imię (required), nazwisko (required), email (required), firma, telefon
- Submit → POST `/api/register/[eventId]`

### Step 2: API — Register

**Route:** `POST /api/register/[eventId]`

- **Public endpoint** — placed at `/api/register/` (NOT under `/api/events/`) to avoid proxy JWT requirement
- Validates required fields (firstName, lastName, email), email format via regex
- Checks: event exists, `registrationOpen === true`, `event.date > now()`
- **Atomic seat check**: uses Prisma `$transaction` with serializable isolation to count registrations and insert in one atomic operation, preventing race conditions / overbooking
- Checks: email not already registered for this event (caught by @@unique constraint)
- Generates ticketCode with collision retry (up to 3 attempts)
- Creates Registration record
- Calls `sendRegistrationConfirmation()` (no-op if SMTP not configured)
- Returns: `{ ok: true, ticketCode: "K8M2X" }`
- Error responses: 400 (validation), 409 (duplicate email), 410 (event full/closed/past)

### Step 3: Success Page

**Route:** `/wydarzenia/[slug]/rejestracja/sukces?code=K8M2X`

- Shows confirmation message with event details
- "Pobierz bilet (PDF)" button → downloads from `/api/tickets/[code]`
- Info: "Pokaż QR kod z biletu przy wejściu na wydarzenie"

---

## 3. PDF Ticket

**Route:** `GET /api/tickets/[code]`

- Public endpoint (anyone with ticket code can download — security through code obscurity)
- Looks up Registration + Event by ticketCode
- Generates PDF (A4 portrait) containing:
  - AI NETWORK branding (yellow accent on dark background)
  - Event: title, date, time, location, venue
  - Attendee: firstName lastName, company
  - Ticket code in large text
  - QR code encoding URL: `{NEXT_PUBLIC_BASE_URL}/check-in/{ticketCode}`
- Returns PDF with `Content-Type: application/pdf`, `Content-Disposition: attachment`
- Uses `jspdf` for PDF generation, `qrcode` (toDataURL) for QR

**Note:** Uses `NEXT_PUBLIC_BASE_URL` from .env (already exists: `http://localhost:3000` in dev).

---

## 4. Check-in (QR Scan)

**Route:** `/check-in/[code]`

- **Protected by proxy** — added to proxy matcher, requires JWT login
- Organizer scans QR from attendee's ticket with phone, must be logged in
- If not logged in: redirected to `/admin/login` (proxy handles this)
- Page shows: attendee name, event name, registration status
- If not checked in: green "Potwierdź obecność" button
- If already checked in: shows "Już zarejestrowany" with timestamp
- Button calls: POST `/api/registrations/[code]/checkin`

**API:** `POST /api/registrations/[code]/checkin`

- Protected by proxy (requires JWT — organizer must be logged in)
- Sets `checkedIn: true`, `checkedInAt: now()`
- Returns updated registration

**Proxy matcher additions:**
```
'/check-in/:path*',
'/api/registrations/:path*',
```

---

## 5. Admin CRM

### Registrations List

**Route:** `/admin/events/[id]/registrations`

- Table: imię, nazwisko, email, firma, telefon, data zapisu, check-in status
- Header: event title, seat counter ("15 / 50 miejsc" or "15 zapisanych" when unlimited)
- Toggle: "Rejestracja otwarta/zamknięta" switch
- Actions per row: manual check-in button, delete registration
- **Export CSV**: generated client-side from loaded data (no separate endpoint needed — all registrations are fetched for the table already). Uses `Blob` + `URL.createObjectURL` to trigger download
- Link from admin events list page (each event row gets "Zapisy" link with count badge)

### Admin Event Form Updates

- Replace "seats" text field with "maxSeats" number input (empty = bez limitu)
- Add "registrationOpen" toggle checkbox
- Show registration count on event edit page

---

## 6. Email (Prepared, Disabled)

### Setup

```
lib/email.js:
  - nodemailer transporter configured from env vars
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
  - sendRegistrationConfirmation(registration, event) function
  - If SMTP_HOST not set → logs "Email skipped — SMTP not configured" and returns silently
```

### Email Content (when enabled)

- From: kontakt@ainetwork.pl
- Subject: "Potwierdzenie rejestracji — {event.title}"
- Body: event details, attendee name, ticket download link
- No HTML template needed initially — plain text is fine

---

## 7. Security

- Registration endpoint (`/api/register/[eventId]`): **public**, placed outside `/api/events/` tree to bypass proxy. Protected by: email uniqueness constraint, atomic seat check, date validation
- Ticket download (`/api/tickets/[code]`): **public**, security through ticketCode obscurity (5 alphanumeric chars = ~60M combinations, sufficient for event scale)
- Check-in page (`/check-in/[code]`): **protected by proxy** — organizer must be logged in to view attendee data and confirm presence
- Check-in POST (`/api/registrations/[code]/checkin`): **protected by proxy**
- Admin CRM (`/admin/*`): **protected by proxy** (existing matcher)
- Event CRUD API (`/api/events/*`): **protected by proxy** (existing matcher)

---

## 8. Dependencies

New npm packages:
- `jspdf` — PDF generation
- `qrcode` — QR code generation
- `nodemailer` — email sending (prepared, inactive)

---

## 9. Public Button Integration

Update `WydarzeniaClient.js`:

**"Zarejestruj się" button logic:**
1. If event has `href` set → use external link (override, opens in new tab)
2. If `registrationOpen === false` → show "Rejestracja zamknięta" (disabled button)
3. If `maxSeats !== null` AND registration count >= maxSeats → show "Brak miejsc" (disabled)
4. Otherwise → link to `/wydarzenia/{slug}/rejestracja`

**Seat display in event card meta row** (replaces old `ev.seats` String):
- If `maxSeats` is null → show "Darmowe" (free events)
- If `maxSeats` is set → show "{registrationCount} / {maxSeats} miejsc"
- This requires passing `_count: { registrations: true }` from the server query

---

## 10. Environment Variables (new)

```env
# Email (optional — registration works without it)
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=kontakt@ainetwork.pl
SMTP_PASS=

# Already exists, used for QR code URLs in tickets:
# NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## Out of Scope

- Paid events / payment processing (planned for later)
- Waitlist when full
- Custom email HTML templates
- Bulk email / newsletter to attendees
- Multi-ticket types (VIP, standard)
