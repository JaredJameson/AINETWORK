# Event Registration Module — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add event registration with PDF tickets, QR check-in, seat limits, and admin CRM to the AI NETWORK Next.js site.

**Architecture:** Prisma Registration model linked to Event. Public registration form at `/wydarzenia/[slug]/rejestracja`, PDF ticket generation via jspdf+qrcode, QR-based check-in for organizers, admin CRM at `/admin/events/[id]/registrations`. Email prepared but disabled until SMTP configured.

**Tech Stack:** Next.js 16 App Router, PostgreSQL, Prisma 7, jspdf, qrcode, nodemailer, jose (JWT)

**Spec:** `docs/superpowers/specs/2026-03-13-event-registration-design.md`

---

## File Structure

### New Files
```
lib/ticket.js                    — PDF ticket generation (jspdf + qrcode)
lib/email.js                     — nodemailer setup (disabled by default)

app/api/register/[eventId]/route.js           — POST public registration
app/api/tickets/[code]/route.js               — GET PDF ticket download
app/api/registrations/[code]/checkin/route.js  — POST check-in (protected)
app/api/events/[id]/registrations/route.js     — GET list + DELETE single (protected)

app/wydarzenia/[slug]/rejestracja/page.js              — server: load event data
app/wydarzenia/[slug]/rejestracja/RegistrationForm.js   — client: registration form
app/wydarzenia/[slug]/rejestracja/sukces/page.js        — server: success + ticket download

app/check-in/[code]/page.js          — server: load registration data
app/check-in/[code]/CheckInClient.js  — client: check-in button

app/admin/events/[id]/registrations/page.js               — server: CRM data
app/admin/events/[id]/registrations/RegistrationsClient.js — client: CRM table + CSV
```

### Modified Files
```
prisma/schema.prisma             — add Registration model, update Event (seats→maxSeats, +registrationOpen)
proxy.ts                         — add check-in + registrations to matcher
app/wydarzenia/page.js           — include _count in query
app/wydarzenia/WydarzeniaClient.js — update button logic + seat display
app/admin/events/page.js         — add registration count + "Zapisy" link
app/admin/events/new/page.js     — seats→maxSeats, add registrationOpen
app/admin/events/[id]/page.js    — seats→maxSeats, add registrationOpen
app/api/events/route.js          — seats→maxSeats, add registrationOpen
app/api/events/[id]/route.js     — seats→maxSeats, add registrationOpen
```

---

## Task 1: Schema Migration + Dependencies

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

```bash
cd /home/jarek/projects/ainetwork-web
npm install jspdf qrcode nodemailer
npm install --save-dev @types/qrcode @types/nodemailer
```

- [ ] **Step 2: Update Prisma schema**

In `prisma/schema.prisma`, replace the Event model and add Registration:

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
  maxSeats         Int?
  free             Boolean        @default(true)
  accent           String
  imageUrl         String?
  status           String
  href             String?
  registrationOpen Boolean        @default(true)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  registrations    Registration[]
}

model Registration {
  id          String    @id @default(cuid())
  eventId     String
  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  firstName   String
  lastName    String
  email       String
  company     String?
  phone       String?
  ticketCode  String    @unique
  checkedIn   Boolean   @default(false)
  checkedInAt DateTime?
  createdAt   DateTime  @default(now())

  @@unique([eventId, email])
  @@index([eventId])
}
```

- [ ] **Step 3: Create and apply migration**

```bash
npx prisma migrate dev --name add-registration-module
```

This will:
- Remove `seats` (String?) column from Event
- Add `maxSeats` (Int?) and `registrationOpen` (Boolean) to Event
- Create Registration table

- [ ] **Step 4: Migrate existing event data**

Run SQL to set maxSeats for existing events (all current events had string "seats"):

```bash
psql -h localhost -p 5437 -U ainetwork -d ainetwork -c "
  UPDATE \"Event\" SET \"maxSeats\" = 100 WHERE \"maxSeats\" IS NULL AND status = 'upcoming';
"
```

- [ ] **Step 5: Generate Prisma client + verify**

```bash
npx prisma generate
npx prisma db pull --force  # verify schema matches DB
```

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma package.json package-lock.json
git commit -m "feat: add Registration model and update Event schema (seats→maxSeats)"
```

---

## Task 2: Update Event API Routes + Admin Forms

