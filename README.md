# AI NETWORK - Website Prototype

Prototyp strony internetowej dla społeczności AI NETWORK w Bydgoszczy.

## 📁 Struktura projektu

```
AINETWORK/
├── index.html              # Strona główna
├── wydarzenia.html         # Lista wydarzeń
├── events/                 # Podstrony wydarzeń
│   ├── an1.html           # AI NETWORK #1
│   └── an3.html           # AI NETWORK #3
├── assets/                # Zasoby
│   ├── images/            # Grafiki
│   └── icons/             # Ikony
└── README.md              # Ten plik
```

## 🚀 Jak uruchomić

1. **Lokalnie** - po prostu otwórz `index.html` w przeglądarce
2. **Live Server** (VSCode) - kliknij prawym na `index.html` → "Open with Live Server"
3. **Python HTTP Server**:
   ```bash
   python3 -m http.server 8000
   ```
   Następnie otwórz: http://localhost:8000

## 🔗 Nawigacja

### Strony dostępne:
- **/** (`index.html`) - Strona główna z sekcjami: Hero, O nas, Wydarzenia, Materiały
- **/wydarzenia.html** - Archiwum wydarzeń AI NETWORK
- **/events/an3.html** - Szczegóły wydarzenia "AI NETWORK #3 — Compliance, Zmiana, Automatyzacje"

### Nawigacja między stronami:
- Logo → Strona główna
- Menu "Wydarzenia" → Lista wydarzeń
- Menu "O nas", "Materiały" → Anchory na stronie głównej
- Karty wydarzeń → Podstrony z detalami

## 🎨 Design System

Strona używa spójnego systemu designu:
- **Kolory**: Dark mode (#0D0D0D) + Yellow accent (#F5C518)
- **Typografia**: Montserrat (Google Fonts)
- **Komponenty**: Reużywalne karty, przyciski, nawigacja
- **Responsywność**: Mobile-first, breakpoints na 768px i 900px

## 📝 TODO

- [ ] Dodać podstrony dla AI NETWORK #1 i #2
- [ ] Stworzyć sekcję "Warsztaty"
- [ ] Dodać formularz kontaktowy
- [ ] Podłączyć prawdziwe zdjęcia do galerii
- [ ] Opcjonalnie: migracja do WordPress lub Next.js

## 🛠 Technologie

- **HTML5** - semantyczny markup
- **CSS3** - custom properties, grid, flexbox
- **Vanilla JavaScript** - carousele, interakcje
- **Zero dependencies** - żadnych frameworków w prototypie

## 📦 Deployment

Prototyp gotowy do hostowania na:
- GitHub Pages
- Netlify
- Vercel
- Dowolny static hosting

## 📧 Kontakt

Społeczność AI NETWORK Bydgoszcz
- LinkedIn: [AI NETWORK](#)
- Lokalizacja: Inkubator Starter, Bydgoszcz

---

**Status**: 🚧 Prototyp w rozwoju
**Ostatnia aktualizacja**: Luty 2025
