import type { ReactNode } from 'react';
import clsx from 'clsx';

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={clsx('max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-600">{eyebrow}</p>}
      <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-ink-600">{description}</p>}
    </div>
  );
}
