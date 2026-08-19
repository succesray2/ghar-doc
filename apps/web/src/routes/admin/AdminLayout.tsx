import { AppShell } from '../../components/AppShell';

export function AdminLayout() {
  return <AppShell roleLabel="Admin" navItems={[{ to: '/admin/visits', label: 'All Visits' }]} />;
}
