import {
  ABDOMINAL_PAIN_IDS,
  ASSOCIATED_SIGN_QUESTIONS,
  BODY_REGION_OPTIONS,
  BP_EXTREME_IDS,
  DIABETES_CATEGORY_IDS,
  FEVER_IDS,
  SEVERITY_LABELS,
  SeverityOption,
  SYMPTOM_CATEGORIES,
  type SeverityOption as SeverityOptionType,
} from '@ghar-doc/shared';
import { Input } from '../../../components/ui/Input';
import type { SymptomDetail, WizardState } from './types';

const SEVERITY_ICON: Record<SeverityOptionType, string> = {
  MILD: '🟢',
  MODERATE: '🟡',
  SEVERE: '🔴',
  VERY_SEVERE: '🔴',
  NOT_SURE: '❓',
};

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step4Severity({
  state,
  onUpdateDetail,
  onSetSign,
}: {
  state: WizardState;
  onUpdateDetail: (symptomId: string, patch: Partial<SymptomDetail>) => void;
  onSetSign: (symptomId: string, signId: string, value: boolean) => void;
}) {
  const symptomsWithQuestions = state.selectedSymptomIds.filter((id) => ASSOCIATED_SIGN_QUESTIONS[id]);
  const hasDiabetesSymptom = state.selectedSymptomIds.some((id) => DIABETES_CATEGORY_IDS.includes(id));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">How severe is it?</h2>

      {state.selectedSymptomIds.map((symptomId) => {
        const detail = state.symptomDetails[symptomId];
        return (
          <div key={symptomId} className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">{symptomLabel(symptomId)}</p>

            <div className="mb-2 flex flex-wrap gap-1.5">
              {Object.values(SeverityOption)
                .filter((o) => o !== 'VERY_SEVERE')
                .map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onUpdateDetail(symptomId, { severity: opt })}
                    className={`min-h-[38px] rounded-full border px-3 py-1.5 text-xs font-medium ${
                      detail?.severity === opt
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {SEVERITY_ICON[opt]} {SEVERITY_LABELS[opt]}
                  </button>
                ))}
            </div>

            {ABDOMINAL_PAIN_IDS.includes(symptomId) && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Where is the pain?</p>
                <div className="flex flex-wrap gap-1.5">
                  {BODY_REGION_OPTIONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onUpdateDetail(symptomId, { bodyRegion: r.id })}
                      className={`min-h-[38px] rounded-full border px-3 py-1.5 text-xs font-medium ${
                        detail?.bodyRegion === r.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {FEVER_IDS.includes(symptomId) && (
              <div className="mt-3 flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Temperature (optional)</label>
                  <Input
                    type="number"
                    value={detail?.numericReadings?.temperature ?? ''}
                    onChange={(e) =>
                      onUpdateDetail(symptomId, {
                        numericReadings: { ...detail?.numericReadings, temperature: e.target.value ? Number(e.target.value) : undefined },
                      })
                    }
                  />
                </div>
                <div className="flex gap-1 pb-0.5">
                  {(['C', 'F'] as const).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, temperatureUnit: unit } })}
                      className={`min-h-[38px] rounded-md border px-3 text-xs font-medium ${
                        detail?.numericReadings?.temperatureUnit === unit
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-300 text-slate-600'
                      }`}
                    >
                      °{unit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {BP_EXTREME_IDS.includes(symptomId) && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Systolic (optional)</label>
                  <Input
                    type="number"
                    value={detail?.numericReadings?.systolic ?? ''}
                    onChange={(e) =>
                      onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, systolic: e.target.value ? Number(e.target.value) : undefined } })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Diastolic (optional)</label>
                  <Input
                    type="number"
                    value={detail?.numericReadings?.diastolic ?? ''}
                    onChange={(e) =>
                      onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, diastolic: e.target.value ? Number(e.target.value) : undefined } })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {hasDiabetesSymptom && (
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Does the patient have known diabetes?</p>
          <div className="flex gap-1.5">
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  state.selectedSymptomIds
                    .filter((id) => DIABETES_CATEGORY_IDS.includes(id))
                    .forEach((id) => onUpdateDetail(id, { knownCondition: opt.value }));
                }}
                className={`min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-medium ${
                  state.symptomDetails[state.selectedSymptomIds.find((id) => DIABETES_CATEGORY_IDS.includes(id)) ?? '']?.knownCondition === opt.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {symptomsWithQuestions.length > 0 && (
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-semibold text-slate-700">A few more questions</h3>
          {symptomsWithQuestions.map((symptomId) => {
            const questions = ASSOCIATED_SIGN_QUESTIONS[symptomId];
            const detail = state.symptomDetails[symptomId];
            return (
              <div key={symptomId} className="rounded-lg border border-slate-200 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">About the {symptomLabel(symptomId).toLowerCase()}</p>
                <div className="space-y-1">
                  {questions.map((q) => {
                    const value = detail?.associatedSigns?.[q.id];
                    return (
                      <div key={q.id} className="flex items-center justify-between gap-3 py-1 text-sm text-slate-700">
                        <span>{q.label}</span>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSetSign(symptomId, q.id, true)}
                            className={`min-h-[38px] rounded-md border px-3 text-xs font-medium ${
                              value === true ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => onSetSign(symptomId, q.id, false)}
                            className={`min-h-[38px] rounded-md border px-3 text-xs font-medium ${
                              value === false ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
