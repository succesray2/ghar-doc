import { AppShell } from '../../components/AppShell';

export function NurseLayout() {
  return (
    <AppShell
      roleLabel="Nurse"
      navItems={[
        { to: '/nurse/visits', label: 'Assigned Visits' },
        { to: '/nurse/settings', label: 'Settings' },
      ]}
    />
  );
}
