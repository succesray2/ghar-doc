import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { RequestVisitScreen } from '../screens/patient/RequestVisitScreen';
import { MyVisitsScreen } from '../screens/patient/MyVisitsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import type { PatientTabParamList } from './types';

const Tab = createBottomTabNavigator<PatientTabParamList>();

export function PatientTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.brand600, tabBarInactiveTintColor: colors.textMuted }}>
      <Tab.Screen
        name="RequestVisit"
        component={RequestVisitScreen}
        options={{ title: 'Request Visit', tabBarIcon: ({ color, size }) => <Feather name="plus-circle" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="MyVisits"
        component={MyVisitsScreen}
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
