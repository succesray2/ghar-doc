import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../components/Card';
import { colors, fonts } from '../theme/colors';
import type { PatientStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'HealthGuides'>;

// MOCK — no CMS/article backend exists yet.
const GUIDES = [
  {
    title: 'Healthcare at Your Doorstep',
    category: 'General Health',
    readTime: '3 min read',
    body: 'Home healthcare brings quality medical attention directly to your family, without the wait or the commute. A doctor visits you, assesses your condition, and coordinates any follow-up care — all while you stay comfortable at home. This is especially valuable for elderly family members, young children, or anyone managing a condition that makes travel difficult.',
  },
  {
    title: 'When Should You See a Doctor Instead of Self-Medicating?',
    category: 'General Health',
    readTime: '3 min read',
    body: "Home remedies and over-the-counter medication are fine for mild, short-lived symptoms. But persistent fever, worsening pain, breathing difficulty, or symptoms lasting more than a few days are signs it's time to see a doctor. Misusing antibiotics without a prescription can also make future infections harder to treat — always check with a doctor before starting one.",
  },
  {
    title: 'Vaccination Made Easy: Protecting Your Family',
    category: "Children",
    readTime: '3 min read',
    body: 'Vaccines remain one of the most effective ways to protect your family at every age — not just childhood. Keeping a simple record of who has had what, and when the next dose is due, helps you stay on schedule without relying on memory alone.',
  },
];

export function HealthGuidesScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      {GUIDES.map((g) => (
        <Pressable key={g.title} onPress={() => navigation.navigate('StaticInfo', { title: g.title, body: g.body })}>
          <Card>
            <Text style={styles.meta}>{g.category} · {g.readTime}</Text>
            <Text style={styles.title}>{g.title}</Text>
            <Text style={styles.excerpt} numberOfLines={2}>{g.body}</Text>
            <Text style={styles.readMore}>Read guide →</Text>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  meta: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.teal600, marginBottom: 6 },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink900, marginBottom: 6 },
  excerpt: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, lineHeight: 19, marginBottom: 8 },
  readMore: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.teal600 },
});
