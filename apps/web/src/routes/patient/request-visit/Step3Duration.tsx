import { DURATION_LABELS, DurationOption, SYMPTOM_CATEGORIES, type DurationOption as DurationOptionType } from '@ghar-doc/shared';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step3Duration({
  state,
  onUpdateDetail,
}: {
  state: WizardState;
  onUpdateDetail: (symptomId: string, patch: Partial<{ duration: DurationOptionType }>) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">When did this start?</h2>
      <p className="text-sm text-slate-600">For each symptom, tell us when it started.</p>
      {state.selectedSymptomIds.map((symptomId) => {
        const detail = state.symptomDetails[symptomId];
        return (
          <div key={symptomId} className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">{symptomLabel(symptomId)}</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(DurationOption).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdateDetail(symptomId, { duration: opt })}
                  className={`min-h-[38px] rounded-full border px-3 py-1.5 text-xs font-medium ${
                    detail?.duration === opt
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {DURATION_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
