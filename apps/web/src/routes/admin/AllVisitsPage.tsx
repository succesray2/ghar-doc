import { useState } from 'react';
import type { VisitDto, VisitStatus } from '@ghar-doc/shared';
import { useAllVisits } from '../../hooks/useVisits';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AssignDoctorDialog } from './AssignDoctorDialog';

const STATUS_FILTERS: { label: string; value: VisitStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'En route', value: 'EN_ROUTE' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export function AllVisitsPage() {
  const [status, setStatus] = useState<VisitStatus | undefined>(undefined);
  const { data: visits, isLoading } = useAllVisits(status);
  const [assigning, setAssigning] = useState<VisitDto | null>(null);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setStatus(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === f.value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading visits…</p>
      ) : !visits || visits.length === 0 ? (
        <p className="text-slate-500">No visits found.</p>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <Card key={visit.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <VisitStatusBadge status={visit.status} />
                  <span className="text-xs text-slate-400">{new Date(visit.requestedAt).toLocaleString()}</span>
                </div>
                <p className="font-medium text-slate-800">{visit.reasonForVisit}</p>
                <p className="text-sm text-slate-500">
                  {visit.addressLine1}, {visit.city}, {visit.state} {visit.postalCode}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Patient: {visit.patient.firstName} {visit.patient.lastName}
                </p>
                {visit.doctor && (
                  <p className="text-sm text-slate-600">
                    Doctor: {visit.doctor.firstName} {visit.doctor.lastName}
                  </p>
                )}
              </div>
              {visit.status === 'REQUESTED' && <Button onClick={() => setAssigning(visit)}>Assign doctor</Button>}
            </Card>
          ))}
        </div>
      )}

      {assigning && <AssignDoctorDialog visit={assigning} onClose={() => setAssigning(null)} />}
    </div>
  );
}
