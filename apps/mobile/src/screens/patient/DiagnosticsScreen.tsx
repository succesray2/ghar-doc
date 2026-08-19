import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { diagnosticCategories, diagnosticPackages, diagnosticTests, individualTotal } from '../../data/diagnostics';
import { Card } from '../../components/Card';
import { colors, fonts } from '../../theme/colors';
import type { PatientTabScreenProps } from '../../navigation/types';

type Props = PatientTabScreenProps<'Diagnostics'>;

export function DiagnosticsScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return diagnosticTests.filter((t) => t.name.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q)));
  }, [query]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Diagnostics</Text>
      <Text style={styles.subtitle}>Understand your tests. Choose with confidence.</Text>

      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.ink400} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search tests — e.g. diabetes, thyroid"
          placeholderTextColor={colors.ink400}
          style={styles.searchInput}
        />
      </View>

      {searchResults.length > 0 ? (
        <View style={styles.searchResults}>
          {searchResults.map((t) => (
            <Pressable key={t.slug} onPress={() => navigation.navigate('DiagnosticTestDetail', { testSlug: t.slug })}>
              <Card style={styles.testRow}>
                <Text style={styles.testName}>{t.name}</Text>
                <Text style={styles.testPrice}>₹{t.discountedPrice ?? t.price}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {diagnosticCategories.map((c) => (
              <Pressable
                key={c.slug}
                style={styles.categoryTile}
                onPress={() => navigation.navigate('DiagnosticCategory', { categorySlug: c.slug })}
              >
                <View style={styles.categoryIcon}>
                  <MaterialCommunityIcons name={c.icon} size={20} color={colors.teal600} />
                </View>
                <Text style={styles.categoryLabel}>{c.title}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Popular tests</Text>
          {diagnosticTests.slice(0, 4).map((t) => (
            <Pressable key={t.slug} onPress={() => navigation.navigate('DiagnosticTestDetail', { testSlug: t.slug })}>
              <Card style={styles.testRow}>
                <View style={styles.testRowText}>
                  <Text style={styles.testName}>{t.name}</Text>
                  <Text style={styles.testMeta}>{t.sampleType} · {t.reportTime}</Text>
                </View>
                <Text style={styles.testPrice}>₹{t.discountedPrice ?? t.price}</Text>
              </Card>
            </Pressable>
          ))}

          <Text style={styles.sectionTitle}>Health packages</Text>
          {diagnosticPackages.map((p) => (
            <Pressable key={p.slug} onPress={() => navigation.navigate('DiagnosticPackageDetail', { packageSlug: p.slug })}>
              <Card>
                <Text style={styles.packageTitle}>{p.title}</Text>
                <Text style={styles.packageDescription}>{p.description}</Text>
                <View style={styles.packagePriceRow}>
                  <Text style={styles.packageStrike}>₹{individualTotal(p)}</Text>
                  <Text style={styles.packagePrice}>₹{p.packagePrice}</Text>
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>Save ₹{individualTotal(p) - p.packagePrice}</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  title: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.ink900 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink400, marginTop: 2, marginBottom: 16 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink900 },
  searchResults: { marginTop: 4 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink900, marginTop: 12, marginBottom: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginBottom: 8 },
  categoryTile: { width: '33.33%', paddingHorizontal: 6, alignItems: 'center', marginBottom: 16 },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.ink900, textAlign: 'center' },
  testRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  testRowText: { flex: 1 },
  testName: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink900 },
  testMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400, marginTop: 2 },
  testPrice: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900 },
  packageTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 },
  packageDescription: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 4, marginBottom: 10 },
  packagePriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  packageStrike: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, textDecorationLine: 'line-through' },
  packagePrice: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink900 },
  savingsBadge: { backgroundColor: colors.sage100, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 'auto' },
  savingsText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.sage600 },
});
