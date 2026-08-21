import { ASSOCIATED_SIGN_QUESTIONS, SYMPTOM_CATEGORIES } from '@ghar-doc/shared';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step4AssociatedSigns({
  state,
  onSetSign,
}: {
  state: WizardState;
  onSetSign: (symptomId: string, signId: string, value: boolean) => void;
}) {
  const symptomsWithQuestions = state.selectedSymptomIds.filter((id) => ASSOCIATED_SIGN_QUESTIONS[id]);

  if (symptomsWithQuestions.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-800">Any warning signs?</h2>
        <p className="text-sm text-slate-500">No additional questions for the symptoms you selected — continue to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Any warning signs?</h2>
      {symptomsWithQuestions.map((symptomId) => {
        const questions = ASSOCIATED_SIGN_QUESTIONS[symptomId];
        const detail = state.symptomDetails[symptomId];
        return (
          <div key={symptomId} className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">About your {symptomLabel(symptomId).toLowerCase()}</p>
            <div className="space-y-2">
              {questions.map((q) => {
                const value = detail?.associatedSigns?.[q.id];
                return (
                  <div key={q.id} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                    <span>{q.label}</span>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSetSign(symptomId, q.id, true)}
                        className={`rounded-md border px-3 py-1 text-xs font-medium ${
                          value === true ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => onSetSign(symptomId, q.id, false)}
                        className={`rounded-md border px-3 py-1 text-xs font-medium ${
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
  );
}
