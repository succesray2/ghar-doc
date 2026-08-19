import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mockDoctors } from '../../data/doctors';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'DoctorProfile'>;

export function DoctorProfileScreen({ route, navigation }: Props) {
  const doctor = mockDoctors.find((d) => d.id === route.params.doctorId);
  if (!doctor) return null;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Card style={styles.headerCard}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="doctor" size={34} color={colors.navy700} />
        </View>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.qualification}>{doctor.qualification}</Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
          <Text style={styles.metaText}>{doctor.rating} ({doctor.reviewCount} reviews)</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{doctor.experienceYears} yrs experience</Text>
        </View>
      </Card>

      <Card>
        <SectionTitle title="About" />
        <Text style={styles.bodyText}>{doctor.about}</Text>
      </Card>

      <Card>
        <SectionTitle title="Areas of expertise" />
        <View style={styles.chipRow}>
          {doctor.expertise.map((e) => (
            <View key={e} style={styles.chip}>
              <Text style={styles.chipText}>{e}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle title="Languages" />
        <Text style={styles.bodyText}>{doctor.languages.join(', ')}</Text>
      </Card>

      <Card>
        <SectionTitle title="Fees" />
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Consultation</Text>
          <Text style={styles.feeValue}>₹{doctor.consultationFee}</Text>
        </View>
        {doctor.homeVisitAvailable ? (
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Home visit</Text>
            <Text style={styles.feeValue}>₹{doctor.homeVisitFee}</Text>
          </View>
        ) : null}
      </Card>

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button
            title="Book Consultation"
            variant="secondary"
            onPress={() =>
              navigation.navigate('MockBooking', {
                kind: 'consultation',
                id: doctor.id,
                title: `Consultation with ${doctor.name}`,
                price: doctor.consultationFee,
              })
            }
          />
        </View>
        {doctor.homeVisitAvailable ? (
          <View style={styles.actionButton}>
            <Button
              title="Request Home Visit"
              onPress={() => navigation.navigate('RequestVisit', { reasonHint: `Requesting ${doctor.name}: ` })}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  headerCard: { alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink900 },
  qualification: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  metaText: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink600 },
  metaDot: { color: colors.ink400, marginHorizontal: 4 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900, marginBottom: 8 },
  bodyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, lineHeight: 19 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.teal100, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontFamily: fonts.medium, fontSize: 12, color: colors.teal600 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  feeLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600 },
  feeValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink900 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 24 },
  actionButton: { flex: 1 },
});
