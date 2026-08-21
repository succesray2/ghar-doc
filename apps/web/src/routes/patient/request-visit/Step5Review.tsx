import { SYMPTOM_CATEGORIES, TRIAGE_MESSAGES, type TriageResult } from '@ghar-doc/shared';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step5Review({
  state,
  result,
  isLoading,
  acknowledged,
  onAcknowledgeChange,
}: {
  state: WizardState;
  result: TriageResult | null;
  isLoading: boolean;
  acknowledged: boolean;
  onAcknowledgeChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Review</h2>

      <div className="rounded-lg border border-slate-200 p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Symptoms selected</p>
        <p className="text-sm text-slate-700">
          {state.selectedSymptomIds.map(symptomLabel).join(', ')}
          {state.otherSymptomText && (state.selectedSymptomIds.length > 0 ? `, ${state.otherSymptomText}` : state.otherSymptomText)}
        </p>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Checking your answers…</p>}

      {!isLoading && result && (
        <div
          className={`rounded-lg border p-4 ${
            result.priority === 'RED'
              ? 'border-red-300 bg-red-50'
              : result.priority === 'ORANGE'
                ? 'border-orange-300 bg-orange-50'
                : 'border-emerald-300 bg-emerald-50'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              result.priority === 'RED' ? 'text-red-800' : result.priority === 'ORANGE' ? 'text-orange-800' : 'text-emerald-800'
            }`}
          >
            {TRIAGE_MESSAGES[result.priority]}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            This is a service-prioritization signal, not a diagnosis. A GharDoc doctor is responsible for your actual clinical
            assessment.
          </p>

          {result.priority === 'RED' && (
            <div className="mt-4 space-y-3 border-t border-red-200 pt-4">
              <p className="text-sm font-semibold text-red-800">Don't wait for an app — call for immediate help.</p>
              <a
                href="tel:108"
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Call 108 (Ambulance)
              </a>
              <p className="text-xs text-slate-600">
                108 is India's free, nationwide emergency ambulance service — available 24/7, independent of GharDoc.
              </p>
              <label className="flex items-start gap-2 pt-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  checked={acknowledged}
                  onChange={(e) => onAcknowledgeChange(e.target.checked)}
                />
                <span>
                  I understand this may need urgent medical care, and I want to continue with a routine GharDoc home-visit request
                  anyway.
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">Not sure if this is an emergency? When in doubt, call 108.</p>
    </div>
  );
}
