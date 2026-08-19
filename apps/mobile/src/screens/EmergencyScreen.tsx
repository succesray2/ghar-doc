import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/colors';

export function EmergencyScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Card style={styles.mainCard}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="ambulance" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Medical emergency?</Text>
        <Text style={styles.subtitle}>Don't wait for an app — call for immediate help.</Text>
        <Button title="Call 108 (Ambulance)" variant="danger" onPress={() => Linking.openURL('tel:108')} />
      </Card>

      <Text style={styles.sectionTitle}>What 108 covers</Text>
      <Card>
        <Text style={styles.bodyText}>
          108 is India's free, nationwide emergency ambulance service — available 24/7 for medical, accident, and
          other emergencies. It is independent of GharDoc and works anywhere in the country.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>While you wait</Text>
      <Card>
        <Bullet text="Keep the person still and calm." />
        <Bullet text="Note down symptoms and when they started." />
        <Bullet text="Keep any medications the person is currently taking handy." />
        <Bullet text="Unlock your door/gate so responders can reach you quickly." />
      </Card>
    </ScrollView>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.dot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  mainCard: { alignItems: 'center', paddingVertical: 24 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontFamily: fonts.extraBold, fontSize: 19, color: colors.ink900, marginBottom: 4 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, marginBottom: 18, textAlign: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink900, marginTop: 18, marginBottom: 8 },
  bodyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, lineHeight: 19 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.teal600, marginTop: 7 },
  bulletText: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, flex: 1, lineHeight: 18 },
});
