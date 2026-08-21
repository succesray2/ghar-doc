import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PatientTabs } from './PatientTabs';
import { RequestVisitScreen } from '../screens/patient/RequestVisitScreen';
import { DoctorProfileScreen } from '../screens/patient/DoctorProfileScreen';
import { MockBookingScreen } from '../screens/patient/MockBookingScreen';
import { BookingConfirmationScreen } from '../screens/patient/BookingConfirmationScreen';
import { DiagnosticCategoryScreen } from '../screens/patient/DiagnosticCategoryScreen';
import { DiagnosticTestDetailScreen } from '../screens/patient/DiagnosticTestDetailScreen';
import { DiagnosticPackageDetailScreen } from '../screens/patient/DiagnosticPackageDetailScreen';
import { HealthRecordsScreen } from '../screens/HealthRecordsScreen';
import { FamilyMembersScreen } from '../screens/FamilyMembersScreen';
import { CarePlansScreen } from '../screens/CarePlansScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { HealthGuidesScreen } from '../screens/HealthGuidesScreen';
import { EmergencyScreen } from '../screens/EmergencyScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StaticInfoScreen } from '../screens/StaticInfoScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { colors, fonts } from '../theme/colors';
import type { PatientStackParamList } from './types';

const Stack = createNativeStackNavigator<PatientStackParamList>();

const headerOptions = {
  headerTintColor: colors.ink900,
  headerTitleStyle: { fontFamily: fonts.bold },
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
} as const;

export function PatientNavigator() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="PatientTabs" component={PatientTabs} options={{ headerShown: false }} />
      <Stack.Screen name="RequestVisit" component={RequestVisitScreen} options={{ title: 'Doctor Home Visit' }} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} options={{ title: 'Doctor Profile' }} />
      <Stack.Screen name="MockBooking" component={MockBookingScreen} options={{ title: 'Confirm Booking' }} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DiagnosticCategory" component={DiagnosticCategoryScreen} options={{ title: 'Tests' }} />
      <Stack.Screen name="DiagnosticTestDetail" component={DiagnosticTestDetailScreen} options={{ title: 'Test Details' }} />
      <Stack.Screen name="DiagnosticPackageDetail" component={DiagnosticPackageDetailScreen} options={{ title: 'Package Details' }} />
      <Stack.Screen name="HealthRecords" component={HealthRecordsScreen} options={{ title: 'Health Records' }} />
      <Stack.Screen name="FamilyMembers" component={FamilyMembersScreen} options={{ title: 'Family Members' }} />
      <Stack.Screen name="CarePlans" component={CarePlansScreen} options={{ title: 'Care Plans' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="HealthGuides" component={HealthGuidesScreen} options={{ title: 'Health Guides' }} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="StaticInfo" component={StaticInfoScreen} options={{ title: '' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
    </Stack.Navigator>
  );
}
