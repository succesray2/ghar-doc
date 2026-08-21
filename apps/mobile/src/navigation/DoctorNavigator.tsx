import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorTabs } from './DoctorTabs';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { StaticInfoScreen } from '../screens/StaticInfoScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { colors, fonts } from '../theme/colors';
import type { DoctorStackParamList } from './types';

const Stack = createNativeStackNavigator<DoctorStackParamList>();

const headerOptions = {
  headerTintColor: colors.ink900,
  headerTitleStyle: { fontFamily: fonts.bold },
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
} as const;

// Wraps the bare tab navigator in a stack (mirroring Admin's existing
// pattern) so Settings and its sub-screens can be pushed on top.
export function DoctorNavigator() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="DoctorTabs" component={DoctorTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="StaticInfo" component={StaticInfoScreen} options={{ title: '' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
    </Stack.Navigator>
  );
}
