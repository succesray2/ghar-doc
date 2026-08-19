import type { VisitStatus } from '@ghar-doc/shared';
import clsx from 'clsx';

const STYLES: Record<VisitStatus, string> = {
  REQUESTED: 'bg-amber-100 text-amber-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  EN_ROUTE: 'bg-indigo-100 text-indigo-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-brand-100 text-brand-700',
  CANCELLED: 'bg-slate-200 text-slate-600',
};

const LABELS: Record<VisitStatus, string> = {
  REQUESTED: 'Requested',
  ASSIGNED: 'Assigned',
  EN_ROUTE: 'Doctor en route',
  IN_PROGRESS: 'Visit in progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
