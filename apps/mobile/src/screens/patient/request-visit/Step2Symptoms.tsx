import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SYMPTOM_CATEGORIES, TRIAGE_TAXONOMY_NOTICE } from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
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
    <View>
      <Text style={styles.title}>What is the problem today?</Text>
      <Text style={styles.subtitle}>Select one or more signs or symptoms that the patient is experiencing.</Text>
      <Text style={styles.hint}>{TRIAGE_TAXONOMY_NOTICE}</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search symptoms"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
      />

      <View style={styles.list}>
        {filteredCategories.map((cat) => {
          const isOpen = search.trim().length > 0 || openCategoryId === cat.id;
          const selectedInCategory = cat.symptoms.filter((s) => state.selectedSymptomIds.includes(s.id)).length;
          return (
            <View key={cat.id} style={styles.categoryBlock}>
              <Pressable style={styles.categoryHeader} onPress={() => setOpenCategoryId(isOpen ? null : cat.id)} accessibilityRole="button">
                <Text style={styles.categoryTitle}>
                  <Text style={styles.categoryIcon}>{cat.icon} </Text>
                  {cat.label}
                  {selectedInCategory > 0 ? <Text style={styles.categoryCount}>  {selectedInCategory} selected</Text> : null}
                </Text>
                <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
              </Pressable>
              {isOpen && (
                <View style={styles.symptomList}>
                  {cat.symptoms.map((s) => {
                    const checked = state.selectedSymptomIds.includes(s.id);
                    return (
                      <Pressable
                        key={s.id}
                        style={styles.symptomRow}
                        onPress={() => onToggleSymptom(s.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked }}
                        accessibilityLabel={s.label}
                      >
                        <Feather
                          name={checked ? 'check-square' : 'square'}
                          size={20}
                          color={checked ? colors.teal600 : colors.textMuted}
                        />
                        <Text style={styles.symptomLabel}>{s.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.otherLabel}>Other / I can't find my symptom</Text>
      <TextInput
        value={state.otherSymptomText}
        onChangeText={(v) => onChange({ otherSymptomText: v.slice(0, 300) })}
        placeholder="Please describe the problem in your own words"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
        maxLength={300}
      />

      <Text style={styles.count}>
        {state.selectedSymptomIds.length} symptom{state.selectedSymptomIds.length === 1 ? '' : 's'} selected
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginBottom: 6 },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.card,
    marginBottom: 12,
    minHeight: 44,
  },
  list: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  categoryBlock: { borderTopWidth: 1, borderTopColor: colors.border },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 14, minHeight: 48 },
  categoryTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, flexShrink: 1 },
  categoryIcon: { fontSize: 16 },
  categoryCount: { fontFamily: fonts.regular, fontSize: 12, color: colors.teal600 },
  symptomList: { paddingHorizontal: 14, paddingBottom: 8 },
  symptomRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, minHeight: 44 },
  symptomLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, flexShrink: 1 },
  otherLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.text, marginBottom: 6 },
  count: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textMuted },
});
