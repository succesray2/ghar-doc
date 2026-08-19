import { Outlet } from 'react-router-dom';
import { useSessionBootstrap } from '../hooks/useAuth';

export function RootLayout() {
  const { isLoading } = useSessionBootstrap();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading Ghar Doc…</div>;
  }

  return <Outlet />;
}
