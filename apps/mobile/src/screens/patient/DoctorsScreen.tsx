import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { mockDoctors } from '../../data/doctors';
import { Card } from '../../components/Card';
import { colors, fonts } from '../../theme/colors';
import type { PatientTabScreenProps } from '../../navigation/types';

type Props = PatientTabScreenProps<'Doctors'>;

const SPECIALTIES = ['All', ...Array.from(new Set(mockDoctors.map((d) => d.specialty)))];

export function DoctorsScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');

  const filtered = useMemo(() => {
    return mockDoctors.filter((d) => {
      const matchesQuery = query.trim().length === 0 || d.name.toLowerCase().includes(query.toLowerCase()) || d.specialty.toLowerCase().includes(query.toLowerCase());
      const matchesSpecialty = specialty === 'All' || d.specialty === specialty;
      return matchesQuery && matchesSpecialty;
    });
  }, [query, specialty]);

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.ink400} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search doctors or specialty"
          placeholderTextColor={colors.ink400}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
        data={SPECIALTIES}
        keyExtractor={(s) => s}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSpecialty(item)} style={[styles.pill, specialty === item && styles.pillActive]}>
            <Text style={[styles.pillText, specialty === item && styles.pillTextActive]}>{item}</Text>
          </Pressable>
        )}
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={filtered}
        keyExtractor={(d) => d.id}
        renderItem={({ item: d }) => (
          <Pressable onPress={() => navigation.navigate('DoctorProfile', { doctorId: d.id })}>
            <Card style={styles.docCard}>
              <View style={styles.docAvatar}>
                <MaterialCommunityIcons name="doctor" size={26} color={colors.navy700} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName}>{d.name}</Text>
                <Text style={styles.docSpecialty}>{d.specialty} · {d.experienceYears} yrs exp</Text>
                <View style={styles.docMetaRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.docMetaText}>{d.rating} ({d.reviewCount})</Text>
                  {d.homeVisitAvailable ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Home visit</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Text style={styles.docFee}>₹{d.consultationFee}</Text>
            </Card>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink900 },
  filterRow: { flexGrow: 0, marginTop: 12 },
  filterRowContent: { paddingHorizontal: 16, gap: 8 },
  pill: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: colors.card, marginRight: 8, borderWidth: 1, borderColor: colors.line },
  pillActive: { backgroundColor: colors.teal600, borderColor: colors.teal600 },
  pillText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink600 },
  pillTextActive: { color: '#fff' },
  list: { padding: 16 },
  docCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  docInfo: { flex: 1 },
  docName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900 },
  docSpecialty: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
  docMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  docMetaText: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink600, marginRight: 8 },
  badge: { backgroundColor: colors.sage100, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.sage600 },
  docFee: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink900 },
});
