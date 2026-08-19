import { AppShell } from '../../components/AppShell';

export function PatientLayout() {
  return (
    <AppShell
      roleLabel="Patient"
      navItems={[
        { to: '/patient/visits', label: 'My Visits' },
        { to: '/patient/request', label: 'Request a Visit' },
      ]}
    />
  );
}
