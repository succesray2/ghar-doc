import { useEffect } from 'react';

// No SSR here (plain client-rendered Vite SPA), so this covers what actually
// matters for a site this size: an accurate <title> and meta description per
// route (both used by browsers/search snippets and social re-shares of a
// visited URL), without pulling in a routing-aware head-management library
// for six static pages.
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — Ghar Doc`;

    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? '';
    meta?.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      meta?.setAttribute('content', previousDescription);
    };
  }, [title, description]);
}
