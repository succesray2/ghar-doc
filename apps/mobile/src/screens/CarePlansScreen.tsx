import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/colors';

// MOCK — no subscriptions/billing exists yet. "Subscribe" doesn't charge or
// persist anything; it's here to demonstrate the intended flow.
const PLANS = [
  {
    title: 'Preventive Health Plan',
    price: '₹1,499/yr',
    benefits: ['2 doctor consultations included', '15% off all diagnostic tests', 'Priority booking'],
  },
  {
    title: 'Senior Citizen Care Plan',
    price: '₹2,499/yr',
    benefits: ['4 doctor home visits included', '20% off diagnostics', 'Dedicated care coordinator'],
  },
  {
    title: 'Family Health Plan',
    price: '₹3,999/yr',
    benefits: ['Covers up to 4 family members', '6 consultations included', '20% off all services'],
  },
];

export function CarePlansScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.subtitle}>Save on every visit and test with a yearly plan.</Text>
      {PLANS.map((plan) => (
        <Card key={plan.title}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="shield-star-outline" size={22} color={colors.teal600} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{plan.title}</Text>
              <Text style={styles.price}>{plan.price}</Text>
            </View>
          </View>
          {plan.benefits.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={colors.sage600} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
          <View style={styles.cta}>
            <Button title="Subscribe" onPress={() => {}} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 },
  price: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.teal600, marginTop: 2 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  benefitText: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, flexShrink: 1 },
  cta: { marginTop: 8 },
});
