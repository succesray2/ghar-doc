import {
  DURATION_LABELS,
  DurationOption,
  SEVERITY_LABELS,
  SeverityOption,
  SYMPTOM_CATEGORIES,
  type DurationOption as DurationOptionType,
  type SeverityOption as SeverityOptionType,
} from '@ghar-doc/shared';
import type { WizardState } from './types';

const SEVERITY_ICON: Record<SeverityOptionType, string> = {
  MILD: '🟢',
  MODERATE: '🟡',
  SEVERE: '🔴',
  NOT_SURE: '❓',
};

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step3DurationSeverity({
  state,
  onUpdateDetail,
}: {
  state: WizardState;
  onUpdateDetail: (symptomId: string, patch: Partial<{ duration: DurationOptionType; severity: SeverityOptionType }>) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">How long, and how severe?</h2>
      {state.selectedSymptomIds.map((symptomId) => {
        const detail = state.symptomDetails[symptomId];
        return (
          <div key={symptomId} className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">{symptomLabel(symptomId)}</p>

            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Duration</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {Object.values(DurationOption).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdateDetail(symptomId, { duration: opt })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    detail?.duration === opt
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {DURATION_LABELS[opt]}
                </button>
              ))}
            </div>

            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Severity</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(SeverityOption).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdateDetail(symptomId, { severity: opt })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    detail?.severity === opt
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {SEVERITY_ICON[opt]} {SEVERITY_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
