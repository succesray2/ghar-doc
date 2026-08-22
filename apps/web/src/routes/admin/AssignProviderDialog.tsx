import { useState } from 'react';
import type { DoctorListItemDto, NurseListItemDto, PhysiotherapistListItemDto, VisitDto } from '@ghar-doc/shared';
import { useAssignableDoctors, useAssignableNurses, useAssignablePhysiotherapists, useAssignProvider } from '../../hooks/useAssignProvider';
import { Button } from '../../components/ui/Button';

const COPY: Record<VisitDto['serviceType'], { title: string; noneFound: string; placeholder: string }> = {
  DOCTOR_VISIT: { title: 'Assign a doctor', noneFound: 'No approved and available doctors right now.', placeholder: 'Select a doctor…' },
  NURSING: { title: 'Assign a nurse', noneFound: 'No active nurses right now.', placeholder: 'Select a nurse…' },
  PHYSIOTHERAPY: {
    title: 'Assign a physiotherapist',
    noneFound: 'No active physiotherapists right now.',
    placeholder: 'Select a physiotherapist…',
  },
};

export function AssignProviderDialog({ visit, onClose }: { visit: VisitDto; onClose: () => void }) {
  const doctors = useAssignableDoctors();
  const nurses = useAssignableNurses();
  const physiotherapists = useAssignablePhysiotherapists();
  const assignProvider = useAssignProvider();
  const [providerId, setProviderId] = useState('');

  const { data: options, isLoading } =
    visit.serviceType === 'NURSING' ? nurses : visit.serviceType === 'PHYSIOTHERAPY' ? physiotherapists : doctors;
  const copy = COPY[visit.serviceType];

  const optionLabel = (option: DoctorListItemDto | NurseListItemDto | PhysiotherapistListItemDto) => {
    const detail = 'specialty' in option ? option.specialty : option.qualification;
    return `${option.firstName} ${option.lastName} · ${detail}`;
  };

  const submit = () => {
    const payload =
      visit.serviceType === 'NURSING'
        ? { visitId: visit.id, nurseId: providerId }
        : visit.serviceType === 'PHYSIOTHERAPY'
          ? { visitId: visit.id, physiotherapistId: providerId }
          : { visitId: visit.id, doctorId: providerId };
    assignProvider.mutate(payload, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h3 className="mb-1 text-base font-semibold text-slate-800">{copy.title}</h3>
        <p className="mb-4 text-sm text-slate-500">{visit.reasonForVisit}</p>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading options…</p>
        ) : !options || options.length === 0 ? (
          <p className="mb-4 text-sm text-slate-500">{copy.noneFound}</p>
        ) : (
          <select
            className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
          >
            <option value="">{copy.placeholder}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {optionLabel(option)}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!providerId || assignProvider.isPending} onClick={submit}>
            {assignProvider.isPending ? 'Assigning…' : 'Assign'}
          </Button>
        </div>
      </div>
    </div>
  );
}
