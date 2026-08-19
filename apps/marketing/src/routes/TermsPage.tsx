import { TERMS_AND_CONDITIONS } from '../data/legal';
import { usePageMeta } from '../hooks/usePageMeta';

// Same lightweight markdown convention as apps/mobile/src/screens/StaticInfoScreen.tsx
// (# / ## / ### headers, "* " bullets, whole-line **bold**) — not a general
// markdown renderer, just enough structure for a 40-section legal document
// to actually scan on a page.
function renderBody(body: string) {
  const lines = body.split('\n');
  const blocks: JSX.Element[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={key} className="my-3 list-disc space-y-1.5 pl-5 text-ink-600">
        {list.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {stripBold(item)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.length === 0) return;

    if (line.startsWith('* ') || line.startsWith('- ')) {
      list.push(line.slice(2));
      return;
    }
    flushList(`list-${i}`);

    if (line === '---') {
      blocks.push(<hr key={i} className="my-6 border-line" />);
    } else if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={i} className="mt-6 text-base font-semibold text-navy-900">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={i} className="mt-8 text-xl font-bold text-navy-900">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={i} className="mb-2 text-2xl font-extrabold text-navy-900">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      blocks.push(
        <p key={i} className="mt-3 font-semibold text-navy-900">
          {line.slice(2, -2)}
        </p>,
      );
    } else {
      blocks.push(
        <p key={i} className="mt-3 leading-relaxed text-ink-600">
          {stripBold(line)}
        </p>,
      );
    }
  });
  flushList('list-end');

  return blocks;
}

function stripBold(text: string) {
  return text.replace(/\*\*/g, '');
}

export function TermsPage() {
  usePageMeta('Terms & Conditions', "Ghar Doc's terms and conditions.");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">{renderBody(TERMS_AND_CONDITIONS)}</div>
  );
}
