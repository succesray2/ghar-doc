import { useState } from 'react';
import type { DoctorListItemDto, DoctorStatus } from '@ghar-doc/shared';
import { useDoctors, useUpdateDoctorStatus } from '../../hooks/useDoctors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const STATUS_FILTERS: { label: string; value: DoctorStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

const STATUS_BADGE: Record<DoctorStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  SUSPENDED: 'bg-slate-200 text-slate-600',
};

export function DoctorApplicationsPage() {
  const [status, setStatus] = useState<DoctorStatus | undefined>('PENDING');
  const { data: doctors, isLoading } = useDoctors(status);

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
        <p className="text-slate-500">Loading doctors…</p>
      ) : !doctors || doctors.length === 0 ? (
        <p className="text-slate-500">No doctors found.</p>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: DoctorListItemDto }) {
  const updateStatus = useUpdateDoctorStatus();
  const [reasonPromptFor, setReasonPromptFor] = useState<DoctorStatus | null>(null);
  const [reason, setReason] = useState('');

  const submit = (target: DoctorStatus) => {
    updateStatus.mutate(
      { id: doctor.id, status: target, reason: reason.trim() || undefined },
      { onSuccess: () => { setReasonPromptFor(null); setReason(''); } },
    );
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[doctor.status]}`}>
              {doctor.status}
            </span>
          </div>
          <p className="font-medium text-slate-800">
            {doctor.firstName} {doctor.lastName} · {doctor.specialty}
          </p>
          <p className="text-sm text-slate-500">{doctor.email}</p>
          <p className="text-sm text-slate-500">
            License {doctor.licenseNumber}
            {doctor.yearsExperience != null ? ` · ${doctor.yearsExperience} yrs experience` : ''}
          </p>
          {doctor.statusReason && (
            <p className="mt-1 text-sm italic text-slate-500">"{doctor.statusReason}"</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {doctor.status !== 'APPROVED' && (
            <Button onClick={() => submit('APPROVED')} disabled={updateStatus.isPending}>
              Approve
            </Button>
          )}
          {doctor.status !== 'REJECTED' && doctor.status === 'PENDING' && (
            <Button variant="danger" onClick={() => setReasonPromptFor('REJECTED')} disabled={updateStatus.isPending}>
              Reject
            </Button>
          )}
          {doctor.status === 'APPROVED' && (
            <Button variant="danger" onClick={() => setReasonPromptFor('SUSPENDED')} disabled={updateStatus.isPending}>
              Suspend
            </Button>
          )}
        </div>
      </div>

      {reasonPromptFor && (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Reason for {reasonPromptFor === 'REJECTED' ? 'rejection' : 'suspension'} (optional)
          </label>
          <textarea
            className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setReasonPromptFor(null); setReason(''); }}>
              Cancel
            </Button>
            <Button variant="danger" disabled={updateStatus.isPending} onClick={() => submit(reasonPromptFor)}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
