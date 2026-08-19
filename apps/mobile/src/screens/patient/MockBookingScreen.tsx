import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'MockBooking'>;

const DATES = ['Today', 'Tomorrow', 'Choose date'];
const WINDOWS = ['Morning (8–12)', 'Afternoon (12–4)', 'Evening (4–8)'];

// Demo booking flow — no payment gateway or diagnostic/consultation-booking
// endpoint exists yet, so this doesn't charge or persist anything. It's here
// to show the intended flow end-to-end.
export function MockBookingScreen({ route, navigation }: Props) {
  const { title, price } = route.params;
  const [date, setDate] = useState(DATES[0]);
  const [window, setWindow] = useState(WINDOWS[0]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Card>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemPrice}>₹{price}</Text>
      </Card>

      <Text style={styles.sectionTitle}>Date</Text>
      <View style={styles.pillRow}>
        {DATES.map((d) => (
          <Pressable key={d} onPress={() => setDate(d)} style={[styles.pill, date === d && styles.pillActive]}>
            <Text style={[styles.pillText, date === d && styles.pillTextActive]}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Time window</Text>
      <View style={styles.pillRow}>
        {WINDOWS.map((w) => (
          <Pressable key={w} onPress={() => setWindow(w)} style={[styles.pill, window === w && styles.pillActive]}>
            <Text style={[styles.pillText, window === w && styles.pillTextActive]}>{w}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Patient</Text>
      <Card style={styles.patientCard}>
        <MaterialCommunityIcons name="account-outline" size={18} color={colors.navy700} />
        <Text style={styles.patientText}>You</Text>
      </Card>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>₹{price}</Text>
        </View>
      </Card>

      <Button
        title="Pay & Confirm"
        onPress={() =>
          navigation.replace('BookingConfirmation', {
            title: 'Booking Confirmed',
            subtitle: `${title} — ${date}, ${window}`,
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  itemTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 },
  itemPrice: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.teal600, marginTop: 4 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink900, marginTop: 16, marginBottom: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  pillActive: { backgroundColor: colors.teal600, borderColor: colors.teal600 },
  pillText: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink600 },
  pillTextActive: { color: '#fff' },
  patientCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  patientText: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink900 },
  summaryCard: { marginTop: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  summaryValue: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink900 },
});
