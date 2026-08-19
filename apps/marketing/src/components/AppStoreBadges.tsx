export function AppStoreBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-line bg-bg-soft px-4 py-2 text-ink-400">
        <AppleIcon />
        <span className="text-left leading-tight">
          <span className="block text-[10px]">Coming soon on</span>
          <span className="block text-sm font-semibold">App Store</span>
        </span>
      </span>
      <span className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-line bg-bg-soft px-4 py-2 text-ink-400">
        <PlayIcon />
        <span className="text-left leading-tight">
          <span className="block text-[10px]">Coming soon on</span>
          <span className="block text-sm font-semibold">Google Play</span>
        </span>
      </span>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.437 2.15-1.14 2.94-.83.94-2.13 1.66-3.13 1.58-.12-1.1.43-2.24 1.13-2.97.83-.9 2.26-1.57 3.14-1.55zM20.7 17.24c-.53 1.22-.78 1.77-1.46 2.85-.95 1.5-2.28 3.36-3.94 3.38-1.47.02-1.85-.96-3.85-.95-2 .01-2.42.97-3.9.95-1.66-.02-2.92-1.7-3.87-3.2C1.4 16.9.8 12.5 2.86 9.6c1.02-1.44 2.62-2.35 4.13-2.37 1.53-.03 2.5 1.02 3.77 1.02 1.26 0 2-.02 3.77-1.02.3-.17 2.36-.9 3.98 1.2-3.6 2.03-3.02 6.7-.05 8.02z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.6l10 9.4-10 9.4c-.36-.4-.6-.94-.6-1.6V4.2c0-.66.24-1.2.6-1.6zM14.9 12l2.9-2.72L4.9 2.6l10 9.4zM4.9 21.4l12.9-6.68L14.9 12l-10 9.4zM18.6 8.4l2.6 1.5c.8.46.8 1.74 0 2.2l-2.6 1.5-2.9-2.6 2.9-2.6z" />
    </svg>
  );
}
