import { AppShell } from '../../components/AppShell';

export function DoctorLayout() {
  return <AppShell roleLabel="Doctor" navItems={[{ to: '/doctor/visits', label: 'Assigned Visits' }]} />;
}
