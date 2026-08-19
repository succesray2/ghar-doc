import { ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { colors, fonts } from '../theme/colors';
import type { PatientStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'StaticInfo'>;

// Generic reusable screen for anything that's just a title + body of text —
// FAQs, Terms, Privacy Policy, Refund Policy, About, health guide articles.
export function StaticInfoScreen({ route, navigation }: Props) {
  const { title, body } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.body}>{body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.ink600, lineHeight: 24 },
});
