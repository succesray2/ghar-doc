import { useNavigate } from 'react-router-dom';
import { SAFETY_NET_QUESTIONS, type SafetyNetAnswers } from '@ghar-doc/shared';
import { Button } from '../../components/ui/Button';

/** Shared by the Nursing and Physiotherapy wizards — a small, universal
 *  red-flag check, NOT the doctor triage engine. Any "yes" hard-blocks with
 *  no acknowledge-and-proceed option; the only way forward is the doctor
 *  request flow instead. */
export function SafetyNetCheckStep({
  answers,
  onChange,
}: {
  answers: SafetyNetAnswers;
  onChange: (patch: Partial<SafetyNetAnswers>) => void;
}) {
  const navigate = useNavigate();
  const triggered = Object.values(answers).some(Boolean);

  if (triggered) {
    return (
      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-lg font-semibold text-red-800">This needs a doctor, not a routine booking</h2>
        <p className="text-sm text-red-700">
          Based on what you've flagged, please request a doctor visit instead — a nurse or physiotherapist booking isn't the right
          fit for this right now.
        </p>
        <Button onClick={() => navigate('/patient/request')}>Request a doctor visit</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Quick safety check</h2>
      <p className="text-sm text-slate-600">Before continuing, please confirm none of the following apply right now.</p>
      <div className="space-y-3 rounded-lg border border-slate-200 p-4">
        {SAFETY_NET_QUESTIONS.map((q) => (
          <label key={q.id} className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={answers[q.id]}
              onChange={(e) => onChange({ [q.id]: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            {q.label}
          </label>
        ))}
      </div>
    </div>
  );
}
