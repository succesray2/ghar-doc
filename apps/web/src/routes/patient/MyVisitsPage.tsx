import { Role, VisitStatus, isTransitionAllowed } from '@ghar-doc/shared';
import { useMyVisits, useCancelVisit } from '../../hooks/useVisits';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function MyVisitsPage() {
  const { data: visits, isLoading } = useMyVisits();
  const cancelVisit = useCancelVisit();

  if (isLoading) return <p className="text-slate-500">Loading your visits…</p>;
  if (!visits || visits.length === 0) {
    return <p className="text-slate-500">You haven&apos;t requested any visits yet.</p>;
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => {
        const canCancel = isTransitionAllowed(visit.status, VisitStatus.CANCELLED, Role.PATIENT);
        return (
          <Card key={visit.id} className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <VisitStatusBadge status={visit.status} />
                <span className="text-xs text-slate-400">{new Date(visit.requestedAt).toLocaleString()}</span>
              </div>
              <p className="font-medium text-slate-800">{visit.reasonForVisit}</p>
              <p className="text-sm text-slate-500">
                {visit.addressLine1}, {visit.city}
              </p>
              {visit.doctor && (
                <p className="mt-1 text-sm text-slate-600">
                  Doctor: {visit.doctor.firstName} {visit.doctor.lastName}
                </p>
              )}
            </div>
            {canCancel && (
              <Button variant="danger" onClick={() => cancelVisit.mutate({ id: visit.id })} disabled={cancelVisit.isPending}>
                Cancel
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
