import { useState } from 'react';
import type { PhysiotherapistListItemDto, PhysiotherapistStatus } from '@ghar-doc/shared';
import { usePhysiotherapists, useUpdatePhysiotherapistStatus } from '../../hooks/usePhysiotherapists';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CreatePhysiotherapistDialog } from './CreatePhysiotherapistDialog';

const STATUS_FILTERS: { label: string; value: PhysiotherapistStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

const STATUS_BADGE: Record<PhysiotherapistStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  SUSPENDED: 'bg-slate-200 text-slate-600',
};

export function PhysiotherapistsDirectoryPage() {
  const [status, setStatus] = useState<PhysiotherapistStatus | undefined>(undefined);
  const { data: physiotherapists, isLoading } = usePhysiotherapists(status);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
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
        <Button onClick={() => setCreating(true)}>+ Add physiotherapist</Button>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading physiotherapists…</p>
      ) : !physiotherapists || physiotherapists.length === 0 ? (
        <p className="text-slate-500">No physiotherapists found.</p>
      ) : (
        <div className="space-y-4">
          {physiotherapists.map((physio) => (
            <PhysiotherapistCard key={physio.id} physio={physio} />
          ))}
        </div>
      )}

      {creating && <CreatePhysiotherapistDialog onClose={() => setCreating(false)} />}
    </div>
  );
}

function PhysiotherapistCard({ physio }: { physio: PhysiotherapistListItemDto }) {
  const updateStatus = useUpdatePhysiotherapistStatus();
  const [reasonPromptOpen, setReasonPromptOpen] = useState(false);
  const [reason, setReason] = useState('');

  const submit = (target: PhysiotherapistStatus) => {
    updateStatus.mutate(
      { id: physio.id, status: target, reason: reason.trim() || undefined },
      { onSuccess: () => { setReasonPromptOpen(false); setReason(''); } },
    );
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[physio.status]}`}>
            {physio.status}
          </span>
          <p className="font-medium text-slate-800">
            {physio.firstName} {physio.lastName} · {physio.specialty}
          </p>
          <p className="text-sm text-slate-500">{physio.email}</p>
          <p className="text-sm text-slate-500">
            License {physio.licenseNumber}
            {physio.yearsExperience != null ? ` · ${physio.yearsExperience} yrs experience` : ''}
          </p>
          {physio.statusReason && <p className="mt-1 text-sm italic text-slate-500">"{physio.statusReason}"</p>}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {physio.status === 'SUSPENDED' ? (
            <Button onClick={() => submit('ACTIVE')} disabled={updateStatus.isPending}>
              Reactivate
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setReasonPromptOpen(true)} disabled={updateStatus.isPending}>
              Suspend
            </Button>
          )}
        </div>
      </div>

      {reasonPromptOpen && (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <label className="mb-1 block text-xs font-medium text-slate-600">Reason for suspension (optional)</label>
          <textarea
            className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setReasonPromptOpen(false); setReason(''); }}>
              Cancel
            </Button>
            <Button variant="danger" disabled={updateStatus.isPending} onClick={() => submit('SUSPENDED')}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
