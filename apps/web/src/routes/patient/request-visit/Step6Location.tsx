import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import type { WizardState } from './types';

export function Step6Location({
  state,
  onChange,
  errors,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  errors: Partial<Record<'addressLine1' | 'city' | 'state' | 'postalCode', string>>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Location</h2>
      <p className="text-sm text-slate-600">Where should the doctor come?</p>
      <Field label="Additional notes (optional)">
        <Input value={state.notes} onChange={(e) => onChange({ notes: e.target.value })} />
      </Field>
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
    </div>
  );
}
