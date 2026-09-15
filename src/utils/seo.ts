import { site } from '@/config/site';

export interface SeoMeta {
  title: string;
  description: string;
  /** Path only, e.g. /catalog — combined with site.url for the canonical tag. */
  path: string;
  type?: 'website' | 'product' | 'article';
  noIndex?: boolean;
}

export function pageTitle(title: string): string {
  return title === site.name ? `${site.name} — ${site.tagline}` : `${title} · ${site.name}`;
}

export function canonicalUrl(path: string): string {
  const base = site.url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
