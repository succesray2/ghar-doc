import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { AssignedVisitsScreen } from '../screens/doctor/AssignedVisitsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import type { DoctorTabParamList } from './types';

const Tab = createBottomTabNavigator<DoctorTabParamList>();

export function DoctorTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.brand600, tabBarInactiveTintColor: colors.textMuted }}>
      <Tab.Screen
        name="AssignedVisits"
        component={AssignedVisitsScreen}
        options={{ title: 'My Visits', tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
