// Shared renderer for TermsPage and PrivacyPolicyPage — same lightweight
// markdown convention as apps/marketing/src/components/LegalDocument.tsx
// and apps/mobile/src/screens/StaticInfoScreen.tsx (# / ## / ### headers,
// "* " bullets, whole-line **bold**, "| a | b |" tables). Not a general
// markdown renderer, just enough structure for a long legal document to
// actually scan on a page.
export function LegalDocument({ body }: { body: string }) {
  return <div className="mx-auto max-w-3xl px-4 py-12">{renderBody(body)}</div>;
}

function renderBody(body: string) {
  const lines = body.split('\n');
  const blocks: JSX.Element[] = [];
  let list: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={key} className="my-3 list-disc space-y-1.5 pl-5 text-slate-600">
        {list.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {stripBold(item)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const [header, ...rows] = tableRows;
    blocks.push(
      <div key={key} className="my-4 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {header.map((cell, i) => (
                <th key={i} className="px-4 py-2.5 font-semibold text-slate-800">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-slate-200">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.length === 0) return;

    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      if (!cells.every((c) => /^-+$/.test(c))) tableRows.push(cells);
      return;
    }
    flushTable(`table-${i}`);

    if (line.startsWith('* ') || line.startsWith('- ')) {
      list.push(line.slice(2));
      return;
    }
    flushList(`list-${i}`);

    if (line === '---') {
      blocks.push(<hr key={i} className="my-6 border-slate-200" />);
    } else if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={i} className="mt-6 text-base font-semibold text-slate-800">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={i} className="mt-8 text-xl font-bold text-slate-800">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={i} className="mb-2 text-2xl font-extrabold text-slate-800">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      blocks.push(
        <p key={i} className="mt-3 font-semibold text-slate-800">
          {line.slice(2, -2)}
        </p>,
      );
    } else {
      blocks.push(
        <p key={i} className="mt-3 leading-relaxed text-slate-600">
          {stripBold(line)}
        </p>,
      );
    }
  });
  flushList('list-end');
  flushTable('table-end');

  return blocks;
}

function stripBold(text: string) {
  return text.replace(/\*\*/g, '');
}
