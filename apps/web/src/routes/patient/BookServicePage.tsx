import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

const SERVICES = [
  {
    to: '/patient/request',
    title: 'Doctor Home Visit',
    summary: 'General physician consultations for fever, infections, and routine checkups.',
  },
  {
    to: '/patient/request-nursing',
    title: 'Home Nursing',
    summary: 'Trained nurses for injections, IV drips, and wound care at home.',
  },
  {
    to: '/patient/request-physiotherapy',
    title: 'Physiotherapy',
    summary: 'Post-injury recovery and rehabilitation with a plan built around you.',
  },
];

export function BookServicePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">What do you need?</h1>
      <p className="text-sm text-slate-500">Choose a service to start your request.</p>
      <div className="space-y-3">
        {SERVICES.map((s) => (
          <Card key={s.to} className="cursor-pointer transition-colors hover:border-brand-300" onClick={() => navigate(s.to)}>
            <p className="font-medium text-slate-800">{s.title}</p>
            <p className="text-sm text-slate-500">{s.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
