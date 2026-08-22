import { AppShell } from '../../components/AppShell';

export function PhysiotherapistLayout() {
  return (
    <AppShell
      roleLabel="Physiotherapist"
      navItems={[
        { to: '/physio/visits', label: 'Assigned Visits' },
        { to: '/physio/settings', label: 'Settings' },
      ]}
    />
  );
}