**Files:**
- Modify: `app/api/events/route.js`
- Modify: `app/api/events/[id]/route.js`
- Modify: `app/admin/events/new/page.js`
- Modify: `app/admin/events/[id]/page.js`
- Modify: `app/admin/events/page.js`

- [ ] **Step 1: Update event API POST — `app/api/events/route.js`**

Replace `seats: data.seats` with:
```javascript
maxSeats: data.maxSeats ? parseInt(data.maxSeats) : null,
registrationOpen: data.registrationOpen ?? true,
```

In GET, add registration count:
```javascript
const events = await prisma.event.findMany({
  where: status ? { status } : {},
  orderBy: { date: 'asc' },
  include: { _count: { select: { registrations: true } } },
});
```

- [ ] **Step 2: Update event API PUT — `app/api/events/[id]/route.js`**

Replace `seats: data.seats` with:
```javascript
maxSeats: data.maxSeats !== undefined ? (data.maxSeats ? parseInt(data.maxSeats) : null) : undefined,
registrationOpen: data.registrationOpen,
```

- [ ] **Step 3: Update admin new event form — `app/admin/events/new/page.js`**

Replace `seats: '100 miejsc'` in defaultForm with:
```javascript
maxSeats: '', registrationOpen: true,
```

Replace the seats input field with:
```jsx
<label style={labelStyle}>Maks. miejsc <span style={{ color: '#555', fontWeight: 400 }}>(puste = bez limitu)</span></label>
<input type="number" min="1" value={form.maxSeats} onChange={e => set('maxSeats', e.target.value)} style={inputStyle} placeholder="np. 100" />

<label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
  <input type="checkbox" checked={form.registrationOpen} onChange={e => set('registrationOpen', e.target.checked)} style={{ accentColor: '#F5C518' }} />
  Rejestracja otwarta
</label>
```

- [ ] **Step 4: Update admin edit event form — `app/admin/events/[id]/page.js`**

Same changes as Step 3, plus update the useEffect that loads event data:
```javascript
setForm({
  ...ev,
  date: ev.date?.split('T')[0] || '',
  maxSeats: ev.maxSeats ?? '',
  registrationOpen: ev.registrationOpen ?? true,
});
```

- [ ] **Step 5: Update admin events list — `app/admin/events/page.js`**

Add registration count to each event row. After the status badge, add:
```jsx
<Link href={`/admin/events/${ev.id}/registrations`} onClick={e => e.stopPropagation()} style={{
  padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
  background: 'rgba(46,204,113,0.15)', color: '#2ECC71',
  textDecoration: 'none', whiteSpace: 'nowrap',
}}>
  {ev._count?.registrations || 0} zapisów
</Link>
```

Update the query to include count:
```javascript
const events = await prisma.event.findMany({
  orderBy: { date: 'asc' },
  include: { _count: { select: { registrations: true } } },
});
```

- [ ] **Step 6: Verify admin works**

```bash
# Start dev server if not running
npm run dev
# Open http://localhost:3000/admin/events — should show list with "0 zapisów" badges
# Open http://localhost:3000/admin/events/new — should show maxSeats + registrationOpen fields
```

- [ ] **Step 7: Commit**

```bash
git add app/api/events/ app/admin/events/
git commit -m "feat: update event forms and API for maxSeats + registrationOpen"
```

---

## Task 3: Registration API + Ticket Code Generation

**Files:**
- Create: `app/api/register/[eventId]/route.js`

- [ ] **Step 1: Create registration API**

