import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// The 5 patient tabs are deliberately "dumb" — no params, no sub-navigation
// logic of their own. Every drill-down (doctor profile, diagnostic test,
// account sub-page, booking flow) lives on the parent PatientStack instead,
// reached via navigation.getParent(). Keeps the tab bar simple and every
// deep screen reachable from any tab without duplicating navigators.
export type PatientTabParamList = {
  Home: undefined;
  MyVisits: undefined;
  Doctors: undefined;
  Diagnostics: undefined;
  Account: undefined;
};

export type BookingKind = 'consultation' | 'home-visit' | 'diagnostic-test' | 'diagnostic-package';

export type PatientStackParamList = {
  PatientTabs: NavigatorScreenParams<PatientTabParamList> | undefined;
  RequestVisit: { reasonHint?: string } | undefined;
  RequestNursing: undefined;
  RequestPhysiotherapy: undefined;
  DoctorProfile: { doctorId: string };
  MockBooking: { kind: BookingKind; id: string; title: string; price: number };
  BookingConfirmation: { title: string; subtitle: string };
  DiagnosticCategory: { categorySlug: string };
  DiagnosticTestDetail: { testSlug: string };
  DiagnosticPackageDetail: { packageSlug: string };
  HealthRecords: undefined;
  FamilyMembers: undefined;
  CarePlans: undefined;
  Notifications: undefined;
  HealthGuides: undefined;
  Emergency: undefined;
  EditProfile: undefined;
  StaticInfo: { title: string; body: string };
  Support: undefined;
  Settings: undefined;
};

export type DoctorTabParamList = {
  AssignedVisits: undefined;
  Profile: undefined;
};

// Doctor's tabs live inside a stack (mirroring Admin's) so Settings can be
// pushed on top rather than needing a 3rd tab.
export type DoctorStackParamList = {
  DoctorTabs: undefined;
  Settings: undefined;
  EditProfile: undefined;
  StaticInfo: { title: string; body: string };
  Support: undefined;
};

// Nurse and Physiotherapist mirror Doctor's tabs/stack shape exactly.
export type NurseTabParamList = {
  AssignedVisits: undefined;
  Profile: undefined;
};

export type NurseStackParamList = {
  NurseTabs: undefined;
  Settings: undefined;
  EditProfile: undefined;
  StaticInfo: { title: string; body: string };
  Support: undefined;
};

export type PhysiotherapistTabParamList = {
  AssignedVisits: undefined;
  Profile: undefined;
};

export type PhysiotherapistStackParamList = {
  PhysiotherapistTabs: undefined;
  Settings: undefined;
  EditProfile: undefined;
  StaticInfo: { title: string; body: string };
  Support: undefined;
};

export type AdminTabParamList = {
  AllVisits: undefined;
  Safety: undefined;
  Profile: undefined;
};

// Admin's tabs live inside a stack so the provider-assignment picker, the
// Nurse/Physiotherapist directories, and Settings can be pushed/presented on
// top, mirroring web's AssignProviderDialog overlay and directory pages.
export type AdminStackParamList = {
  AdminTabs: undefined;
  AssignProviderModal: { visitId: string; reasonForVisit: string; serviceType: 'DOCTOR_VISIT' | 'NURSING' | 'PHYSIOTHERAPY' };
  Nurses: undefined;
  Physiotherapists: undefined;
  CreateNurseModal: undefined;
  CreatePhysiotherapistModal: undefined;
  Settings: undefined;
  EditProfile: undefined;
  StaticInfo: { title: string; body: string };
  Support: undefined;
};

// Shorthand for a patient tab screen that also needs to push onto the
// parent stack (e.g. Doctors tab navigating to DoctorProfile).
export type PatientTabScreenProps<T extends keyof PatientTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, T>,
  NativeStackScreenProps<PatientStackParamList>
>;
