import { useState } from 'react';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-navy-900">{question}</span>
        <Plus
          size={18}
          className={clsx('flex-shrink-0 text-teal-600 transition-transform duration-200', open && 'rotate-45')}
          aria-hidden="true"
        />
      </button>
      {open && <p className="mt-2 text-sm leading-relaxed text-ink-600">{answer}</p>}
    </div>
  );
}
