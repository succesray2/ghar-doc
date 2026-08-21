import { Role, getLegalTransitions, type VisitStatus } from '@ghar-doc/shared';
import { useAssignedVisits, useUpdateVisitStatus } from '../../hooks/useVisits';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { TriagePriorityBadge } from '../../components/TriagePriorityBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const NEXT_ACTION_LABEL: Partial<Record<VisitStatus, string>> = {
  PROVIDER_ACCEPTED: 'Accept',
  PROVIDER_DECLINED: 'Decline',
  EN_ROUTE: 'Mark en route',
  ARRIVED: 'Mark arrived',
  IN_PROGRESS: 'Start visit',
  COMPLETED: 'Mark completed',
};

export function AssignedVisitsPage() {
  const { data: visits, isLoading } = useAssignedVisits();
  const updateStatus = useUpdateVisitStatus();

  if (isLoading) return <p className="text-slate-500">Loading your assigned visits…</p>;
  if (!visits || visits.length === 0) {
    return <p className="text-slate-500">No visits assigned to you yet.</p>;
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => {
        const nextTransitions = getLegalTransitions(visit.status, Role.DOCTOR).filter((t) => t.to !== 'CANCELLED');
        return (
          <Card key={visit.id}>
            <div className="mb-2 flex items-center gap-2">
              <TriagePriorityBadge priority={visit.priority} />
              <VisitStatusBadge status={visit.status} />
              <span className="text-xs text-slate-400">{new Date(visit.requestedAt).toLocaleString()}</span>
            </div>
            <p className="font-medium text-slate-800">{visit.reasonForVisit}</p>
            <p className="text-sm text-slate-500">
              {visit.addressLine1}, {visit.city}, {visit.state} {visit.postalCode}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Patient: {visit.patient.firstName} {visit.patient.lastName}
              {visit.patient.phone ? ` · ${visit.patient.phone}` : ''}
            </p>
            {visit.bookingFor !== 'SELF' && (
              <p className="text-sm text-slate-600">
                Booked for: {visit.patientName}
                {visit.patientAge ? `, age ${visit.patientAge}` : ''} by {visit.caregiverName} · {visit.caregiverPhone}
              </p>
            )}
            {visit.triageSummary && visit.triageSummary.matchedRedFlags.length > 0 && (
              <p className="mt-1 text-xs text-red-600">
                Flagged: {visit.triageSummary.matchedRedFlags.map((f) => f.label).join('; ')}
              </p>
            )}
            {nextTransitions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {nextTransitions.map((t) => (
                  <Button
                    key={t.to}
                    variant={t.to === 'PROVIDER_DECLINED' ? 'danger' : 'primary'}
                    onClick={() => {
                      if (t.to === 'PROVIDER_DECLINED' && !window.confirm('Decline this visit request?')) return;
                      updateStatus.mutate({ id: visit.id, status: t.to });
                    }}
                    disabled={updateStatus.isPending}
                  >
                    {NEXT_ACTION_LABEL[t.to] ?? t.to}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
