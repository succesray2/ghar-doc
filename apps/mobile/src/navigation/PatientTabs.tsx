import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { HomeScreen } from '../screens/patient/HomeScreen';
import { MyVisitsScreen } from '../screens/patient/MyVisitsScreen';
import { RequestVisitScreen } from '../screens/patient/RequestVisitScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import type { PatientTabParamList } from './types';

const Tab = createBottomTabNavigator<PatientTabParamList>();

export function PatientTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.brand600, tabBarInactiveTintColor: colors.textMuted }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="MyVisits"
        component={MyVisitsScreen}
        options={{ title: 'Visits', tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="RequestVisit"
        component={RequestVisitScreen}
        options={{ title: 'Doctor Visit', tabBarIcon: ({ color, size }) => <Feather name="user-plus" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'Support', tabBarIcon: ({ color, size }) => <Feather name="headphones" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Care', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
