import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { HomeScreen } from '../screens/patient/HomeScreen';
import { MyVisitsScreen } from '../screens/patient/MyVisitsScreen';
import { DoctorsScreen } from '../screens/patient/DoctorsScreen';
import { DiagnosticsScreen } from '../screens/patient/DiagnosticsScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { colors } from '../theme/colors';
import type { PatientTabParamList } from './types';

const Tab = createBottomTabNavigator<PatientTabParamList>();

export function PatientTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.teal600, tabBarInactiveTintColor: colors.ink400, headerShown: false }}>
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
        name="Doctors"
        component={DoctorsScreen}
        options={{ title: 'Doctors', tabBarIcon: ({ color, size }) => <Feather name="user-plus" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Diagnostics"
        component={DiagnosticsScreen}
        options={{ title: 'Diagnostics', tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'Account', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
