import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { AssignedVisitsScreen } from '../screens/nurse/AssignedVisitsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import type { NurseTabParamList } from './types';

const Tab = createBottomTabNavigator<NurseTabParamList>();

export function NurseTabs() {
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
