import { useMemo, useState } from 'react';
import { SYMPTOM_CATEGORIES, TRIAGE_TAXONOMY_NOTICE } from '@ghar-doc/shared';
import { Input } from '../../../components/ui/Input';
import type { WizardState } from './types';

function matchesSearch(label: string, searchTerms: string[] | undefined, q: string) {
  return label.toLowerCase().includes(q) || (searchTerms ?? []).some((t) => t.toLowerCase().includes(q));
}

export function Step2Symptoms({
  state,
  onToggleSymptom,
  onChange,
}: {
  state: WizardState;
  onToggleSymptom: (symptomId: string) => void;
  onChange: (patch: Partial<WizardState>) => void;
}) {
  const [search, setSearch] = useState('');
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SYMPTOM_CATEGORIES;
    return SYMPTOM_CATEGORIES.map((cat) => ({
      ...cat,
      symptoms: cat.symptoms.filter((s) => matchesSearch(s.label, s.searchTerms, q)),
    })).filter((cat) => cat.symptoms.length > 0);
  }, [search]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">What is the problem today?</h2>
      <p className="text-sm text-slate-600">Select one or more signs or symptoms that the patient is experiencing.</p>
      <p className="text-xs text-slate-500">{TRIAGE_TAXONOMY_NOTICE}</p>
      <Input placeholder="Search symptoms" value={search} onChange={(e) => setSearch(e.target.value)} className="py-2.5" />

      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
        {filteredCategories.map((cat) => {
          const isOpen = search.trim().length > 0 || openCategoryId === cat.id;
          const selectedInCategory = cat.symptoms.filter((s) => state.selectedSymptomIds.includes(s.id)).length;
          return (
            <div key={cat.id}>
              <button
                type="button"
                onClick={() => setOpenCategoryId(isOpen ? null : cat.id)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">{cat.icon}</span>
                  {cat.label}
                  {selectedInCategory > 0 && <span className="text-xs font-normal text-brand-600">{selectedInCategory} selected</span>}
                </span>
                <span className="text-slate-400" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 gap-1 px-4 pb-3 sm:grid-cols-2">
                  {cat.symptoms.map((s) => (
                    <label key={s.id} className="flex min-h-[44px] items-center gap-2.5 rounded px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        className="h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        checked={state.selectedSymptomIds.includes(s.id)}
                        onChange={() => onToggleSymptom(s.id)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Other / I can't find my symptom</label>
        <Input
          placeholder="Please describe the problem in your own words"
          value={state.otherSymptomText}
          onChange={(e) => onChange({ otherSymptomText: e.target.value.slice(0, 300) })}
          maxLength={300}
        />
      </div>

      <p className="text-sm font-medium text-slate-600">
        {state.selectedSymptomIds.length} symptom{state.selectedSymptomIds.length === 1 ? '' : 's'} selected
      </p>
    </div>
  );
}
