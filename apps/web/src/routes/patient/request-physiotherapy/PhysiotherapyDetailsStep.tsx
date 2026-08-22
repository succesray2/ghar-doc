import { MOBILITY_LEVEL_LABELS, MobilityLevel, PHYSIOTHERAPY_CONDITION_LABELS, PhysiotherapyConditionType } from '@ghar-doc/shared';
import clsx from 'clsx';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import type { PhysiotherapyWizardState } from './types';

const CONDITION_TYPES = Object.values(PhysiotherapyConditionType);
const MOBILITY_LEVELS = Object.values(MobilityLevel);

export function PhysiotherapyDetailsStep({
  state,
  onChange,
  errors,
}: {
  state: PhysiotherapyWizardState;
  onChange: (patch: Partial<PhysiotherapyWizardState>) => void;
  errors: Partial<Record<'conditionType' | 'otherConditionText' | 'mobilityLevel', string>>;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Tell us about the condition</h2>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">What's the condition?</p>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ conditionType: type })}
              className={clsx(
                'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                state.conditionType === type
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50',
              )}
            >
              {PHYSIOTHERAPY_CONDITION_LABELS[type]}
            </button>
          ))}
        </div>
        {errors.conditionType && <p className="mt-1 text-xs text-red-600">{errors.conditionType}</p>}
      </div>

      {state.conditionType === 'OTHER' && (
        <Field label="Describe the condition" error={errors.otherConditionText}>
          <Input value={state.otherConditionText} onChange={(e) => onChange({ otherConditionText: e.target.value })} />
        </Field>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Current mobility level</p>
        <div className="grid grid-cols-2 gap-2">
          {MOBILITY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ mobilityLevel: level })}
              className={clsx(
                'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                state.mobilityLevel === level
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50',
              )}
            >
              {MOBILITY_LEVEL_LABELS[level]}
            </button>
          ))}
        </div>
        {errors.mobilityLevel && <p className="mt-1 text-xs text-red-600">{errors.mobilityLevel}</p>}
      </div>

      <Field label="What would you like this session to achieve? (optional)">
        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          rows={3}
          placeholder="e.g. reduce pain, rebuild strength after surgery, improve walking"
          value={state.sessionGoal}
          onChange={(e) => onChange({ sessionGoal: e.target.value })}
        />
      </Field>
    </div>
  );
}
