import { SYMPTOM_CATEGORIES, TRIAGE_MESSAGES, type TriageResult } from '@ghar-doc/shared';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

const RELATION_LABEL: Record<WizardState['bookingFor'], string> = {
  SELF: 'Myself',
  PARENT: 'Parent',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  OTHER_FAMILY: 'Other family member',
};

export function Step7DoctorRequest({ state, result }: { state: WizardState; result: TriageResult | null }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Confirm your request</h2>
      <p className="text-sm text-slate-600">
        A GharDoc doctor will review this request. Your final clinical assessment always comes from them, not this form.
      </p>

      <div className="space-y-3 rounded-lg border border-slate-200 p-4 text-sm">
        <Row label="For">{RELATION_LABEL[state.bookingFor]}{state.bookingFor !== 'SELF' && state.patientName ? ` — ${state.patientName}` : ''}</Row>
        <Row label="Symptoms">
          {[...state.selectedSymptomIds.map(symptomLabel), state.otherSymptomText].filter(Boolean).join(', ')}
        </Row>
        <Row label="Address">
          {[state.addressLine1, state.addressLine2, state.city, state.state, state.postalCode].filter(Boolean).join(', ')}
        </Row>
        {result && (
          <Row label="Priority">
            {result.priority === 'RED' ? 'Urgent — reviewed by you already' : result.priority === 'ORANGE' ? 'Priority assessment' : 'Routine home visit'}
          </Row>
        )}
      </div>

      {result && result.priority !== 'GREEN' && (
        <p className="text-xs text-slate-500">{TRIAGE_MESSAGES[result.priority]}</p>
      )}

      <p className="text-xs text-slate-400">
        Requesting a visit does not dispatch a doctor automatically — an admin reviews and assigns one, and you'll see updates on
        My Visits.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-slate-700">{children}</p>
    </div>
  );
}
