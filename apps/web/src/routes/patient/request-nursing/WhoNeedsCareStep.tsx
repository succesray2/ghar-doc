import type { BookingRelation } from '@ghar-doc/shared';
import clsx from 'clsx';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import type { NursingWizardState } from './types';

const RELATIONS: { value: BookingRelation; label: string }[] = [
  { value: 'SELF', label: 'Myself' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'CHILD', label: 'Child' },
  { value: 'OTHER_FAMILY', label: 'Other family member' },
];

export function WhoNeedsCareStep({
  state,
  onChange,
}: {
  state: NursingWizardState;
  onChange: (patch: Partial<NursingWizardState>) => void;
}) {
  const isSomeoneElse = state.bookingFor !== 'SELF';

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Who needs nursing care?</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {RELATIONS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange({ bookingFor: r.value })}
            className={clsx(
              'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
              state.bookingFor === r.value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {isSomeoneElse && (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">A few details about who this visit is for, and how the nurse can reach you.</p>
          <Field label="Patient's name">
            <Input value={state.patientName} onChange={(e) => onChange({ patientName: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Patient's age">
              <Input type="number" min={0} value={state.patientAge} onChange={(e) => onChange({ patientAge: e.target.value })} />
            </Field>
            <Field label="Patient's sex (optional)">
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={state.patientSex}
                onChange={(e) => onChange({ patientSex: e.target.value })}
              >
                <option value="">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
          </div>
          <Field label="Your name (the person booking)">
            <Input value={state.caregiverName} onChange={(e) => onChange({ caregiverName: e.target.value })} />
          </Field>
          <Field label="Your phone number">
            <Input type="tel" value={state.caregiverPhone} onChange={(e) => onChange({ caregiverPhone: e.target.value })} />
          </Field>
        </div>
      )}
    </div>
  );
}
