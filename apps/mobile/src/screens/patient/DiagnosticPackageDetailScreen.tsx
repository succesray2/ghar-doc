import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { diagnosticPackages, diagnosticTests, individualTotal, testPrice } from '../../data/diagnostics';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'DiagnosticPackageDetail'>;

export function DiagnosticPackageDetailScreen({ route, navigation }: Props) {
  const pkg = diagnosticPackages.find((p) => p.slug === route.params.packageSlug);
  if (!pkg) return null;
  const total = individualTotal(pkg);
  const savings = total - pkg.packagePrice;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{pkg.title}</Text>
      <Text style={styles.description}>{pkg.description}</Text>

      <Card>
        <Text style={styles.sectionTitle}>Tests included</Text>
        {pkg.testSlugs.map((slug) => {
          const t = diagnosticTests.find((x) => x.slug === slug);
          if (!t) return null;
          return (
            <View key={slug} style={styles.testRow}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={colors.sage600} />
              <Text style={styles.testName}>{t.name}</Text>
              <Text style={styles.testPrice}>₹{testPrice(t)}</Text>
            </View>
          );
        })}
      </Card>

      <Card>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Individual total</Text>
          <Text style={styles.priceStrike}>₹{total}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabelBold}>Package price</Text>
          <Text style={styles.packagePrice}>₹{pkg.packagePrice}</Text>
        </View>
        {savings > 0 ? (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>You save ₹{savings}</Text>
          </View>
        ) : null}
      </Card>

      <Button
        title="Book package"
        onPress={() =>
          navigation.navigate('MockBooking', { kind: 'diagnostic-package', id: pkg.slug, title: pkg.title, price: pkg.packagePrice })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  title: { fontFamily: fonts.extraBold, fontSize: 19, color: colors.ink900 },
  description: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, marginTop: 4, marginBottom: 16 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900, marginBottom: 10 },
  testRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  testName: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink900 },
  testPrice: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink400 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400 },
  priceStrike: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, textDecorationLine: 'line-through' },
  priceLabelBold: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  packagePrice: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.teal600 },
  savingsBadge: { alignSelf: 'flex-start', backgroundColor: colors.sage100, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  savingsText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.sage600 },
});
