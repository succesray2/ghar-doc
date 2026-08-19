import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts } from '../theme/colors';
import type { PatientStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'StaticInfo'>;

// Generic reusable screen for anything that's a title + body of text — FAQs,
// Terms, Privacy Policy, Refund Policy, About, health guide articles. Bodies
// can use a few lightweight markdown conventions (# / ## / ### headers, "* "
// bullets, "---" dividers, whole-line **bold**) since some of this content
// (Terms & Conditions especially) is long enough that a single text block
// would be unreadable — this isn't a full markdown renderer, just enough to
// make a real legal document scannable.
export function StaticInfoScreen({ route, navigation }: Props) {
  const { title, body } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      {renderBody(body)}
    </ScrollView>
  );
}

function renderBody(body: string) {
  const lines = body.split('\n');
  return lines.map((raw, i) => {
    const line = raw.trim();
    if (line.length === 0) return null;
    if (line === '---') return <View key={i} style={styles.divider} />;
    if (line.startsWith('### ')) return <Text key={i} style={styles.h3}>{line.slice(4)}</Text>;
    if (line.startsWith('## ')) return <Text key={i} style={styles.h2}>{line.slice(3)}</Text>;
    if (line.startsWith('# ')) return <Text key={i} style={styles.h1}>{line.slice(2)}</Text>;
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <View key={i} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{stripBold(line.slice(2))}</Text>
        </View>
      );
    }
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      return <Text key={i} style={styles.bold}>{line.slice(2, -2)}</Text>;
    }
    return (
      <Text key={i} style={styles.body}>
        {stripBold(line)}
      </Text>
    );
  });
}

function stripBold(text: string) {
  return text.replace(/\*\*/g, '');
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  h1: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink900, marginTop: 12, marginBottom: 10 },
  h2: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink900, marginTop: 16, marginBottom: 8 },
  h3: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900, marginTop: 10, marginBottom: 6 },
  bold: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink900, marginBottom: 8 },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink600, lineHeight: 21, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.teal600, marginTop: 8 },
  bulletText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink600, lineHeight: 20 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 14 },
});
