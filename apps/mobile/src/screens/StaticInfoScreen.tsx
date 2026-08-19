import { Fragment, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts } from '../theme/colors';
import type { PatientStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'StaticInfo'>;

// Generic reusable screen for anything that's a title + body of text — FAQs,
// Terms, Privacy Policy, About, health guide articles. Bodies can use a few
// lightweight markdown conventions (# / ## / ### headers, "* " bullets,
// "---" dividers, whole-line **bold**, "| a | b |" tables) since some of
// this content (Terms & Conditions, Privacy Policy especially) is long
// enough that a single text block would be unreadable — this isn't a full
// markdown renderer, just enough to make a real legal document scannable.
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
  const blocks: JSX.Element[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const [header, ...rows] = tableRows;
    blocks.push(
      <View key={key} style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeaderRow]}>
          {header.map((cell, i) => (
            <Text key={i} style={[styles.tableCell, styles.tableHeaderText]}>
              {cell}
            </Text>
          ))}
        </View>
        {rows.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            {row.map((cell, j) => (
              <Text key={j} style={styles.tableCell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>,
    );
    tableRows = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.length === 0) return;

    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.slice(1, -1).split('|').map((c) => c.trim());
      if (!cells.every((c) => /^-+$/.test(c))) tableRows.push(cells);
      return;
    }
    flushTable(`table-${i}`);

    if (line === '---') {
      blocks.push(<View key={i} style={styles.divider} />);
    } else if (line.startsWith('### ')) {
      blocks.push(<Text key={i} style={styles.h3}>{line.slice(4)}</Text>);
    } else if (line.startsWith('## ')) {
      blocks.push(<Text key={i} style={styles.h2}>{line.slice(3)}</Text>);
    } else if (line.startsWith('# ')) {
      blocks.push(<Text key={i} style={styles.h1}>{line.slice(2)}</Text>);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      blocks.push(
        <View key={i} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{stripBold(line.slice(2))}</Text>
        </View>,
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      blocks.push(<Text key={i} style={styles.bold}>{line.slice(2, -2)}</Text>);
    } else {
      blocks.push(<Text key={i} style={styles.body}>{stripBold(line)}</Text>);
    }
  });
  flushTable('table-end');

  return <Fragment>{blocks}</Fragment>;
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
  table: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, overflow: 'hidden', marginVertical: 10 },
  tableRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line },
  tableHeaderRow: { borderTopWidth: 0, backgroundColor: colors.bgSoft },
  tableCell: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.ink600, padding: 8 },
  tableHeaderText: { fontFamily: fonts.semiBold, color: colors.ink900 },
});
