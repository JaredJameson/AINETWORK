import EventPage from '../EventPage';

export const metadata = {
  title: 'AI NETWORK #1 — Prompting, Bezpieczeństwo, Prawo | AI NETWORK',
  description: 'Pierwsza edycja spotkań AI NETWORK — praktyczny start z inżynierii promptów, bezpieczeństwa danych i prawa AI.',
};

const allEvents = [
  { date: '26 lutego 2025', title: 'AI NETWORK #1 — Prompting, Bezpieczeństwo, Prawo', location: 'Inkubator Starter, Bydgoszcz', href: '/wydarzenia/an1', active: true },
  { date: '27 maja 2025', title: 'AI NETWORK #2 — Sprzedaż, Wideo AI, Polski LLM', location: 'Inkubator Starter, Bydgoszcz', href: '/wydarzenia/an2' },
  { date: '25 września 2025', title: 'AI NETWORK #3 — Compliance, Zmiana, Automatyzacje', location: 'WSB Merito, Bydgoszcz', href: '/wydarzenia/an3' },
];

export default function AN1Page() {
  return (
    <EventPage
      brand="AI NETWORK #1"
      title="Prompting, Bezpieczeństwo, Prawo"
      subtitle="Prompting, Bezpieczeństwo, Prawo"
      date="26 lutego 2025"
      time="17:00 – 20:00"
      location="Bydgoszcz"
      venue="Inkubator Starter"
      status="Zakończone"
      heroImage="/assets/images/events/AINETWORK_1.png"
      accent="#F5C518"
      introLead='Pierwsza edycja AI NETWORK była zaprojektowana jako <strong>praktyczny start dla firm i osób, które chcą korzystać z AI mądrze</strong>: nie tylko „co AI potrafi", ale jak z niej korzystać skutecznie, bezpiecznie i zgodnie z prawem.'
      intro="Spotkanie poprowadziło uczestników przez trzy kluczowe obszary, które w realnym wdrożeniu zawsze idą razem: kompetencje (prompting) → bezpieczeństwo danych → regulacje i ryzyka prawne."
      speakers={[
        {
          name: 'Jarosław Jaśkowiak',
          role: 'Właściciel Architekci AI, Doradca AI',
          topicLabel: 'Prompting w praktyce',
          topic: 'Jak rozmawiać z ChatGPT? Inżynieria promptów w praktyce',
          image: '/assets/images/speakers/speaker_an1_1.webp',
          desc: 'Wystąpienie otwierające poprowadził Jarosław Jaśkowiak, pokazując w praktyce jak formułować polecenia i kontekst, by modele językowe dawały odpowiedzi precyzyjne i użyteczne biznesowo. Uczestnicy poznali zasady budowania skutecznych promptów, pracę na przykładach oraz sposoby prowadzenia „złożonych rozmów", które zamieniają ChatGPT w realne wsparcie w pracy — od analizy, przez tworzenie treści, po porządkowanie informacji i podejmowanie decyzji.',
        },
        {
          name: 'Gracjan Kątek',
          role: 'Specjalista ds. Bezpieczeństwa AI',
          topicLabel: 'Bezpieczeństwo danych',
          topic: 'Jak korzystać z ChatGPT bez ryzyka wycieków',
          image: '/assets/images/speakers/speaker_an1_2.webp',
          desc: 'W drugiej części Gracjan Kątek skupił się na pytaniu, które zwykle pojawia się jako pierwsze w firmach: co dzieje się z danymi, gdy używamy narzędzi AI i jak w praktyce ograniczyć ryzyko wycieku informacji. Prelekcja porządkowała zasady bezpiecznego korzystania z modeli językowych, pokazywała typowe błędy (nieświadome „wrzucanie" wrażliwych danych) oraz strategie ochrony firmowych zasobów — tak, aby AI wspierała biznes, a nie generowała ryzyko.',
        },
        {
          name: 'Igor Wilczek',
          role: 'Radca Prawny, Specjalista AI i RODO',
          topicLabel: 'Prawo i odpowiedzialność',
          topic: 'AI w firmie bez min prawnych',
          image: '/assets/images/speakers/speaker_an1_3.webp',
          desc: 'Trzecią prelekcję poprowadził Igor Wilczek, omawiając kluczowe zagadnienia prawne związane z użyciem AI w biznesie: odpowiedzialność za decyzje podejmowane z udziałem AI, prawa do treści generowanych przez modele, a także najważniejsze regulacje (w tym RODO i AI Act) oraz to, jak przygotować firmę na zmiany. Uczestnicy dostali praktyczną mapę ryzyk i dobrych praktyk, które pomagają wdrażać AI zgodnie z prawem i minimalizować zagrożenia.',
        },
      ]}
      networking={{
        title: 'Moderowany networking: społeczność, nie tylko prelekcje',
        desc: 'Istotnym elementem spotkania był moderowany networking, w którym uczestnicy mogli krótko opowiedzieć o swoich doświadczeniach z AI i wskazać obszary, w których szukają wsparcia lub inspiracji. To właśnie ta część budowała fundament AI NETWORK: wymianę doświadczeń, kontakty, pomysły na współpracę i projekty, które zaczynają się od rozmowy.',
      }}
      conclusion={{
        title: 'Wspólny wniosek z AI NETWORK #1',
        content: `<p>Aby AI realnie pomogła w firmie, nie wystarczy „znać narzędzie". Trzeba:</p>
<ul>
<li>umieć dobrze komunikować potrzeby (prompting i kontekst),</li>
<li>zadbać o bezpieczeństwo danych i zasady korzystania,</li>
<li>rozumieć ramy prawne i odpowiedzialność.</li>
</ul>
<p>To była edycja, która ustawiła standard całego cyklu: <strong>praktyka + bezpieczeństwo + świadomość ryzyk</strong> — zanim wejdziemy w automatyzacje i większe wdrożenia.</p>`,
      }}
      gallery={[
        '/assets/images/events/DSC03020-2.jpg',
        '/assets/images/events/DSC03045-2.jpg',
        '/assets/images/events/DSC03051-2.jpg',
        '/assets/images/events/DSC03055.jpg',
        '/assets/images/events/DSC03104.jpg',
        '/assets/images/events/DSC03145.jpg',
        '/assets/images/events/DSC03172.jpg',
        '/assets/images/events/Obraz2.jpg',
      ]}
      allEvents={allEvents}
    />
  );
}
