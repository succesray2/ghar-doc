import { useMemo, useState } from 'react';
import { SYMPTOM_CATEGORIES, TRIAGE_TAXONOMY_NOTICE } from '@ghar-doc/shared';
import { Input } from '../../../components/ui/Input';
import type { WizardState } from './types';

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
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(SYMPTOM_CATEGORIES[0]?.id ?? null);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SYMPTOM_CATEGORIES;
    return SYMPTOM_CATEGORIES.map((cat) => ({
      ...cat,
      symptoms: cat.symptoms.filter((s) => s.label.toLowerCase().includes(q)),
    })).filter((cat) => cat.symptoms.length > 0);
  }, [search]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">What is the main problem?</h2>
      <p className="text-xs text-slate-500">{TRIAGE_TAXONOMY_NOTICE}</p>
      <Input placeholder="Search symptoms" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
        {filteredCategories.map((cat) => {
          const isOpen = search.trim().length > 0 || openCategoryId === cat.id;
          const selectedInCategory = cat.symptoms.filter((s) => state.selectedSymptomIds.includes(s.id)).length;
          return (
            <div key={cat.id}>
              <button
                type="button"
                onClick={() => setOpenCategoryId(isOpen ? null : cat.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <span>
                  {cat.label}
                  {selectedInCategory > 0 && <span className="ml-2 text-xs font-normal text-brand-600">({selectedInCategory} selected)</span>}
                </span>
                <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 gap-1 px-4 pb-3 sm:grid-cols-2">
                  {cat.symptoms.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
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
          placeholder="Describe it in your own words"
          value={state.otherSymptomText}
          onChange={(e) => onChange({ otherSymptomText: e.target.value })}
        />
      </div>

      <p className="text-sm font-medium text-slate-600">
        {state.selectedSymptomIds.length} symptom{state.selectedSymptomIds.length === 1 ? '' : 's'} selected
      </p>
    </div>
  );
}
