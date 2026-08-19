import { Stethoscope, Syringe, FlaskConical } from 'lucide-react';

const ROWS = [
  { icon: Stethoscope, label: 'Doctor', status: 'Completed', tone: 'bg-sage-100 text-sage-600' },
  { icon: Syringe, label: 'Nursing', status: 'En route', tone: 'bg-teal-100 text-teal-600' },
  { icon: FlaskConical, label: 'Diagnostics', status: 'Requested', tone: 'bg-navy-900/5 text-navy-700' },
];

/**
 * An illustrative phone-frame mockup, not a screenshot of the (not-yet-built)
 * mobile app — deliberately abstract so it doesn't imply functionality that
 * doesn't exist yet.
 */
export function PhoneMockup() {
  return (
    <div className="relative w-72 rounded-[2.5rem] border-[10px] border-navy-900 bg-navy-900 shadow-soft">
      <div className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-navy-900" aria-hidden="true" />
      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <div className="bg-bg-soft px-5 pb-4 pt-8">
          <p className="text-[11px] font-medium text-ink-400">Good morning</p>
          <p className="text-base font-bold text-navy-900">Your visits</p>
        </div>
        <div className="space-y-3 px-4 py-4">
          {ROWS.map((row) => (
            <div key={row.label} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-navy-900/5 text-navy-700">
                <row.icon size={15} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-navy-900">{row.label}</p>
                <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-line" aria-hidden="true" />
              </div>
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${row.tone}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
