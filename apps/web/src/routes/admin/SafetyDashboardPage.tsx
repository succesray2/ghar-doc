import { useSafetyStats } from '../../hooks/useVisits';
import { Card } from '../../components/ui/Card';

export function SafetyDashboardPage() {
  const { data: stats, isLoading } = useSafetyStats();

  if (isLoading) return <p className="text-slate-500">Loading safety stats…</p>;
  if (!stats) return <p className="text-slate-500">Could not load safety stats.</p>;

  const total = stats.byPriority.RED + stats.byPriority.ORANGE + stats.byPriority.GREEN;

  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">Dispatch-priority breakdown across all visits ever requested.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total requests" value={total} />
        <StatCard label="Urgent (RED)" value={stats.byPriority.RED} tone="text-red-700" />
        <StatCard label="Priority (ORANGE)" value={stats.byPriority.ORANGE} tone="text-orange-700" />
        <StatCard label="Routine (GREEN)" value={stats.byPriority.GREEN} tone="text-emerald-700" />
      </div>

      <h3 className="mb-2 mt-6 text-sm font-semibold text-slate-700">Currently unassigned, by priority</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Urgent, unassigned" value={stats.unassignedByPriority.RED} tone="text-red-700" />
        <StatCard label="Priority, unassigned" value={stats.unassignedByPriority.ORANGE} tone="text-orange-700" />
        <StatCard label="Routine, unassigned" value={stats.unassignedByPriority.GREEN} tone="text-emerald-700" />
        <StatCard label="Cancelled (all time)" value={stats.cancelled} />
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone ?? 'text-slate-800'}`}>{value}</p>
    </Card>
  );
}
