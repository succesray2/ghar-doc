import type { TriagePriority } from '@ghar-doc/shared';
import clsx from 'clsx';

const STYLES: Record<TriagePriority, string> = {
  RED: 'bg-red-100 text-red-800',
  ORANGE: 'bg-orange-100 text-orange-800',
  GREEN: 'bg-emerald-100 text-emerald-700',
};

const LABELS: Record<TriagePriority, string> = {
  RED: 'Urgent',
  ORANGE: 'Priority',
  GREEN: 'Routine',
};

export function TriagePriorityBadge({ priority }: { priority: TriagePriority }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STYLES[priority])}>
      {LABELS[priority]}
    </span>
  );
}
