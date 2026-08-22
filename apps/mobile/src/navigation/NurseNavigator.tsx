import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NurseTabs } from './NurseTabs';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { StaticInfoScreen } from '../screens/StaticInfoScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { colors, fonts } from '../theme/colors';
import type { NurseStackParamList } from './types';

const Stack = createNativeStackNavigator<NurseStackParamList>();

const headerOptions = {
  headerTintColor: colors.ink900,
  headerTitleStyle: { fontFamily: fonts.bold },
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
} as const;

// Mirrors DoctorNavigator.tsx exactly.
export function NurseNavigator() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="NurseTabs" component={NurseTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="StaticInfo" component={StaticInfoScreen} options={{ title: '' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
    </Stack.Navigator>
  );
}
