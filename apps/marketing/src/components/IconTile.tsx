import clsx from 'clsx';
import { iconMap, type IconName } from '../lib/icons';

const TONE_STYLES = {
  navy: 'bg-navy-900/5 text-navy-700',
  teal: 'bg-teal-100 text-teal-600',
  sage: 'bg-sage-100 text-sage-600',
} as const;

export function IconTile({
  icon,
  tone = 'navy',
  size = 'md',
}: {
  icon: IconName;
  tone?: keyof typeof TONE_STYLES;
  size?: 'sm' | 'md';
}) {
  const Icon = iconMap[icon];
  return (
    <span
      className={clsx(
        'inline-flex flex-shrink-0 items-center justify-center rounded-xl',
        size === 'md' ? 'h-11 w-11' : 'h-9 w-9',
        TONE_STYLES[tone],
      )}
      aria-hidden="true"
    >
      <Icon size={size === 'md' ? 22 : 18} strokeWidth={1.75} />
    </span>
  );
}