```javascript
// app/api/register/[eventId]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function generateTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion
  const bytes = crypto.randomBytes(5);
  return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

export async function POST(req, { params }) {
  const { eventId } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { firstName, lastName, email, company, phone } = body;

  // Validate required fields
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Imię, nazwisko i email są wymagane' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Nieprawidłowy format email' }, { status: 400 });
  }

  // Load event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) {
    return NextResponse.json({ error: 'Wydarzenie nie istnieje' }, { status: 404 });
  }

  if (!event.registrationOpen) {
    return NextResponse.json({ error: 'Rejestracja jest zamknięta' }, { status: 410 });
  }

  if (new Date(event.date) < new Date()) {
    return NextResponse.json({ error: 'Wydarzenie już się odbyło' }, { status: 410 });
  }

  if (event.maxSeats && event._count.registrations >= event.maxSeats) {
    return NextResponse.json({ error: 'Brak wolnych miejsc' }, { status: 410 });
  }

  // Atomic registration with seat check
  let registration;
  for (let attempt = 0; attempt < 3; attempt++) {
    const ticketCode = generateTicketCode();
    try {
      registration = await prisma.$transaction(async (tx) => {
        // Re-check seat count inside transaction
        if (event.maxSeats) {
          const count = await tx.registration.count({ where: { eventId } });
          if (count >= event.maxSeats) {
            throw new Error('FULL');
          }
        }
        return tx.registration.create({
          data: {
            eventId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            company: company?.trim() || null,
            phone: phone?.trim() || null,
            ticketCode,
          },
        });
      });
      break; // success
    } catch (e) {
      if (e.message === 'FULL') {
        return NextResponse.json({ error: 'Brak wolnych miejsc' }, { status: 410 });
      }
      if (e.code === 'P2002' && e.meta?.target?.includes('ticketCode')) {
        continue; // ticket code collision, retry
      }
      if (e.code === 'P2002' && e.meta?.target?.includes('eventId_email')) {
        return NextResponse.json({ error: 'Ten email jest już zarejestrowany na to wydarzenie' }, { status: 409 });
      }
      throw e;
    }
  }

  if (!registration) {
    return NextResponse.json({ error: 'Nie udało się wygenerować kodu biletu' }, { status: 500 });
  }

  // TODO: sendRegistrationConfirmation(registration, event) when SMTP configured

  return NextResponse.json({ ok: true, ticketCode: registration.ticketCode }, { status: 201 });
}
```

- [ ] **Step 2: Verify API works**

```bash
# Test with curl (use a real event ID from your DB)
# First get an event ID:
psql -h localhost -p 5437 -U ainetwork -d ainetwork -c "SELECT id, title FROM \"Event\" WHERE status='upcoming' LIMIT 1;"

# Then test registration (replace EVENT_ID):
curl -s -X POST http://localhost:3000/api/register/EVENT_ID \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Jan","lastName":"Kowalski","email":"jan@test.pl","company":"TestCorp","phone":"123456789"}'
# Expected: {"ok":true,"ticketCode":"XXXXX"}

# Test duplicate:
curl -s -X POST http://localhost:3000/api/register/EVENT_ID \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Jan","lastName":"Kowalski","email":"jan@test.pl"}'
# Expected: 409 {"error":"Ten email jest już zarejestrowany na to wydarzenie"}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/register/
git commit -m "feat: add public event registration API with atomic seat check"
```

---

## Task 4: Registration Form (Public)

**Files:**
- Create: `app/wydarzenia/[slug]/rejestracja/page.js`
- Create: `app/wydarzenia/[slug]/rejestracja/RegistrationForm.js`
- Create: `app/wydarzenia/[slug]/rejestracja/sukces/page.js`

- [ ] **Step 1: Create server page — `app/wydarzenia/[slug]/rejestracja/page.js`**

```javascript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug }, select: { title: true } });
  if (!event) return {};
  return { title: `Rejestracja — ${event.title} | AI NETWORK` };
}

export default async function RegistrationPage({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) notFound();

  const isPast = new Date(event.date) < new Date();
  const isFull = event.maxSeats ? event._count.registrations >= event.maxSeats : false;
  const canRegister = event.registrationOpen && !isPast && !isFull;

  const data = {
    id: event.id,
    title: event.title,
    brand: event.brand,
    date: event.date.toISOString(),
    time: event.time,
    location: event.location,
    venue: event.venue,
    accent: event.accent,
    maxSeats: event.maxSeats,
    registered: event._count.registrations,
    canRegister,
    reason: isPast ? 'past' : !event.registrationOpen ? 'closed' : isFull ? 'full' : null,
  };

  return <RegistrationForm event={data} />;
}
```

