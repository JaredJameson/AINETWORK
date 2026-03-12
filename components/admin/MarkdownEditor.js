'use client';
import { useState } from 'react';
import { marked } from 'marked';

const toolbarButtons = [
  { label: 'B', action: (sel) => `**${sel}**` },
  { label: 'I', action: (sel) => `*${sel}*` },
  { label: 'H2', action: (sel) => `\n## ${sel}\n` },
  { label: 'H3', action: (sel) => `\n### ${sel}\n` },
  { label: '> Quote', action: (sel) => `\n> ${sel}\n` },
  { label: '---', action: () => '\n---\n' },
];

export default function MarkdownEditor({ value, onChange }) {
  const [tab, setTab] = useState('edit');

  function insertMarkdown(fn) {
    const textarea = document.getElementById('md-editor');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || 'tekst';
    const result = fn(selected);
    const newVal = value.slice(0, start) + result + value.slice(end);
    onChange(newVal);
  }

  const btnStyle = {
    padding: '5px 10px', background: '#222', border: '1px solid rgba(255,255,255,0.1)',
    color: '#CCC', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '4px', padding: '8px', background: '#1A1A1A',
        borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
        {toolbarButtons.map(btn => (
          <button key={btn.label} type="button" onClick={() => insertMarkdown(btn.action)} style={btnStyle}>
            {btn.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          {['edit', 'preview'].map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              ...btnStyle,
              background: tab === t ? '#F5C518' : '#222',
              color: tab === t ? '#111' : '#CCC',
            }}>
              {t === 'edit' ? 'Edytor' : 'Podgląd'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'edit' ? (
        <textarea
          id="md-editor"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', minHeight: '400px', padding: '16px',
            background: '#111', color: '#DDD', border: 'none',
            fontSize: '14px', fontFamily: 'monospace', lineHeight: 1.7,
            resize: 'vertical', boxSizing: 'border-box', outline: 'none',
          }}
        />
      ) : (
        <div
          className="article-body"
          style={{ minHeight: '400px', padding: '24px', background: '#111', color: '#DDD' }}
          dangerouslySetInnerHTML={{ __html: marked(value || '') }}
        />
      )}
    </div>
  );
}
