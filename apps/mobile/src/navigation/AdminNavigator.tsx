import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AllVisitsScreen } from '../screens/admin/AllVisitsScreen';
import { SafetyDashboardScreen } from '../screens/admin/SafetyDashboardScreen';
import { AssignProviderModal } from '../screens/admin/AssignProviderModal';
import { NursesScreen } from '../screens/admin/NursesScreen';
import { PhysiotherapistsScreen } from '../screens/admin/PhysiotherapistsScreen';
import { CreateNurseModal } from '../screens/admin/CreateNurseModal';
import { CreatePhysiotherapistModal } from '../screens/admin/CreatePhysiotherapistModal';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { StaticInfoScreen } from '../screens/StaticInfoScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { colors, fonts } from '../theme/colors';
import type { AdminStackParamList, AdminTabParamList } from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

const headerOptions = {
  headerTintColor: colors.ink900,
  headerTitleStyle: { fontFamily: fonts.bold },
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
} as const;

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.brand600, tabBarInactiveTintColor: colors.textMuted }}>
      <Tab.Screen
        name="AllVisits"
        component={AllVisitsScreen}
        options={{ title: 'All Visits', tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Safety"
        component={SafetyDashboardScreen}
        options={{ title: 'Safety', tabBarIcon: ({ color, size }) => <Feather name="shield" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Wraps the tab navigator in a stack so the doctor-assignment picker can be
// presented modally on top, mirroring web's AssignDoctorDialog overlay.
export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="AssignProviderModal"
        component={AssignProviderModal}
        options={{ presentation: 'modal', title: 'Assign Provider' }}
      />
      <Stack.Screen name="Nurses" component={NursesScreen} options={{ title: 'Nurses' }} />
      <Stack.Screen name="Physiotherapists" component={PhysiotherapistsScreen} options={{ title: 'Physiotherapists' }} />
      <Stack.Screen name="CreateNurseModal" component={CreateNurseModal} options={{ presentation: 'modal', title: 'Add Nurse' }} />
      <Stack.Screen
        name="CreatePhysiotherapistModal"
        component={CreatePhysiotherapistModal}
        options={{ presentation: 'modal', title: 'Add Physiotherapist' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="StaticInfo" component={StaticInfoScreen} options={{ title: '' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
    </Stack.Navigator>
  );
}
