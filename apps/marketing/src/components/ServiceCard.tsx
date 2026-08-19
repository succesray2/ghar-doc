import type { Service } from '../data/services';
import { IconTile } from './IconTile';

export function ServiceCard({ service, id }: { service: Service; id?: string }) {
  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <IconTile icon={service.icon} tone="teal" />
      <h3 className="mb-1.5 mt-4 text-lg font-semibold text-navy-900">{service.title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-ink-600">{service.summary}</p>
      <ul className="space-y-1.5">
        {service.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2 text-sm text-ink-600">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
