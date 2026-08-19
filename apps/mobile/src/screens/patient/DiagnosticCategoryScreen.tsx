import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { diagnosticCategories, diagnosticTests, testPrice } from '../../data/diagnostics';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'DiagnosticCategory'>;

export function DiagnosticCategoryScreen({ route, navigation }: Props) {
  const category = diagnosticCategories.find((c) => c.slug === route.params.categorySlug);
  const tests = diagnosticTests.filter((t) => t.categorySlug === route.params.categorySlug);

  useLayoutEffect(() => {
    if (category) navigation.setOptions({ title: category.title });
  }, [navigation, category]);

  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.list}
      data={tests}
      keyExtractor={(t) => t.slug}
      ListEmptyComponent={
        <EmptyState icon="package" title="No tests listed yet" message="More tests in this category are coming soon." />
      }
      renderItem={({ item: t }) => (
        <Pressable onPress={() => navigation.navigate('DiagnosticTestDetail', { testSlug: t.slug })}>
          <Card style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.name}>{t.name}</Text>
              <Text style={styles.meta}>{t.sampleType} · {t.reportTime}</Text>
            </View>
            <Text style={styles.price}>₹{testPrice(t)}</Text>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, flexGrow: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { flex: 1 },
  name: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
  price: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900 },
});
