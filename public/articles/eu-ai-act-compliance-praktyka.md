---
title: "EU AI Act w praktyce — przewodnik compliance na 2026"
slug: "eu-ai-act-compliance-praktyka"
type: "cluster"
pillar_parent: "ai-w-praktyce-dane-i-badania-2026"
category: "Dane & Badania AI"
tags: ["EU AI Act", "compliance", "regulacje", "GPAI", "governance", "kary", "RODO"]
reading_time: "13 min"
date_published: "2026-03-15"
excerpt: "Od sierpnia 2026 Komisja Europejska może nakładać kary za niezgodność z EU AI Act. Praktyczny przewodnik: timeline obowiązków, klasyfikacja ryzyka, GPAI compliance i checklist dla firm."
thumbnail_prompt: "Dark background with yellow EU regulatory shield, timeline visualization with compliance milestones, legal document with AI circuit overlay, risk classification pyramid in yellow tones, dark navy background, governance aesthetic, AI NETWORK branding"
author: "AI NETWORK"
---

## Najważniejsze w skrócie

Od sierpnia 2026 Komisja Europejska będzie mogła nakładać kary za niezgodność z EU AI Act — do €35 mln lub 7% globalnego przychodu rocznego, w zależności od tego, która kwota jest wyższa. To nie jest RODO (gdzie kary wynosiły 1–2% przychodu), ale znacząco wyższe stawki, które budzą czujność zarządów finansowych. Dobra wiadomość: przygotowanie jest możliwe i powinno się zacząć teraz. Ten artykuł wyjaśnia obowiązki w praktyce, bez prawniczych zawiłości.

---

## Spis treści

