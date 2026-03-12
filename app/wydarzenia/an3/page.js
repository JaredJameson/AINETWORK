import EventPage from '../EventPage';

export const metadata = {
  title: 'AI NETWORK #3 — Compliance, Zmiana, Automatyzacje | AI NETWORK',
  description: 'Trzecia edycja AI NETWORK — zmiana organizacyjna, compliance i interdyscyplinarne zastosowania AI w biznesie.',
};

const allEvents = [
  { date: '26 lutego 2025', title: 'AI NETWORK #1 — Prompting, Bezpieczeństwo, Prawo', location: 'Inkubator Starter, Bydgoszcz', href: '/wydarzenia/an1' },
  { date: '27 maja 2025', title: 'AI NETWORK #2 — Sprzedaż, Wideo AI, Polski LLM', location: 'Inkubator Starter, Bydgoszcz', href: '/wydarzenia/an2' },
  { date: '25 września 2025', title: 'AI NETWORK #3 — Compliance, Zmiana, Automatyzacje', location: 'WSB Merito, Bydgoszcz', href: '/wydarzenia/an3', active: true },
];

export default function AN3Page() {
  return (
    <EventPage
      brand="AI NETWORK #3"
      title="Compliance, Zmiana, Automatyzacje"
      subtitle="Compliance, Zmiana, Automatyzacje"
      date="25 września 2025"
      time="17:00 – 20:00"
      location="Bydgoszcz"
      venue="WSB Merito"
      status="Zakończone"
      heroImage="/assets/images/events/AINETWORK_3.png"
      accent="#F5C518"
      introLead='Podczas trzeciej edycji spotkania w Bydgoszczy rozmawialiśmy o tym, <strong>jak wdrażać AI w firmach odpowiedzialnie</strong>: tak, żeby z jednej strony przyspieszać procesy i automatyzować pracę, a z drugiej nie wywrócić organizacji zmianą, nie wpaść w pułapki compliance i bezpieczeństwa, oraz nie przepalić budżetu na „AI dla samego AI".'
      intro="Wydarzenie poprowadziło uczestników przez trzy perspektywy, które w praktyce decydują o sukcesie wdrożeń:"
      speakers={[
        {
          name: 'Izabela Mazurek-Turska',
          role: 'Senior People & Culture Partner w Booksy',
          topicLabel: 'HR i transformacja',
          topic: 'Zmiana zaczyna się od ludzi',
          image: '/assets/images/speakers/speaker1.png',
          desc: 'Konferencję otworzyła Izabela Mazurek-Turska, pokazując od kuchni, jak wygląda opór wobec zmian i co dzieje się w zespołach, gdy technologia staje się katalizatorem transformacji. Wybrzmiało mocno, że procesy i narzędzia można wdrożyć szybko — ale powodzenie transformacji zależy od tego, czy liderzy potrafią przeprowadzić ludzi przez lęk, niepewność i zmianę nawyków.',
        },
        {
          name: 'Jarosław Jaśkowiak',
          role: 'Właściciel Architekci AI, Doradca AI',
          topicLabel: 'Compliance i automatyzacje',
          topic: 'Compliance i „minimalizm AI" w realnym biznesie',
          image: '/assets/images/speakers/speaker2.png',
          desc: 'W drugiej części Jarosław Jaśkowiak przedstawił podejście „minimalizmu AI" w automatyzacjach: AI tylko tam, gdzie daje realną wartość, a resztę dowozi prosta logika procesowa (np. reguły / if-else) i dobrze zaprojektowane workflow. Sporo miejsca poświęcono też temu, co w firmach najczęściej „wywraca" wdrożenia: ryzykom danych, bezpieczeństwu, wymaganiom compliance oraz organizacyjnym barierom, które często są ważniejsze niż sama technologia.',
        },
        {
          name: 'Nicholaos Kościński',
          role: 'Twórca i Strateg Cyfrowy',
          topicLabel: 'Design, 3D, fotogrametria',
          topic: 'Interdyscyplinarność: AI jako narzędzie twórcze',
          image: '/assets/images/speakers/speaker3.png',
          desc: 'Na koniec Nicholaos Kościński pokazał inspirującą stronę technologii generatywnych: AI jako narzędzie tworzenia nowych form i języków estetyki — w połączeniu z drukiem 3D i fotogrametrią. To była mocna puenta: AI nie jest wyłącznie „produktywnością i optymalizacją", ale także sposobem myślenia i eksperymentowania, który może dawać przewagę tam, gdzie liczy się kreatywność i innowacja.',
        },
      ]}
      panel={{
        title: 'AI w praktyce — głos ekspertów i praktyków',
        desc: 'Ważnym elementem spotkania był panel dyskusyjny, w którym udział wzięli eksperci i praktycy wykorzystujący AI w różnych branżach. Rozmowa koncentrowała się na realnych doświadczeniach z wdrożeń, barierach organizacyjnych i strategiach, które działają w polskich firmach.',
        topics: [
          'Jak przekonać zarząd do inwestycji w AI?',
          'Bezpieczeństwo danych a szybkość wdrożenia',
          'AI w MŚP — od czego zacząć i jak nie przepalić budżetu?',
          'Rola lidera w transformacji AI',
        ],
        participants: [
          { name: 'Wojciech Małkus', role: 'Współwłaściciel Procompens, Menadżer i dyplomowany Coach', poster: '/assets/images/events/panelista-5.png' },
          { name: 'Andrzej Szomszor', role: 'Senior QA Engineer w Brainly, trener i mentor — AI first', poster: '/assets/images/events/panelista-6.png' },
          { name: 'Emilia Florek', role: 'CyberSec & AI lawyer, radczyni prawna', poster: '/assets/images/events/panelista-7.png' },
          { name: 'Waldemar Tylicki', role: 'CFO Graform — praktyk implementacji AI w procesach', poster: '/assets/images/events/panelista-8.png' },
        ],
      }}
      networking={{
        title: 'Networking i wymiana doświadczeń',
        desc: 'AI NETWORK #3 było spotkaniem dla tych, którzy chcą wdrażać AI odpowiedzialnie — z uwzględnieniem ludzi, regulacji i realnych ograniczeń budżetowych. Uczestnicy wymieniali się doświadczeniami z wdrożeń, barierami organizacyjnymi i strategiami, które działają w polskich firmach.',
      }}
      conclusion={{
        title: 'Wspólny wniosek z AI NETWORK #3',
        content: `<p>Jeśli chcesz, żeby AI dawała przewagę, potrzebujesz trzech elementów:</p>
<ul>
<li>ludzi gotowych na zmianę (liderzy, którzy przeprowadzą zespoły przez transformację),</li>
<li>pragmatycznego podejścia do automatyzacji (AI tylko tam, gdzie daje realną wartość + compliance),</li>
<li>otwartości na nowe formy myślenia (AI jako narzędzie twórcze, nie tylko optymalizacyjne).</li>
</ul>
<p>To była edycja, która pokazała, że <strong>przewaga AI rośnie, gdy technologia jest wdrażana odpowiedzialnie — z uwzględnieniem ludzi, regulacji i kreatywności.</strong></p>`,
      }}
      gallery={[
        '/assets/images/events/13.png',
        '/assets/images/events/14.png',
        '/assets/images/events/17.png',
        '/assets/images/events/1758839438214.jpg',
        '/assets/images/events/21.png',
        '/assets/images/events/23.png',
      ]}
      allEvents={allEvents}
    />
  );
}
