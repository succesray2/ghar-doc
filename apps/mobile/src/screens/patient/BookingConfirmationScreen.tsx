import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'BookingConfirmation'>;

export function BookingConfirmationScreen({ route, navigation }: Props) {
  const { title, subtitle } = route.params;

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="check" size={36} color="#fff" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.button}>
        <Button title="Go Home" onPress={() => navigation.popToTop()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.sage600, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink900, marginBottom: 8 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, textAlign: 'center', marginBottom: 28 },
  button: { minWidth: 180 },
});
