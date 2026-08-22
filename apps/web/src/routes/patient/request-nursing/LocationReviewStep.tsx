import { NURSING_SERVICE_LABELS } from '@ghar-doc/shared';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import type { NursingWizardState } from './types';

const RELATION_LABEL: Record<NursingWizardState['bookingFor'], string> = {
  SELF: 'Myself',
  PARENT: 'Parent',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  OTHER_FAMILY: 'Other family member',
};

export function LocationReviewStep({
  state,
  onChange,
  errors,
}: {
  state: NursingWizardState;
  onChange: (patch: Partial<NursingWizardState>) => void;
  errors: Partial<Record<'addressLine1' | 'city' | 'state' | 'postalCode', string>>;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Location &amp; review</h2>
      <Field label="Address line 1" error={errors.addressLine1}>
        <Input value={state.addressLine1} onChange={(e) => onChange({ addressLine1: e.target.value })} />
      </Field>
      <Field label="Address line 2 (optional)">
        <Input value={state.addressLine2} onChange={(e) => onChange({ addressLine2: e.target.value })} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="City" error={errors.city}>
          <Input value={state.city} onChange={(e) => onChange({ city: e.target.value })} />
        </Field>
        <Field label="State" error={errors.state}>
          <Input value={state.state} onChange={(e) => onChange({ state: e.target.value })} />
        </Field>
        <Field label="Postal code" error={errors.postalCode}>
          <Input value={state.postalCode} onChange={(e) => onChange({ postalCode: e.target.value })} />
        </Field>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-200 p-4 text-sm">
        <Row label="For">
          {RELATION_LABEL[state.bookingFor]}
          {state.bookingFor !== 'SELF' && state.patientName ? ` — ${state.patientName}` : ''}
        </Row>
        <Row label="Service">{state.nursingServiceType ? NURSING_SERVICE_LABELS[state.nursingServiceType] : '—'}</Row>
      </div>

      <p className="text-xs text-slate-400">
        Requesting nursing care does not dispatch a nurse automatically — an admin reviews and assigns one, and you'll see updates
        on My Visits.
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
