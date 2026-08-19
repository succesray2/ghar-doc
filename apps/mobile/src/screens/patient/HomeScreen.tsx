import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../../lib/auth-store';
import { useMyVisits } from '../../hooks/useVisits';
import { services } from '../../data/services';
import { trustPoints } from '../../data/trust';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { colors, fonts } from '../../theme/colors';
import type { PatientTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<PatientTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: visits } = useMyVisits();
  const latest = visits?.[0];
  const initial = user?.firstName?.charAt(0).toUpperCase() ?? '?';

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi {user?.firstName ?? 'there'} 👋</Text>
          <Text style={styles.subGreeting}>Doctor home visits, sorted.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </View>

      <Card style={styles.ctaCard}>
        <View style={styles.ctaIcon}>
          <MaterialCommunityIcons name="home-city-outline" size={24} color="#fff" />
        </View>
        <Text style={styles.ctaTitle}>Doctors to your doorstep</Text>
        <Text style={styles.ctaSubtitle}>Request a home visit and an admin will assign a verified doctor to you.</Text>
        <View style={styles.ctaButton}>
          <Button title="Request a visit" onPress={() => navigation.navigate('RequestVisit', undefined)} />
        </View>
      </Card>

      {latest ? (
        <>
          <Text style={styles.sectionTitle}>Latest visit</Text>
          <Card>
            <View style={styles.rowBetween}>
              <VisitStatusBadge status={latest.status} />
              <Text style={styles.timestamp}>{new Date(latest.requestedAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.reason}>{latest.reasonForVisit}</Text>
            {latest.doctor ? (
              <Text style={styles.doctor}>Doctor: {latest.doctor.firstName} {latest.doctor.lastName}</Text>
            ) : null}
            <View style={styles.linkButton}>
              <Button title="View all visits" variant="ghost" onPress={() => navigation.navigate('MyVisits')} />
            </View>
          </Card>
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Our services</Text>
      <View style={styles.serviceGrid}>
        {services.map((s) => (
          <View key={s.slug} style={styles.serviceTileWrap}>
            <Pressable
              onPress={() =>
                navigation.navigate('RequestVisit', { reasonHint: s.title === 'Doctor Home Visits' ? '' : `${s.title}: ` })
              }
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Card style={styles.serviceTile}>
                <View style={styles.serviceIcon}>
                  <MaterialCommunityIcons name={s.icon} size={22} color={colors.teal600} />
                </View>
                <Text style={styles.serviceTitle}>{s.title}</Text>
                <Text style={styles.serviceSummary} numberOfLines={2}>{s.summary}</Text>
              </Card>
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Why families trust us</Text>
      {trustPoints.map((t) => (
        <View key={t.title} style={styles.trustRow}>
          <View style={styles.trustIcon}>
            <MaterialCommunityIcons name={t.icon} size={18} color={colors.navy700} />
          </View>
          <View style={styles.trustText}>
            <Text style={styles.trustTitle}>{t.title}</Text>
            <Text style={styles.trustDescription}>{t.description}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.ink900 },
  subGreeting: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink400, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, color: '#fff', fontSize: 18 },
  ctaCard: { backgroundColor: colors.navy700, borderRadius: 20 },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaTitle: { fontFamily: fonts.bold, fontSize: 18, color: '#fff', marginBottom: 4 },
  ctaSubtitle: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  ctaButton: { alignSelf: 'flex-start', minWidth: 160 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink900, marginTop: 20, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timestamp: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400 },
  reason: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.ink900 },
  doctor: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, marginTop: 4 },
  linkButton: { marginTop: 12, alignSelf: 'flex-start' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  serviceTileWrap: { width: '50%', paddingHorizontal: 6 },
  serviceTile: { minHeight: 130 },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceTitle: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink900, marginBottom: 4 },
  serviceSummary: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400, lineHeight: 15 },
  trustRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sage100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: { flex: 1 },
  trustTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900, marginBottom: 2 },
  trustDescription: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, lineHeight: 17 },
});
