import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { diagnosticTests, testPrice } from '../../data/diagnostics';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'DiagnosticTestDetail'>;

export function DiagnosticTestDetailScreen({ route, navigation }: Props) {
  const test = diagnosticTests.find((t) => t.slug === route.params.testSlug);
  if (!test) return null;
  const price = testPrice(test);
  const hasDiscount = test.discountedPrice !== undefined;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.name}>{test.name}</Text>
      <View style={styles.priceRow}>
        {hasDiscount ? <Text style={styles.strike}>₹{test.price}</Text> : null}
        <Text style={styles.price}>₹{price}</Text>
      </View>

      <View style={styles.metaGrid}>
        <MetaChip icon="water-outline" label={test.sampleType} />
        <MetaChip icon="clock-outline" label={test.reportTime} />
        <MetaChip icon={test.fastingRequired ? 'food-off-outline' : 'food-outline'} label={test.fastingRequired ? 'Fasting required' : 'No fasting needed'} />
      </View>

      <Section title="What is this test?" body={test.whatIsIt} />
      <Section title="Why is this test done?" body={test.whyDone} />

      <Card>
        <Text style={styles.sectionTitle}>What can this test help detect?</Text>
        {test.detects.map((d) => (
          <View key={d} style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>{d}</Text>
          </View>
        ))}
      </Card>

      <Section title="When might a doctor recommend it?" body={test.whenRecommended} />
      <Section title="Before the test" body={test.beforeTest} />

      <Card style={styles.disclaimerCard}>
        <MaterialCommunityIcons name="information-outline" size={16} color={colors.ink400} />
        <Text style={styles.disclaimerText}>
          Test information is provided for general education. Your doctor may recommend testing based on your
          symptoms and clinical condition.
        </Text>
      </Card>

      <Button
        title="Book this test"
        onPress={() => navigation.navigate('MockBooking', { kind: 'diagnostic-test', id: test.slug, title: test.name, price })}
      />
    </ScrollView>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </Card>
  );
}

function MetaChip({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <View style={styles.metaChip}>
      <MaterialCommunityIcons name={icon} size={14} color={colors.teal600} />
      <Text style={styles.metaChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  name: { fontFamily: fonts.extraBold, fontSize: 19, color: colors.ink900 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 14 },
  strike: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink400, textDecorationLine: 'line-through' },
  price: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.teal600 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.teal100, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  metaChipText: { fontFamily: fonts.medium, fontSize: 11, color: colors.teal600 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900, marginBottom: 6 },
  bodyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, lineHeight: 19 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.teal600, marginTop: 7 },
  bulletText: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, flex: 1, lineHeight: 18 },
  disclaimerCard: { flexDirection: 'row', gap: 8, backgroundColor: colors.bgSoft, alignItems: 'flex-start' },
  disclaimerText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, lineHeight: 17 },
});
