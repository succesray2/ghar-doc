import { NURSING_SERVICE_LABELS, NursingServiceType } from '@ghar-doc/shared';
import clsx from 'clsx';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import type { NursingWizardState } from './types';

const SERVICE_TYPES = Object.values(NursingServiceType);

export function NursingDetailsStep({
  state,
  onChange,
  errors,
}: {
  state: NursingWizardState;
  onChange: (patch: Partial<NursingWizardState>) => void;
  errors: Partial<Record<'nursingServiceType' | 'otherServiceText', string>>;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">What nursing care do you need?</h2>
      <div className="grid grid-cols-2 gap-2">
        {SERVICE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange({ nursingServiceType: type })}
            className={clsx(
              'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
              state.nursingServiceType === type
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50',
            )}
          >
            {NURSING_SERVICE_LABELS[type]}
          </button>
        ))}
      </div>
      {errors.nursingServiceType && <p className="text-xs text-red-600">{errors.nursingServiceType}</p>}

      {state.nursingServiceType === 'OTHER' && (
        <Field label="Describe what you need" error={errors.otherServiceText}>
          <Input value={state.otherServiceText} onChange={(e) => onChange({ otherServiceText: e.target.value })} />
        </Field>
      )}

      <Field label="Care notes (optional)">
        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          rows={3}
          placeholder="Anything the nurse should know — e.g. an existing prescription, wound location, allergy"
          value={state.careNotes}
          onChange={(e) => onChange({ careNotes: e.target.value })}
        />
      </Field>
    </div>
  );
}