- [ ] **Step 2: Create client form — `app/wydarzenia/[slug]/rejestracja/RegistrationForm.js`**

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationForm({ event }) {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/register/${event.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      router.push(`/wydarzenia/${event.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/rejestracja/sukces?code=${data.ticketCode}`);
    } else {
      setError(data.error || 'Wystąpił błąd. Spróbuj ponownie.');
    }
  }

  const eventDate = new Date(event.date).toLocaleDateString('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <Link href="/wydarzenia" style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '32px' }}>
          ← Wróć do wydarzeń
        </Link>

        {/* Event info card */}
        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderTop: `3px solid ${event.accent}`, borderRadius: '10px',
          padding: '24px', marginBottom: '32px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: event.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {event.brand}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
            {event.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#888' }}>
            <span>{eventDate}</span>
            <span>{event.time}</span>
            <span>{event.location}, {event.venue}</span>
          </div>
          {event.maxSeats && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: event.registered >= event.maxSeats ? '#E74C3C' : '#2ECC71' }}>
              {event.registered} / {event.maxSeats} miejsc zajętych
            </div>
          )}
        </div>

        {/* Registration form or message */}
        {!event.canRegister ? (
          <div style={{
            background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              {event.reason === 'past' && 'Wydarzenie już się odbyło'}
              {event.reason === 'closed' && 'Rejestracja jest zamknięta'}
              {event.reason === 'full' && 'Wszystkie miejsca zajęte'}
            </div>
            <Link href="/wydarzenia" style={{ color: event.accent, fontSize: '13px' }}>
              Zobacz inne wydarzenia →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '32px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
              Formularz rejestracji
            </h2>

            {error && (
              <div style={{
                background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)',
                borderRadius: '8px', padding: '10px 14px', color: '#E74C3C', fontSize: '13px', marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Imię *</label>
                <input required value={form.firstName} onChange={e => set('firstName', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nazwisko *</label>
                <input required value={form.lastName} onChange={e => set('lastName', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email *</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Firma</label>
                <input value={form.company} onChange={e => set('company', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '14px', background: event.accent || '#F5C518',
              color: '#111', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}>
              {saving ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>

            <p style={{ marginTop: '16px', fontSize: '11px', color: '#555', textAlign: 'center' }}>
              Rejestrując się, wyrażasz zgodę na przetwarzanie danych osobowych w celu organizacji wydarzenia.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create success page — `app/wydarzenia/[slug]/rejestracja/sukces/page.js`**

```javascript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ params, searchParams }) {
  const { slug } = await params;
  const { code } = await searchParams;

  if (!code) notFound();

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
    include: { event: true },
  });

  if (!registration || registration.event.slug !== slug) notFound();

  const ev = registration.event;
  const eventDate = new Date(ev.date).toLocaleDateString('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(46,204,113,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '28px',
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Rejestracja potwierdzona!
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
          {registration.firstName}, dziękujemy za rejestrację na wydarzenie.
        </p>

        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '24px', marginBottom: '24px', textAlign: 'left',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: ev.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {ev.brand}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            {ev.title}
          </div>
          <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.8 }}>
            <div>📅 {eventDate}, {ev.time}</div>
            <div>📍 {ev.location}, {ev.venue}</div>
            <div style={{ marginTop: '8px', color: '#F5C518', fontWeight: 700, fontSize: '16px', letterSpacing: '0.1em' }}>
              Kod biletu: {registration.ticketCode}
            </div>
          </div>
        </div>

        <a
          href={`/api/tickets/${registration.ticketCode}`}
          download
          style={{
            display: 'inline-block', padding: '14px 32px',
            background: ev.accent || '#F5C518', color: '#111',
            borderRadius: '8px', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none', marginBottom: '16px',
          }}
        >
          📄 Pobierz bilet (PDF)
        </a>

        <p style={{ color: '#555', fontSize: '12px', marginBottom: '32px' }}>
          Pokaż QR kod z biletu przy wejściu na wydarzenie.
        </p>

        <Link href="/wydarzenia" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>
          ← Wróć do wydarzeń
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Fix the router.push slug in RegistrationForm**

The success redirect needs the event slug, not a derived slug from brand. Update RegistrationForm to accept slug as a prop. In `page.js`, pass `slug: event.slug` in the data object. In RegistrationForm, change redirect to:

```javascript
router.push(`/wydarzenia/${event.slug}/rejestracja/sukces?code=${data.ticketCode}`);
```

- [ ] **Step 5: Verify form works in browser**

```
Navigate to http://localhost:3000/wydarzenia/[slug-of-upcoming-event]/rejestracja
Fill in form, submit, verify redirect to success page
```

- [ ] **Step 6: Commit**

```bash
git add app/wydarzenia/
git commit -m "feat: add public event registration form and success page"
```

---

## Task 5: PDF Ticket Generation

**Files:**
- Create: `lib/ticket.js`
- Create: `app/api/tickets/[code]/route.js`

- [ ] **Step 1: Create ticket generator — `lib/ticket.js`**

```javascript
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export async function generateTicketPDF(registration, event) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const checkInUrl = `${baseUrl}/check-in/${registration.ticketCode}`;

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(checkInUrl, {
    width: 200, margin: 1, color: { dark: '#000000', light: '#FFFFFF' },
  });

  // Create PDF (A4 portrait)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  // Dark background header
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, w, 90, 'F');

  // Yellow accent line
  doc.setFillColor(245, 197, 24);
  doc.rect(0, 88, w, 3, 'F');

  // Branding
  doc.setTextColor(245, 197, 24);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AI NETWORK', w / 2, 25, { align: 'center' });

  // Event title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(event.title, w / 2, 42, { align: 'center', maxWidth: w - 40 });

  // Event details
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  const eventDate = new Date(event.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  doc.text(`${eventDate}  |  ${event.time}  |  ${event.location}, ${event.venue}`, w / 2, 65, { align: 'center' });

  // Attendee section
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('UCZESTNIK', 20, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`${registration.firstName} ${registration.lastName}`, 20, 122);

  if (registration.company) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text(registration.company, 20, 132);
  }

  // Ticket code
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('KOD BILETU', 20, 155);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 197, 24);
  doc.text(registration.ticketCode, 20, 170);

  // QR Code
  doc.addImage(qrDataUrl, 'PNG', w - 70, 105, 50, 50);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Skanuj przy wejściu', w - 45, 162, { align: 'center' });

  // Footer line
  doc.setDrawColor(230, 230, 230);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(20, 185, w - 20, 185);

  // Footer text
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Ten bilet jest potwierdzeniem rejestracji. Okaż QR kod przy wejściu na wydarzenie.', w / 2, 195, { align: 'center' });
  doc.text('ainetwork.pl', w / 2, 202, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}
```

- [ ] **Step 2: Create ticket API route — `app/api/tickets/[code]/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTicketPDF } from '@/lib/ticket';

export async function GET(req, { params }) {
  const { code } = await params;

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
    include: { event: true },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Bilet nie znaleziony' }, { status: 404 });
  }

  const pdfBuffer = await generateTicketPDF(registration, registration.event);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bilet-${code}.pdf"`,
    },
  });
}
```

- [ ] **Step 3: Verify ticket download**

```
Navigate to success page, click "Pobierz bilet (PDF)"
Verify PDF contains: event title, attendee name, QR code, ticket code
Scan QR code with phone — should point to /check-in/XXXXX
```

- [ ] **Step 4: Commit**

```bash
git add lib/ticket.js app/api/tickets/
git commit -m "feat: add PDF ticket generation with QR code"
```

---

## Task 6: Check-in Flow

**Files:**
- Create: `app/check-in/[code]/page.js`
- Create: `app/check-in/[code]/CheckInClient.js`
- Create: `app/api/registrations/[code]/checkin/route.js`
- Modify: `proxy.ts`

- [ ] **Step 1: Update proxy matcher — `proxy.ts`**

Add these two entries to the `matcher` array in `config`:

```typescript
'/check-in/:path*',
'/api/registrations/:path*',
```

- [ ] **Step 2: Create check-in API — `app/api/registrations/[code]/checkin/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req, { params }) {
  const { code } = await params;

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Bilet nie znaleziony' }, { status: 404 });
  }

  if (registration.checkedIn) {
    return NextResponse.json({
      error: 'Już zarejestrowany',
      checkedInAt: registration.checkedInAt,
    }, { status: 409 });
  }

  const updated = await prisma.registration.update({
    where: { ticketCode: code },
    data: { checkedIn: true, checkedInAt: new Date() },
    include: { event: { select: { title: true, brand: true } } },
  });

  return NextResponse.json({ ok: true, registration: updated });
}
```

- [ ] **Step 3: Create check-in server page — `app/check-in/[code]/page.js`**

```javascript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckInClient from './CheckInClient';

export const dynamic = 'force-dynamic';

export default async function CheckInPage({ params }) {
  const { code } = await params;

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
    include: { event: { select: { id: true, title: true, brand: true, accent: true, date: true } } },
  });

  if (!registration) notFound();

  return (
    <CheckInClient
      registration={{
        ticketCode: registration.ticketCode,
        firstName: registration.firstName,
        lastName: registration.lastName,
        company: registration.company,
        email: registration.email,
        checkedIn: registration.checkedIn,
        checkedInAt: registration.checkedInAt?.toISOString() || null,
      }}
      event={{
        title: registration.event.title,
        brand: registration.event.brand,
        accent: registration.event.accent,
      }}
    />
  );
}
```

- [ ] **Step 4: Create check-in client — `app/check-in/[code]/CheckInClient.js`**

```javascript
'use client';

import { useState } from 'react';

export default function CheckInClient({ registration, event }) {
  const [checkedIn, setCheckedIn] = useState(registration.checkedIn);
  const [checkedInAt, setCheckedInAt] = useState(registration.checkedInAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckIn() {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/registrations/${registration.ticketCode}/checkin`, {
      method: 'POST',
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setCheckedIn(true);
      setCheckedInAt(data.registration.checkedInAt);
    } else {
      const data = await res.json();
      setError(data.error || 'Błąd');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: event.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          {event.brand}
        </div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>{event.title}</div>

        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', padding: '32px', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            {registration.firstName} {registration.lastName}
          </div>
          {registration.company && (
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{registration.company}</div>
          )}
          <div style={{ fontSize: '12px', color: '#555' }}>{registration.email}</div>

          <div style={{
            margin: '20px 0', padding: '8px', background: 'rgba(245,197,24,0.1)',
            borderRadius: '6px', fontSize: '18px', fontWeight: 700, color: '#F5C518', letterSpacing: '0.15em',
          }}>
            {registration.ticketCode}
          </div>

          {checkedIn ? (
            <div style={{
              padding: '16px', background: 'rgba(46,204,113,0.1)',
              border: '1px solid rgba(46,204,113,0.25)', borderRadius: '8px',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>✅</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2ECC71' }}>Obecność potwierdzona</div>
              {checkedInAt && (
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {new Date(checkedInAt).toLocaleString('pl-PL')}
                </div>
              )}
            </div>
          ) : (
            <>
              {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
              <button onClick={handleCheckIn} disabled={loading} style={{
                width: '100%', padding: '16px', background: '#2ECC71', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
              }}>
                {loading ? 'Potwierdzanie...' : 'Potwierdź obecność'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify check-in flow**

```
1. Log in at /admin/login
2. Navigate to /check-in/XXXXX (use a real ticket code)
3. Should show attendee info + green button
4. Click "Potwierdź obecność"
5. Should show green confirmation with timestamp
```

- [ ] **Step 6: Commit**

```bash
git add proxy.ts app/check-in/ app/api/registrations/
git commit -m "feat: add QR check-in flow for event organizers"
```

---

## Task 7: Admin CRM — Registrations List

**Files:**
- Create: `app/admin/events/[id]/registrations/page.js`
- Create: `app/admin/events/[id]/registrations/RegistrationsClient.js`
- Create: `app/api/events/[id]/registrations/route.js`

- [ ] **Step 1: Create registrations API — `app/api/events/[id]/registrations/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const { id } = await params;
  const registrations = await prisma.registration.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(registrations);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const regId = searchParams.get('regId');

  if (!regId) {
    return NextResponse.json({ error: 'regId required' }, { status: 400 });
  }

  await prisma.registration.delete({ where: { id: regId } });
  revalidatePath(`/admin/events/${id}/registrations`);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create CRM server page — `app/admin/events/[id]/registrations/page.js`**

```javascript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import RegistrationsClient from './RegistrationsClient';

export const dynamic = 'force-dynamic';

export default async function RegistrationsPage({ params }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: { orderBy: { createdAt: 'desc' } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) notFound();

  return (
    <RegistrationsClient
      event={{
        id: event.id,
        title: event.title,
        brand: event.brand,
        maxSeats: event.maxSeats,
        registrationOpen: event.registrationOpen,
        accent: event.accent,
      }}
      registrations={event.registrations.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        checkedInAt: r.checkedInAt?.toISOString() || null,
      }))}
      totalRegistered={event._count.registrations}
    />
  );
}
```

- [ ] **Step 3: Create CRM client — `app/admin/events/[id]/registrations/RegistrationsClient.js`**

```javascript
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegistrationsClient({ event, registrations: initialRegs, totalRegistered }) {
  const [registrations, setRegistrations] = useState(initialRegs);
  const [regOpen, setRegOpen] = useState(event.registrationOpen);

  async function toggleRegistration() {
    const newVal = !regOpen;
    await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationOpen: newVal }),
    });
    setRegOpen(newVal);
  }

  async function handleDelete(regId) {
    if (!confirm('Usunąć rejestrację?')) return;
    const res = await fetch(`/api/events/${event.id}/registrations?regId=${regId}`, { method: 'DELETE' });
    if (res.ok) setRegistrations(prev => prev.filter(r => r.id !== regId));
  }

  async function handleCheckIn(ticketCode, idx) {
    const res = await fetch(`/api/registrations/${ticketCode}/checkin`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setRegistrations(prev => prev.map((r, i) =>
        i === idx ? { ...r, checkedIn: true, checkedInAt: data.registration.checkedInAt } : r
      ));
    }
  }

  function exportCSV() {
    const headers = ['Imię', 'Nazwisko', 'Email', 'Firma', 'Telefon', 'Kod biletu', 'Data rejestracji', 'Check-in'];
    const rows = registrations.map(r => [
      r.firstName, r.lastName, r.email, r.company || '', r.phone || '',
      r.ticketCode, new Date(r.createdAt).toLocaleString('pl-PL'),
      r.checkedIn ? 'Tak' : 'Nie',
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zapisy-${event.brand.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const thStyle = { padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' };
  const tdStyle = { padding: '10px 14px', fontSize: '13px', color: '#DDD', borderTop: '1px solid rgba(255,255,255,0.05)' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link href={`/admin/events/${event.id}`} style={{ color: '#888', fontSize: '12px', textDecoration: 'none' }}>
            ← Wróć do eventu
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginTop: '8px' }}>
            Zapisy — {event.brand}
          </h1>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            {registrations.length}{event.maxSeats ? ` / ${event.maxSeats}` : ''} zapisanych
            {' · '}
            {registrations.filter(r => r.checkedIn).length} obecnych
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={toggleRegistration} style={{
            padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
            background: regOpen ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
            color: regOpen ? '#2ECC71' : '#E74C3C',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {regOpen ? '● Rejestracja otwarta' : '● Rejestracja zamknięta'}
          </button>
          <button onClick={exportCSV} style={{
            padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#AAA', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            📥 Eksport CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'auto' }}>
        {registrations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
            Brak zapisów
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Imię i nazwisko</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Firma</th>
                <th style={thStyle}>Telefon</th>
                <th style={thStyle}>Kod</th>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr key={r.id}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600 }}>{r.firstName} {r.lastName}</span>
                  </td>
                  <td style={tdStyle}>{r.email}</td>
                  <td style={{ ...tdStyle, color: '#888' }}>{r.company || '—'}</td>
                  <td style={{ ...tdStyle, color: '#888' }}>{r.phone || '—'}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#F5C518', fontWeight: 700 }}>{r.ticketCode}</td>
                  <td style={{ ...tdStyle, color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    {new Date(r.createdAt).toLocaleDateString('pl-PL')}
                  </td>
                  <td style={tdStyle}>
                    {r.checkedIn ? (
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: 'rgba(46,204,113,0.15)', color: '#2ECC71' }}>
                        Obecny
                      </span>
                    ) : (
                      <button onClick={() => handleCheckIn(r.ticketCode, i)} style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                        background: 'rgba(255,255,255,0.05)', color: '#888', border: 'none', cursor: 'pointer',
                      }}>
                        Check-in
                      </button>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(r.id)} style={{
                      background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px',
                    }}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify CRM works**

```
Navigate to http://localhost:3000/admin/events/[id]/registrations
Should show registrations table, CSV export, registration toggle
```

- [ ] **Step 5: Commit**

```bash
git add app/admin/events/[id]/registrations/ app/api/events/[id]/registrations/
git commit -m "feat: add admin CRM — registrations list with CSV export and check-in"
```

---

## Task 8: Public Page Integration + Email Stub

**Files:**
- Modify: `app/wydarzenia/page.js`
- Modify: `app/wydarzenia/WydarzeniaClient.js`
- Create: `lib/email.js`

- [ ] **Step 1: Update wydarzenia server page — `app/wydarzenia/page.js`**

Add `_count` and `registrationOpen` to queries:

```javascript
const [upcoming, past] = await Promise.all([
  prisma.event.findMany({
    where: { status: 'upcoming' },
    orderBy: { date: 'asc' },
    include: { _count: { select: { registrations: true } } },
  }),
  prisma.event.findMany({
    where: { status: 'past' },
    orderBy: { date: 'desc' },
    include: { _count: { select: { registrations: true } } },
  }),
]);
```

- [ ] **Step 2: Update WydarzeniaClient.js button logic**

In the upcoming events card, replace the existing seat display and button:

Replace `{ev.seats && <span><UsersIcon /> {ev.seats}</span>}` with:
```jsx
{ev.maxSeats && (
  <span><UsersIcon /> {ev._count?.registrations || 0} / {ev.maxSeats} miejsc</span>
)}
```

Replace the "Zarejestruj się" Link button logic with:
```jsx
{(() => {
  const isFull = ev.maxSeats && (ev._count?.registrations || 0) >= ev.maxSeats;
  const href = ev.href || `/wydarzenia/${ev.slug}/rejestracja`;
  if (!ev.registrationOpen) {
    return <span className="wyd-btn-sm-disabled">Rejestracja zamknięta</span>;
  }
  if (isFull) {
    return <span className="wyd-btn-sm-disabled">Brak miejsc</span>;
  }
  return (
    <Link href={href} className="wyd-btn-sm-yellow" {...(ev.href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      Zarejestruj się <ArrowRight size={16} />
    </Link>
  );
})()}
```

Add CSS class for disabled button in the `<style>` section:
```css
.wyd-btn-sm-disabled {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.05);
  color: #555;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: default;
}
```

- [ ] **Step 3: Create email stub — `lib/email.js`**

```javascript
import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendRegistrationConfirmation(registration, event) {
  if (!transporter) {
    console.log('Email skipped — SMTP not configured');
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ticketUrl = `${baseUrl}/api/tickets/${registration.ticketCode}`;
  const eventDate = new Date(event.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  await transporter.sendMail({
    from: `"AI NETWORK" <${process.env.SMTP_USER}>`,
    to: registration.email,
    subject: `Potwierdzenie rejestracji — ${event.title}`,
    text: [
      `Cześć ${registration.firstName},`,
      '',
      `Potwierdzamy rejestrację na wydarzenie:`,
      `${event.title}`,
      `${eventDate}, ${event.time}`,
      `${event.location}, ${event.venue}`,
      '',
      `Twój kod biletu: ${registration.ticketCode}`,
      `Pobierz bilet PDF: ${ticketUrl}`,
      '',
      `Pokaż QR kod z biletu przy wejściu na wydarzenie.`,
      '',
      `Do zobaczenia!`,
      `Zespół AI NETWORK`,
    ].join('\n'),
  });
}
```

- [ ] **Step 4: Wire email into registration API**

In `app/api/register/[eventId]/route.js`, add import at top:
```javascript
import { sendRegistrationConfirmation } from '@/lib/email';
```

Replace the `// TODO` comment with:
```javascript
// Send confirmation email (no-op if SMTP not configured)
sendRegistrationConfirmation(registration, event).catch(console.error);
```

- [ ] **Step 5: Add SMTP vars to .env (empty)**

Append to `.env`:
```
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=kontakt@ainetwork.pl
SMTP_PASS=
```

- [ ] **Step 6: Full integration test**

```
1. Go to /wydarzenia — verify "Zarejestruj się" button links to /rejestracja
2. Click it → fill form → submit
3. Verify redirect to success page
4. Download PDF ticket, verify QR code
5. Go to /admin/events/[id]/registrations — verify new registration appears
6. Toggle registration on/off, verify button changes on public page
```

- [ ] **Step 7: Commit**

```bash
git add app/wydarzenia/ lib/email.js app/api/register/ .env.example
git commit -m "feat: integrate registration with public events page + email stub"
```

---

## Task 9: Final Cleanup + Push

- [ ] **Step 1: Verify public pages still work**

```
http://localhost:3000 — homepage loads
http://localhost:3000/wydarzenia — events list loads
http://localhost:3000/baza-wiedzy — knowledge base loads
http://localhost:3000/admin — redirects to login
```

- [ ] **Step 2: Commit any remaining changes and push**

```bash
git status
git push origin main
```
