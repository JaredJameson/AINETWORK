import EventPage from '../EventPage';

export const metadata = {
  title: 'AI NETWORK #2 — Sprzedaż, Wideo AI, Polski LLM | AI NETWORK',
  description: 'Druga edycja AI NETWORK — AI w sprzedaży i marketingu, wideo AI w HR i obsłudze klienta oraz polski model językowy Bielik.',
};

const allEvents = [
  { date: '26 lutego 2025', title: 'AI NETWORK #1 — Prompting, Bezpieczeństwo, Prawo', location: 'Inkubator Starter, Bydgoszcz', href: '/wydarzenia/an1' },
  { date: '27 maja 2025', title: 'AI NETWORK #2 — Sprzedaż, Wideo AI, Polski LLM', location: 'Inkubator Starter, Bydgoszcz', href: '/wydarzenia/an2', active: true },
  { date: '25 września 2025', title: 'AI NETWORK #3 — Compliance, Zmiana, Automatyzacje', location: 'WSB Merito, Bydgoszcz', href: '/wydarzenia/an3' },
];

export default function AN2Page() {
  return (
    <EventPage
      brand="AI NETWORK #2"
      title="Sprzedaż, Wideo AI, Polski LLM"
      subtitle="Sprzedaż, Wideo AI, Polski LLM"
      date="27 maja 2025"
      time="17:00 – 20:00"
      location="Bydgoszcz"
      venue="Inkubator Starter"
      status="Zakończone"
      heroImage="/assets/images/events/AINETWORK_2.png"
      accent="#F5C518"
      introLead='Druga edycja AI NETWORK była spotkaniem „z ziemi": mniej o zachwycie technologią, więcej o tym, <strong>jak przekuć AI w przewagę w sprzedaży, marketingu i HR</strong>, a przy tym nie wpaść w typowe pułapki: chaos komunikacyjny, ryzyka danych, koszty i brak dopasowania narzędzi do realiów firmy.'
      intro="Wspólnym mianownikiem trzech prelekcji było jedno zdanie: AI nie wygrywa sama — wygrywa zespół, który umie się z nią komunikować, mądrze ją osadzić w procesach i świadomie dobrać model do kontekstu (język, bezpieczeństwo, koszty)."
      speakers={[
        {
          name: 'Jarosław Jaśkowiak',
          role: 'Właściciel Architekci AI, Doradca AI',
          topicLabel: 'Sprzedaż i marketing',
          topic: 'Transformacja AI w Sprzedaży i Marketingu',
          image: '/assets/images/speakers/Start-Up_Bydgoszcz_2025-05-27_prelegent_1.jpg',
          desc: 'Zamiast opowiadać o możliwościach AI w teorii, prelekcja pokazała kluczową kompetencję przyszłości: umiejętność skutecznej komunikacji z narzędziami AI (precyzyjne pytania, trafne polecenia, właściwa interpretacja wyników). W praktyce przełożyło się to na konkretne zastosowania: usprawnienie prospectingu i generowania leadów, wsparcie w domykaniu sprzedaży, a w marketingu — lepsza personalizacja, większy zasięg działań i podnoszenie ROI dzięki pracy „człowiek + AI" jako zgrany duet.',
        },
        {
          name: 'Marcin Andrzejewski',
          role: 'Ekspert AI w komunikacji i wideo',
          topicLabel: 'Wideo AI i cyfrowe emanacje',
          topic: 'Trzej jeźdźcy A(I)pokalipsy…',
          image: '/assets/images/speakers/Start-Up_Bydgoszcz_2025-05-27_prelegent_2.jpg',
          desc: 'Bez sprzedażowego nadęcia, za to z mocnym naciskiem na wdrożenia gotowe na jutro. Uczestnicy zobaczyli, jak AI (zwłaszcza w obszarze wideo i komunikacji) potrafi zmieniać trzy strategiczne obszary firmy: zarządzanie i HR (przywództwo, komunikacja wewnętrzna), obsługa klienta (dostępność i jakość wsparcia) oraz dział handlowy (pierwsza linia kontaktu i powtarzalne elementy procesu). Główna idea: AI w tej formie potrafi uwolnić czas ludzi, zwiększyć efektywność i jednocześnie redukować koszty.',
        },
        {
          name: 'Maciej Szymański',
          role: 'BIELIK.AI',
          topicLabel: 'Lokalny LLM',
          topic: 'Dlaczego Polska potrzebuje własnego LLM?',
          image: '/assets/images/speakers/Start-Up_Bydgoszcz_2025-05-27_prelegent_3.jpg',
          desc: 'Prelekcja porządkowała temat, który coraz częściej pojawia się w firmach: AI to nie tylko ChatGPT — a wybór modelu ma konsekwencje. Uczestnicy dostali klarowne trzy przewagi lokalnych modeli językowych: lepsze dopasowanie do języka polskiego (precyzja komunikacji), bezpieczeństwo i zgodność z regulacjami (kontekst danych i wymagań prawnych), koszty i integracja (łatwiejsze dopasowanie do procesów, potencjalnie niższy koszt w określonych scenariuszach).',
        },
      ]}
      networking={{
        title: 'Networking i wymiana doświadczeń',
        desc: 'AI NETWORK #2 było spotkaniem dla tych, którzy chcą mniej slajdów o „rewolucji", a więcej odpowiedzi na pytanie: co wdrożyć, jak wdrożyć i jak to policzyć, żeby miało sens w sprzedaży, marketingu i HR.',
      }}
      conclusion={{
        title: 'Wspólny wniosek z AI NETWORK #2',
        content: `<p>Jeśli chcesz, żeby AI dawała przewagę, potrzebujesz trzech elementów:</p>
<ul>
<li>kompetencji zespołu (komunikacja z AI jako umiejętność operacyjna),</li>
<li>wdrożeń „tu i teraz" (procesy i formaty, które dają szybki efekt, np. wideo/komunikacja),</li>
<li>świadomego wyboru modelu (język, bezpieczeństwo, koszty, integracja).</li>
</ul>
<p>To była mocna kropka nad i: <strong>przewaga AI rośnie, gdy technologia jest dopasowana do realiów rynku i organizacji.</strong></p>`,
      }}
      gallery={[
        '/assets/images/events/IMG_20250527_171638570_HDR.jpg',
        '/assets/images/events/IMG_20250527_171647530_HDR.jpg',
        '/assets/images/events/IMG_20250527_174540972_HDR.jpg',
        '/assets/images/events/IMG_20250527_181939087_HDR.jpg',
        '/assets/images/events/IMG_20250527_182849813_HDR.jpg',
      ]}
      allEvents={allEvents}
    />
  );
}
