import { useState } from 'react';
import type { VisitDto } from '@ghar-doc/shared';
import { useAssignableDoctors, useAssignDoctor } from '../../hooks/useAssignDoctor';
import { Button } from '../../components/ui/Button';

export function AssignDoctorDialog({ visit, onClose }: { visit: VisitDto; onClose: () => void }) {
  const { data: doctors, isLoading } = useAssignableDoctors();
  const assignDoctor = useAssignDoctor();
  const [doctorId, setDoctorId] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h3 className="mb-1 text-base font-semibold text-slate-800">Assign a doctor</h3>
        <p className="mb-4 text-sm text-slate-500">{visit.reasonForVisit}</p>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading available doctors…</p>
        ) : !doctors || doctors.length === 0 ? (
          <p className="mb-4 text-sm text-slate-500">No approved and available doctors right now.</p>
        ) : (
          <select
            className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Select a doctor…</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.firstName} {d.lastName} · {d.specialty}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!doctorId || assignDoctor.isPending}
            onClick={() => assignDoctor.mutate({ visitId: visit.id, doctorId }, { onSuccess: onClose })}
          >
            {assignDoctor.isPending ? 'Assigning…' : 'Assign'}
          </Button>
        </div>
      </div>
    </div>
  );
}
