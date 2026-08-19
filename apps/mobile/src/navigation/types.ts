export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type PatientTabParamList = {
  Home: undefined;
  MyVisits: undefined;
  RequestVisit: { reasonHint?: string } | undefined;
  Support: undefined;
  Profile: undefined;
};

export type DoctorTabParamList = {
  AssignedVisits: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  AllVisits: undefined;
  Profile: undefined;
};

// Admin's tabs live inside a stack so the doctor-assignment picker can be a
// modal-presented screen on top, mirroring web's AssignDoctorDialog overlay.
export type AdminStackParamList = {
  AdminTabs: undefined;
  AssignDoctorModal: { visitId: string; reasonForVisit: string };
};
