import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AllVisitsScreen } from '../screens/admin/AllVisitsScreen';
import { SafetyDashboardScreen } from '../screens/admin/SafetyDashboardScreen';
import { AssignDoctorModal } from '../screens/admin/AssignDoctorModal';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import type { AdminStackParamList, AdminTabParamList } from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

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
    <Stack.Navigator>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="AssignDoctorModal"
        component={AssignDoctorModal}
        options={{ presentation: 'modal', title: 'Assign Doctor' }}
      />
    </Stack.Navigator>
  );
}
