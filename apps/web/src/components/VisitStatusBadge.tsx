import type { VisitStatus } from '@ghar-doc/shared';
import clsx from 'clsx';

const STYLES: Record<VisitStatus, string> = {
  REQUESTED: 'bg-amber-100 text-amber-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  PROVIDER_ACCEPTED: 'bg-blue-100 text-blue-800',
  PROVIDER_DECLINED: 'bg-red-100 text-red-700',
  EN_ROUTE: 'bg-indigo-100 text-indigo-800',
  ARRIVED: 'bg-indigo-100 text-indigo-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-brand-100 text-brand-700',
  CANCELLED: 'bg-slate-200 text-slate-600',
  NO_PROVIDER_AVAILABLE: 'bg-red-100 text-red-700',
};

const LABELS: Record<VisitStatus, string> = {
  REQUESTED: 'Requested',
  ASSIGNED: 'Assigned',
  PROVIDER_ACCEPTED: 'Provider accepted',
  PROVIDER_DECLINED: 'Provider declined',
  EN_ROUTE: 'Doctor en route',
  ARRIVED: 'Doctor arrived',
  IN_PROGRESS: 'Visit in progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_PROVIDER_AVAILABLE: 'No provider available',
};

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
