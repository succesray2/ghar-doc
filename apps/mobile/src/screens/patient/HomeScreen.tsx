import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../lib/auth-store';
import { useMyVisits } from '../../hooks/useVisits';
import { trustPoints } from '../../data/trust';
import { Card } from '../../components/Card';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { colors, fonts } from '../../theme/colors';
import type { PatientTabScreenProps } from '../../navigation/types';

type Props = PatientTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: visits } = useMyVisits();
  const latest = visits?.[0];
  const rootNav = navigation.getParent();
  const initial = user?.firstName?.charAt(0).toUpperCase() ?? '?';

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Image source={require('../../../assets/logo-icon.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={() => rootNav?.navigate('Notifications')}>
            <Feather name="bell" size={20} color={colors.ink900} />
          </Pressable>
          <Pressable style={styles.avatar} onPress={() => navigation.navigate('Account')}>
            <Text style={styles.avatarText}>{initial}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.greeting}>{timeGreeting}, {user?.firstName ?? 'there'}</Text>
      <Text style={styles.subGreeting}>How can we help with your health today?</Text>

      <Card style={styles.locationCard}>
        <Feather name="map-pin" size={16} color={colors.teal600} />
        <Text style={styles.locationText}>GharDoc services available in your area</Text>
      </Card>

      {latest ? (
        <Pressable onPress={() => navigation.navigate('MyVisits')}>
          <Card style={styles.nextVisitCard}>
            <Text style={styles.nextVisitLabel}>Your next visit</Text>
            <View style={styles.nextVisitRow}>
              <VisitStatusBadge status={latest.status} />
              <Text style={styles.nextVisitReason} numberOfLines={1}>{latest.reasonForVisit}</Text>
            </View>
          </Card>
        </Pressable>
      ) : null}

      <Text style={styles.sectionTitle}>What do you need today?</Text>
      <View style={styles.primaryRow}>
        <Pressable style={styles.primaryTile} onPress={() => navigation.navigate('Doctors')}>
          <View style={[styles.primaryIcon, { backgroundColor: colors.navy700 }]}>
            <MaterialCommunityIcons name="doctor" size={24} color="#fff" />
          </View>
          <Text style={styles.primaryTitle}>Book a Doctor</Text>
          <Text style={styles.primarySubtitle}>Consult or request a home visit</Text>
        </Pressable>
        <Pressable style={styles.primaryTile} onPress={() => navigation.navigate('Diagnostics')}>
          <View style={[styles.primaryIcon, { backgroundColor: colors.teal600 }]}>
            <MaterialCommunityIcons name="test-tube" size={24} color="#fff" />
          </View>
          <Text style={styles.primaryTitle}>Diagnostics</Text>
          <Text style={styles.primarySubtitle}>Tests, packages & prices</Text>
        </Pressable>
      </View>

      <View style={styles.secondaryGrid}>
        <SecondaryTile
          icon="needle"
          label="Nursing Care"
          onPress={() => rootNav?.navigate('RequestVisit', { reasonHint: 'Nursing care: ' })}
        />
        <SecondaryTile icon="folder-heart-outline" label="Health Records" onPress={() => rootNav?.navigate('HealthRecords')} />
        <SecondaryTile
          icon="run"
          label="Physiotherapy"
          onPress={() => rootNav?.navigate('RequestVisit', { reasonHint: 'Physiotherapy: ' })}
        />
        <SecondaryTile icon="ambulance" label="Emergency" danger onPress={() => rootNav?.navigate('Emergency')} />
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
    </SafeAreaView>
  );
}

function SecondaryTile({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.secondaryTile} onPress={onPress}>
      <Card style={styles.secondaryCard}>
        <View style={[styles.secondaryIcon, danger && styles.secondaryIconDanger]}>
          <MaterialCommunityIcons name={icon} size={20} color={danger ? colors.danger : colors.teal600} />
        </View>
        <Text style={styles.secondaryLabel}>{label}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  logo: { width: 40, height: 40 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.navy700, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bold, color: '#fff', fontSize: 15 },
  greeting: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.ink900 },
  subGreeting: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink400, marginTop: 2, marginBottom: 16 },
  locationCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.teal100, paddingVertical: 10 },
  locationText: { fontFamily: fonts.medium, fontSize: 12, color: colors.navy700, flex: 1 },
  nextVisitCard: { backgroundColor: colors.card },
  nextVisitLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.ink400, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 },
  nextVisitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nextVisitReason: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink900 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink900, marginTop: 18, marginBottom: 10 },
  primaryRow: { flexDirection: 'row', gap: 12 },
  primaryTile: { flex: 1, backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line },
  primaryIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  primaryTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900, marginBottom: 2 },
  primarySubtitle: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400 },
  secondaryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginTop: 12 },
  secondaryTile: { width: '50%', paddingHorizontal: 6, marginBottom: 12 },
  secondaryCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  secondaryIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  secondaryIconDanger: { backgroundColor: colors.dangerBg },
  secondaryLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink900, flexShrink: 1 },
  trustRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  trustIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sage100, alignItems: 'center', justifyContent: 'center' },
  trustText: { flex: 1 },
  trustTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900, marginBottom: 2 },
  trustDescription: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, lineHeight: 17 },
});
