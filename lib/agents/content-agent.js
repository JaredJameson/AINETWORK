import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function generateMeta({ title, content }) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Jesteś redaktorem AI NETWORK — platforma wiedzy AI dla biznesu (PL).
Na podstawie poniższego artykułu wygeneruj:
- excerpt: 2-3 zdania, praktyczny, bez lania wody
- readingTime: szacowany czas czytania ("X min", zakładaj 200 słów/min)
Odpowiedz TYLKO JSON: { "excerpt": "...", "readingTime": "X min" }

Tytuł: ${title}

Treść:
${content.slice(0, 2000)}`
    }],
  });

  try {
    return JSON.parse(message.content[0].text);
  } catch {
    return { excerpt: '', readingTime: '10 min' };
  }
}

export async function generateFullArticle({ title, rawContent, onChunk }) {
  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Jesteś ekspertem AI piszącym dla polskich przedsiębiorców i menedżerów.
Napisz artykuł na podstawie poniższego researchu.
Styl: praktyczny, konkretny, bez marketingowego bełkotu, po polsku.
Format: Markdown z nagłówkami H2/H3, listy wypunktowane tam gdzie logiczne, max 800 słów.
Zacznij od razu od treści — bez wstępnych komentarzy.

Research:
${rawContent}`
    }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onChunk(chunk.delta.text);
    }
  }

  const finalMessage = await stream.finalMessage();
  return finalMessage.content[0].text;
}
