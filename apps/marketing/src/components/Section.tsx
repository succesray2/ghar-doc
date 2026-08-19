import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Section({
  id,
  tone = 'white',
  className,
  children,
}: {
  id?: string;
  tone?: 'white' | 'soft' | 'dark';
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={clsx(
        'scroll-mt-20 py-16 md:py-24',
        tone === 'soft' && 'bg-bg-soft',
        tone === 'dark' && 'bg-navy-900 text-white',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4">{children}</div>
    </section>
  );
}