1. [Dlaczego EU AI Act zmienia zasady gry](#dlaczego)
2. [Timeline obowiązków: co się zmienia i kiedy](#timeline)
3. [Klasyfikacja ryzyka AI — cztery poziomy](#klasyfikacja)
4. [Modele GPAI: co to oznacza dla firm używających ChatGPT, Claude, Gemini](#gpai)
5. [Sześć praktycznych obszarów compliance](#obszary)
6. [Checklist: 10 kroków do zgodności w 2026](#checklist)
7. [Specyfika dla Polski i branż](#specyfika)
8. [Co dalej? Przygotowanie na kolejne fazy](#co-dalej)

---

## Dlaczego EU AI Act zmienia zasady gry {#dlaczego}

Fundamentalna różnica między EU AI Act a RODO polega na przedmiocie regulacji. RODO skupiło się na ochronie danych osobowych — na pytaniach: kto przechowuje dane, jak są przetwarzane, gdzie znajdują się kopie. EU AI Act idzie dalej, podchodząc z całkowicie innego kąta: reguluje **funkcjonowanie samej sztucznej inteligencji**, niezależnie od tego, jakie dane przetwarza. Pytanie brzmi nie „czy ta firma bezpiecznie przechowuje dane", ale „czy ta sztuczna inteligencja podejmuje decyzje, które mogą naruszyć prawa obywateli?"

Rekrutacja, udzielanie kredytów, decyzje sądów, edukacja — to wszystkie obszary, gdzie AI może mieć realny wpływ na życie ludzi. EU AI Act mówi wprost: «Jeśli sztuczna inteligencja podejmuje decyzje o ludziach, będzie kontrolowana». Dotyczy to zarówno dużych dostawców (OpenAI, Anthropic, Google), którzy muszą spełnić wymogi dla modeli GPAI, jak i każdej organizacji, która wdraża te narzędzia do podejmowania ważnych decyzji biznesowych. Geograficznie działalność w Unii Europejskiej wystarczy — nie trzeba być firmą zarejestrowaną w UE, wystarczy pracować lub oferować usługi na terenie UE.

Egzekwowanie nowych obowiązków już się rozpoczęło. Część wymogów weszła w życie w lutym 2025, a kolejny etap zaczyna się w sierpniu 2026, kiedy Komisja będzie mogła nałożyć kary pieniężne. W zależności od charakteru naruszenia, sankcje mogą sięgać do €35 mln lub 7% globalnego przychodu rocznego — to znacznie wyższe stawki niż w RODO. Egzekwowanie nie będzie łagodne w pierwszym roku — zamiast tego spodziewać się należy skoncentrowanych działań na obszarach wysokiego ryzyka (rekrutacja, finanse, medycyna) i oczywistych naruszeń (zakaz praktyk).

---

## Timeline obowiązków: co się zmienia i kiedy {#timeline}

| Data | Obowiązek | Zakres | Status w marcu 2026 |
|------|-----------|--------|-------------------|
| **2 lut 2025** | Zakaz praktyk AI o niedopuszczalnym ryzyku | Wszyscy dostawcy i użytkownicy AI | ✅ Obowiązkowe |
| **2 sie 2025** | Obowiązki dostawców modeli GPAI | OpenAI, Anthropic, Google, Meta itd. | ✅ Obowiązkowe |
| **2 lut 2026** | Szczegółowe wytyczne Komisji Europejskiej | Dostawcy, wdrażający, użytkownicy | ✅ Opublikowane |
| **2 sie 2026** | Uprawnienia egzekucyjne KE + kary | Egzekwowanie wszystkich wcześniejszych obowiązków | ⏳ Za 4,5 miesiąca |
| **2 sie 2026** | Obowiązki dla systemów AI wysokiego ryzyka | Dostawcy i wdrażający | ⏳ Za 4,5 miesiąca |
| **2 sie 2027** | Zgodność modeli GPAI sprzed sie 2025 | Historyczne modele (większość obecnych) | ⏳ Za 17 miesięcy |

Interpretacja tego harmonogramu jest kluczowa. Teoretycznie organizacje mają do sierpnia 2026 na przygotowanie się do pełnego egzekwowania. W rzeczywistości oznacza to, że każda firma używająca AI powinna **niezwłocznie** zacząć od dwóch działań: inwentaryzacji wszystkich systemów AI w użytkowaniu oraz oceny ich poziomu ryzyka zgodnie z klasyfikacją EU AI Act. Działania te nie mogą czekać na ostatnie miesiące przed terminem — przygotowanie wymaga czasu, szczególnie dla organizacji z zaawansowanymi systemami AI.

---

## Klasyfikacja ryzyka AI — cztery poziomy {#klasyfikacja}

Kluczem do zrozumienia EU AI Act jest jego system klasyfikacji ryzyka. Wszystkie systemy sztucznej inteligencji dzielą się na cztery kategorie, zależne od potencjalnego wpływu na prawa, wolności i bezpieczeństwo obywateli Unii. Każda kategoria wiąże się z innym zestawem obowiązków dla dostawców i wdrażających AI. Zrozumienie, do której kategorii należy system, bezpośrednio określa zakres wymaganych działań compliance.

```
┌─────────────────────────────────────────┐
│    RYZYKA NIEDOPUSZCZALNE (Zakaz)      │
│  Stanowiące egzystencjalną groźbę      │
│  (np. systemy punktacji społecznej)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    RYZYKA WYSOKIE (Wysokie wymogi)     │
│  Wpływ na biometrykę, edukację,        │
│  finanse, bezpieczeństwo, prawo        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   RYZYKA OGRANICZONE (Transparencja)   │
│  Systemy interakcji z ludźmi            │
│  (np. chatbot, asystent AI)             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   RYZYKA MINIMALNE (Brak obowiązków)   │
│  Gry komputerowe, filtry spamu         │
└─────────────────────────────────────────┘
```

### 1. Ryzyka niedopuszczalne — praktyki całkowicie zakazane

Komisja Europejska zakazuje całkowicie pewnych kategorii systemów AI. Zakaz jest bezwzględny — niezależnie od branży, intencji czy umowy z klientem, te systemy nie mogą funkcjonować na terenie Unii Europejskiej. Przykłady obejmują systemy punktacji społecznej, które przypisują obywatelom ocenę bez możliwości odwołania się (podobne do systemu stosowanego przez władze chińskie), AI zaprojektowaną do manipulacji psychologicznej w celu uzależnienia lub zmiany zachowania w sposób szkodliwy dla jednostki, czy biometryczne skanowanie twarzy ludzi bez ich wiedzy i zgody. Uzasadnieniem dla zakazu są fundamentalne wartości europejskie — godność człowieka, prawo do sprawiedliwego procesu, autonomia decyzji, nienaruszalność prywatności. Europa wciąż przestrzega tych zasad rygorystycznie, niezależnie od presji biznesowej.

### 2. Ryzyka wysokie — wymagające nadzoru i dokumentacji

Systemy wysokiego ryzyka to te, które podejmują decyzje mające realny wpływ na prawa i życie obywateli. Komisja nie zakazuje ich, ale nakłada rygorystyczne wymogi — możesz je wdrażać, ale pod ciągłą kontrolą. Przykłady obejmują systemy kredytowe, które decydują o udzieleniu lub odmowie kredytu (decyzja mogąca zmienić finansową przyszłość człowieka), rekrutacyjne AI selekcjonujące kandydatów (decyzja wpływająca na zatrudnienie), systemy wspierające decyzje sądowe dotyczące aresztu czy zwolnienia warunkowego, oceny edukacyjne przypisane przez AI studentom, diagnozy medyczne wspierane przez algorytmy, czy systemy bezpieczeństwa monitorujące infrastrukturę krytyczną.

Dla każdego takiego systemu organizacja musi przygotować pełną **dokumentację techniczną** — wyjaśniającą, jak system funkcjonuje, jakimi danymi trenowano model, jakie testy bezpieczeństwa przeprowadzono. Należy **ocenić potencjalny wpływ** — co się stanie, jeśli AI się myli? Jaka jest skala potencjalnej szkody dla użytkownika? Kluczowe jest **zapewnienie przejrzystości** — każdy, kto wchodzi w interakcję z systemem AI, musi o tym wiedzieć. Organizacja musi **wdrożyć ludzki nadzór** — każda ważna decyzja musi być weryfikowana przez człowieka, który może ją zmienić. AI jest wsparciem decyzji, nie decyzją samą. Po wdrożeniu niezbędne jest **monitorowanie funkcjonowania** — czy system zachowuje się inaczej niż na testach? Czy pojawił się bias lub dyskryminacja? Czy użytkownicy zgłaszają błędy? Wreszcie, **każda decyzja musi być zapamiętana** — kiedy AI coś zrobiło, co dokładnie napisało i na jakiej podstawie.

### 3. Ryzyka ograniczone — wymogi transparencji

Systemy ryzyka ograniczonego to przede wszystkim te, które wchodzą w bezpośrednią interakcję z ludźmi — chatboty, asystenci AI, generatory tekstu czy edytory obrazów. Regulacja dla tej kategorii skupia się na przejrzystości — użytkownicy muszą wiedzieć, że rozmawiają z algorytmem, a nie człowiekiem. Przykłady obejmują ChatGPT, Claude, Gemini czy podobne systemy konwersacyjne, generatory tekstu piszące artykuły czy e-maile, tłumacze AI czy edytory obrazów takie jak Midjourney czy Stable Diffusion.

Wymogi dla systemów ryzyka ograniczonego są stosunkowo proste, ale obowiązkowe. Każdy chatbot lub asystent AI powinien się jasno **przedstawić jako bot, a nie człowiek**. Użytkownik powinien słyszeć od samego początku: „To jest sztuczna inteligencja." Organizacja musi **być szczera o limitach** — AI może się mylić, może halucynować, użytkownik powinien zawsze weryfikować ważne informacje. **Użytkownik musi mieć wyjście** — możliwość rozłączenia się z botem i rozmowy z człowiekiem. Wreszcie, **nie wolno manipulować** — AI nie powinno kłamać czy ukrywać informacji, aby przekonać użytkownika do czegoś.

### 4. Ryzyka minimalne — brak wymogów regulacyjnych

Systemy AI o minimalnym ryzyku dla praw i bezpieczeństwa obywateli nie podlegają specjalnym wymogom EU AI Act. Są to systemy, których potencjał do wyrządzenia szkody jest zaniedbywalny. Przykłady obejmują AI w grach komputerowych, filtry antyspamowe w skrzynkach pocztowych, systemy rekomendacyjne o niskim ryzyku czy inne algorytmy pomocnicze. Dla tych systemów organizacja nie musi spełniać żadnych szczególnych wymogów compliance.

---

## Modele GPAI: co to oznacza dla firm używających ChatGPT, Claude, Gemini {#gpai}

GPAI (General-Purpose AI) to Large Language Models — ChatGPT, Claude, Gemini i podobne systemy. Charakteryzują się zdolnością do wykonywania szerokiego spektrum zadań, a ich zachowanie w nowych sytuacjach jest trudne do dokładnego przewidzenia. Ta ogólna przydatność, połączona z nieprzewidywalnością, skłoniła Komisję Europejską do stworzenia odrębnego zestawu wymogów dla dostawców GPAI.

### Obowiązki dostawców Large Language Models

Dostawcy takich modeli — OpenAI, Anthropic, Google i inni — muszą spełnić nowe wymogi compliance. Muszą **dokumentować wszystkie aspekty** systemu — jak model funkcjonuje, jakimi danymi został wytrenowany, jakie testy bezpieczeństwa przeprowadzono, co model może robić i czego nie powinien robić. Muszą **testować potencjalne zagrożenia** — czy model generuje treści zakazane (mowę nienawiści, materiały przemocy, materiały eksploatacji dzieci), czy może być wykorzystany do naruszenia praw człowieka. Dostawcy muszą **raportować do Komisji** szczegóły techniczne — koszt treningu, liczbę parametrów, potencjalne zagrożenia. Muszą **publikować model card** — dokument wyjaśniający możliwości, ograniczenia i zagrożenia związane z modelem. Po wdrożeniu muszą **monitorować błędy i nieprawidłowości** — jakie problemy pojawiają się w praktyce, jakie halucynacje, jakie nieoczekiwane zachowania. Wreszcie, są zachęcani do **partycypacji w Kodeksie Dobrych Praktyk dla Generatywnej AI** opracowanym przez Komisję.

### Konsekwencje dla organizacji używającej ChatGPT lub Claude

Chociaż dostawca odpowiada za compliance, użytkownik również ma obowiązki. **Pierwszy krok to weryfikacja** — czy dostawca spełnia wymogi GPAI? (OpenAI i Anthropic aktywnie pracują nad compliance, ale proces się toczy). Drugi krok to **ocena use case'u** — czy aplikacja, którą planujesz, to wysokie ryzyka? Jeśli zamierzasz używać ChatGPT do pisania e-maili, to niskie ryzyka. Jeśli planujesz użyć go do selekcji CV kandydatów, to wysokie ryzyka. Trzeci krok to **implementacja ochrony** — jeśli use case ma wysokie ryzyka, musisz dodać ludzką weryfikację, monitoring błędów, prowadzenie logów decyzji.

> **Konkretny przykład:** Jeśli organizacja używa Claude do analizy CV i rankingowania kandydatów, to nie jest to zwykłe wykorzystanie narzędzia wspomagającego. To jest system AI do rekrutacji, który podejmuje decyzje o ludziach. Oznacza to obowiązek dokumentacji (jak dokładnie Claude rankinguje kandydatów, na jakich danych trenowany), obligatoryjny przegląd każdej decyzji przez zespół HR (człowiek zawsze może zmienić rekomendację), i możliwość wyjaśnienia kandydatowi (dlaczego został odrzucony — jakie były kryteria). To wymaga znacznie więcej pracy niż „uruchomić prompt i gotowe".

---

## Sześć praktycznych obszarów compliance — od dziś do sierpnia 2026 {#obszary}

Przejście od teorii do praktyki wymaga systematycznego podejścia. Każda organizacja powinna przeprowadzić przygotowanie metodycznie, pamiętając o czterech miesiącach pozostałych do pełnego egzekwowania.

### 1. Inwentaryzacja systemów AI — co rzeczywiście wykorzystujemy

Punkt wyjścia powinien być prosty: **gdzie w organizacji funkcjonuje sztuczna inteligencja?** To pytanie jest zaskakująco trudne, bo wiele systemów AI ukrywa się w istniejących narzędziach biznesowych. Warto przygotować kompleksową listę obejmującą modele LLM (Claude, ChatGPT, Gemini, otwarte modele takie jak Llama), systemy rekomendacyjne (algorytmy rankingujące klientów, produkty czy treści), systemy widzenia komputerowego (OCR czytający dokumenty, skanowanie faktur, rozpoznawanie obiektów), chatboty (customer service, wsparcie techniczne, interakcje z użytkownikami), systemy punktacji czy oceniające (ocena kandydatów, klientów, ryzyka), oraz modele predykcyjne (prognozowanie popytu, forecasting, szacowanie wartości).

Dla każdego systemu należy zanotować: kto jest dostawcą (OpenAI, Anthropic, wewnętrzne zespoły czy zewnętrzny vendor), wersja modelu (GPT-4, Claude 3, Cohere), etap wdrożenia (pilotaż czy produkcja), typ danych przetwarzanych (CV kandydatów, faktury, dane klientów), oraz typ decyzji wspieranych przez AI (ilościowe wskaźniki, rekomendacje, decyzje binarne typu tak/nie).

### 2. Ocena ryzyka — klasyfikacja systemów

Dla każdego zidentyfikowanego systemu AI należy przeprowadzić ocenę ryzyka, odpowiadając na następujące pytania:

**Czy AI podejmuje decyzje dotyczące fundamentalnych praw człowieka?** To pytanie dotyczy systemów używanych w rekrutacji, udzielaniu kredytów, ocenie zdolności edukacyjnych, decyzjach sądowych czy diagnozach medycznych. Jeśli odpowiedź to „tak", system należy do kategorii wysokiego ryzyka. **Czy AI wchodzi w bezpośrednią interakcję z ludźmi, nie ujawniając swojej roli?** Chatbot, który imituje człowieka bez jasnego ujawnienia, że to algorytm, to system ryzyka ograniczonego. **Czy AI ma dostęp do danych osobowych lub wrażliwych?** Jeśli system przetwarza dane biometryczne, informacje zdrowotne, historię finansową czy inne wrażliwe dane, to należy do wyższej kategorii ryzyka. **Czy decyzje AI mogą prowadzić do dyskryminacji?** Jeśli algorytm może odrzucić kandydata ze względu na pochodzenie, wiek lub płeć (nawet nieintencjonalnie, z powodu bias w danych treningowych), to system wymaga ścisłego nadzoru. **Czy błąd lub nieprawidłowe działanie AI mogłoby wyrządzić znaczną szkodę?** To dotyczy systemów zarządzających bezpieczeństwem infrastruktury krytycznej, transakcjami finansowymi czy diagnostyką medyczną.

Jeśli odpowiedź na jakiekolwiek z tych pytań to „tak", system należy do kategorii wysokiego ryzyka i wymaga dokumentacji, monitorowania oraz weryfikacji przez człowieka.

### 3. Dokumentacja techniczna — przygotowanie na wizytę audytora

Gdy audytor z Komisji Europejskiej pojawi się w biurze, powinien znaleźć kompleksową dokumentację. **Design document** powinien wyjaśniać, jak system funkcjonuje end-to-end, gdzie przechowywane są dane, w jaki sposób informacje przepływają przez system, jacy aktorzy mają dostęp do danych. Rysunki i diagramy architekturalne są tu niezbędne. **Data documentation** powinna szczegółowo opisywać dane użyte do treningu modelu, zawierać analizę potencjalnych bias w danych, metodologie weryfikacji jakości danych. To szczególnie ważne dla systemów wysokiego ryzyka i zakazanych. **Model card** to dokument opisujący możliwości i ograniczenia modelu — co model potrafi robić dobrze, w jakich scenariuszach się myli, jakie są zagrożenia związane z jego użyciem. Można go postrzegać jako „LinkedIn profil" modelu AI. **Testing report** opisuje, w jaki sposób testowano system — jakie scenariusze przełamywania bezpieczeństwa sprawdzano, jakie wyniki testów uzyskano, co się nie powiodło. To muszą być rzeczywiste testy, nie teoretyczne założenia. **Incident log** to szczerze prowadzony zapis wszystkich problemów, błędów i anomalii zaobserwowanych od momentu wdrożenia — jakie halucynacje pojawiły się w praktyce, jakie błędy zgłosili użytkownicy, jakie nieoczekiwane zachowania zaobserwowano.

Brak tej dokumentacji będzie postrzegany jako znaczące naruszenie wymogów compliance.

### 4. Przejrzystość — jawne komunikowanie obecności AI

Przejrzystość jest fundamentalnym wymogiem dla systemów ryzyka ograniczonego i wysokiego. Jeśli AI wchodzi w interakcję z ludźmi, ci ostatni muszą wiedzieć, z czym mają do czynienia. **Chatboty powinny się jasno przedstawić** — zwrot na początek konwersacji powinien brzmieć wyraźnie: „To jest asystent AI, służący pomocą w podstawowych pytaniach dotyczących oferowanych usług." Nie wolno im maskować się jako człowiek czy pracownik. **Zawartość wygenerowana przez AI powinna być oznaczona** — artykuły, e-maile, teksty czy obrazy wygenerowane przez narzędzia AI powinny być wyraźnie oznakowane jako „Wygenerowano przy użyciu sztucznej inteligencji" lub podobnie. **Limity muszą być jasno komunikowane** — użytkownik powinien wiedzieć, że AI może się mylić, może halucynować, może generować informacje brzmące wiarygodnie ale nieprawidłowe, i dlatego ważne jest weryfikowanie krytycznych informacji.

Przejrzystość to nie złożony proces techniczny — to kwestia uczciwości i jasnej komunikacji.

### 5. Ludzki nadzór — człowiek ostatecznie decyduje

W systemach wysokiego ryzyka człowiek zawsze musi być w pętli decyzyjnej — może weryfikować, korygować i finalnie zatwierdzać każdą decyzję wspieraną przez AI. W rekrutacji, zespół HR przegląda ranking kandydatów generowany przez AI i ma pełne prawo zmienić kolejność czy zaakceptować. Kandydat otrzymuje jasne wyjaśnienie kryteriów, na podstawie których dokonano wyboru. W decyzjach kredytowych, pracownik banku zawsze przegląda rekomendację AI przed wydaniem ostatecznej decyzji. Klient ma prawo odwołać się do człowieka i domagać się recenzji decyzji. W systemach wspierających decyzje sądowe, sędzia lub prokuratura sprawdzają rekomendacje AI, ale ostateczna decyzja należy zawsze do człowieka — AI jest narzędziem wspierającym proces decyzyjny, nie źródłem decyzji samej.

### 6. Monitoring post-wdrożenia — obserwacja w produkcji

Po wdrożeniu systemu AI w produkcji monitoring nie kończy się — w rzeczywistości dopiero się zaczyna. System powinien być obserwowany pod kątem zachowań odbiegających od przewidywań z fazy testowania. **Środowisko produkcyjne jest fundamentalnie inne od testów** — dane są bardziej zróżnicowane, scenariusze bardziej skomplikowane, obciążenie systemu wyższe. **Błędy, halucynacje i dziwne odpowiedzi powinny być rejestrowane** — nie jako anomalie do wymazania, ale jako informacja zwrotna dla zespołu. Każdy taki incident powinien być odnotowany z kontekstem — co wywołało błąd, jak go rozpoznano, jaki był wpływ na użytkownika. **Skargi i opinie użytkowników to cenna informacja** — mogą ujawnić problemy nie zauważone w testach. **Bias powinien być aktywnie szukany** — czy system dyskryminuje na bazie pochodzenia, płci, wieku, lub innych cech? Monitorowanie pod kątem nierównego traktowania grup użytkowników powinno być regularnym działaniem.

---

## Checklist: 10 kroków do zgodności — od teraz do sierpnia 2026 {#checklist}

Przygotowanie do compliance z EU AI Act można zorganizować w etapach. Cztery miesiące to wystarczająco dużo czasu, aby przeprowadzić kluczowe działania.

### Marzec–kwiecień 2026: Przygotowanie podstaw

Pierwszą czynnością powinno być **powołanie osoby odpowiedzialnej za compliance** — to może być General Counsel, CTO czy Chief AI Officer. Jedna osoba, jedna jasna odpowiedzialność. Następnie trzeba **przygotować kompleksową listę wszystkich systemów AI** w organizacji — wszystkie modele LLM, dostawcy, use case'i. Lista powinna być maksymalnie kompletna, bo pominięcie systemu w późniejszej ocenie będzie problemem. Trzecim krokiem jest **klasyfikacja każdego systemu** — dla każdego określić, czy to praktyka zakazana, wysokie ryzyka, ryzyka ograniczone czy minimalne.

### Maj–czerwiec 2026: Przygotowanie dokumentacji

Czwartym krokiem jest **opracowanie dokumentacji dla systemów wysokiego ryzyka** — design document, dokumentacja danych, raporty testów. Dokumentacja nie musi być idealna, ale musi być uczciwa. Piątym krokiem jest **identyfikacja i eliminacja praktyk zakazanych** — jeśli organizacja używa systemów punktacji społecznej, manipulacji psychologicznej czy biometrii bez zgody, muszą być usunięte lub całkowicie zmienione. Szóstym krokiem jest **wdrożenie ludzkiego nadzoru** — dla każdej ważnej decyzji wspieranej przez AI, człowiek musi mieć możliwość weryfikacji i zmienienia decyzji.

### Lipiec–sierpień 2026: Finalizacja i przygotowanie

Siódmym krokiem jest **wdrożenie systemu logowania błędów** — zapis tego, co się psuje, jakie błędy zgłaszają użytkownicy, jakie anomalie zaobserwowano. Ósmym krokiem jest **oznaczenie zawartości AI** — każdy chatbot powinien się przedstawić jako bot, każda wygenerowana zawartość powinna być wyraźnie oznaczona. Dziewiątym krokiem jest **weryfikacja umów z dostawcami** — czy OpenAI, Anthropic, Google w swoich warunkach serwisu potwierdzają compliance z wymogami GPAI? Dziesiątym i ostatnim krokiem jest **komunikacja wewnętrzna** — wyjaśnienie zespołowi, co to jest EU AI Act, jakie obowiązki to tworzy, jakie procesy się zmieniają.

> **Perspektywa długoterminowa:** Kary za niezgodność sięgają do €35 mln lub 7% przychodu rocznego — znacząco wyższe niż kary w ramach RODO. Pierwszy rok egzekwowania (2026–2027) będzie się skupiać na systemach wysokiego ryzyka (rekrutacja, kredyty, medycyna) i oczywistych naruszeniach (praktyki zakazane). Jeśli organizacja używa AI do rekrutacji czy udzielania kredytów, compliance jest priorytetem teraz.

---

## Specyfika dla Polski i branż {#specyfika}

### Dla firm sektora finansowego

Sektor finansowy jest szczególnie regulowany (RODO + PSD2 + MiFID II + AI Act). Dla banków, ubezpieczycieli, firm inwestycyjnych:

- Systemy AI do oceny kredytowej, inwestycyjnej, ubezpieczeniowej to wysokie ryzyka
- Wymagany jest explicable AI (możliwość wyjaśnienia każdej decyzji)
- Komplementarna regulacja: EBA (European Banking Authority) wydała guidance na AI w bankowości

### Dla firm e-commerce i marketingu

Rekomendacje produktów, personalizacja, targeting — to systemy ograniczonego ryzyka:

- Wymaga przejrzystości (użytkownik powinien wiedzieć, że system rekomenduje produkty)
- Nie wymaga ludzkiego nadzoru, ale wymaga monitorowania (czy system nie powoduje dyskryminacji na bazie np. pochodzenia)

### Dla firm technologicznych

Jeśli rozwijany jest AI jako produkt (np. SaaS z AI):

- Odpowiedzialność za compliance dotyczy producenta, jeśli jego produkt jest używany do wysokiego ryzyka
- Producent musi dostarczać dokumentację techniczną klientom
- Producent musi mieć Terms of Service informujące o ograniczeniach AI

### Dla firm HR i rekrutacji

Systemy do rekrutacji (CV screening, rozmowy wideo, personality assessment) to **wysokie ryzyka**:

- Wymagana dokumentacja techniczna
- Wymagany przegląd każdej decyzji przez człowieka
- Wymagane wyjaśnienia (kandydat powinien móc wiedzieć, dlaczego został odrzucony)

### Dla sektora publicznego i samorządów

Administracja publiczna musi być szczególnie czujna:

- Systemy do weryfikacji wniosków, przydziału zasiłków, licencji — wysokie ryzyka
- Wymaga dokumentacji, przejrzystości, możliwości apelacji
- Dostęp do najnowszych wytycznych Komisji

---

## Co dalej? Przygotowanie na kolejne fazy {#co-dalej}

Po wdrożeniu podstawowych działań compliance warto kontynuować edukację i monitorowanie zmian. **Wytyczne Komisji Europejskiej**, dostępne od lutego 2026, zawierają szczegółowe objaśnienia wymogów. Oryginalne dokumenty nie są napisane w języku wykluczającym laików — warto je przeczytać i zrozumieć specyficzne wymogi dla branży.

**Interakcja między RODO a AI Act** wymaga szczególnej uwagi. EU AI Act nie anuluje RODO — oba zbiory wymogów działają jednocześnie i niezależnie. Jeśli system AI przetwarza dane osobowe (a większość to robi), organizacja musi spełnić wymogi obu regulacji — zarówno ochrony danych, jak i bezpiecznego funkcjonowania AI. To wymaga skoordynowania działań compliance.

**Konsultacja z prawnikiem specjalizującym się w regulacji AI** może zaoszczędzić miesiące błędów. Każda branża (finanse, HR, medycyna, edukacja, sektor publiczny) ma inny profil ryzyka i inny zakres wymaganych działań. Godzina konsultacji na wczesnym etapie może zmienić całą strategię compliance.

Warte przeczytania są również artykuły branżowe — case study dotyczące compliance w konkretnych sektorach, matryce ryzyka dla typowych zastosowań AI, przykłady governance struktur. Rzeczywiste przykłady są bardziej przydatne niż teoretyczne ramy.

Wreszcie, warto **regularnie śledzić komunikaty i aktualizacje od Komisji Europejskiej**. EU AI Act będzie ewoluował — pojawiać się będą dodatkowe wytyczne, interpretacje, a być może zmiany. Organizacje, które na bieżąco monitorują zmiany będą mogły dostosować procesy zanim staną się obowiązkowe.

---

## Źródła

**Tagi:** `EU AI Act` · `compliance` · `regulacje` · `GPAI` · `governance` · `kary` · `RODO`

- [EU AI Act Implementation Timeline](https://artificialintelligenceact.eu/implementation-timeline/)
- [EC — Guidelines for GPAI providers](https://digital-strategy.ec.europa.eu/en/policies/guidelines-gpai-providers)
- [DLA Piper — Latest obligations under EU AI Act](https://www.dlapiper.com/en-us/insights/publications/2025/08/latest-wave-of-obligations-under-the-eu-ai-act-take-effect)
- [SIG — EU AI Act Summary January 2026](https://www.softwareimprovementgroup.com/blog/eu-ai-act-summary/)
