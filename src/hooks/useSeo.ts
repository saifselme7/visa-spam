import { useEffect } from 'react';
import { canonicalUrl, pageTitle, type SeoMeta } from '@/utils/seo';
import { site } from '@/config/site';

function upsertMeta(selector: string, attrs: Record<string, string>): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Per-route document metadata. Small and dependency-free — a helmet library
 * would be overkill for a handful of tags.
 */
export function useSeo({ title, description, path, type = 'website', noIndex }: SeoMeta): void {
  useEffect(() => {
    const resolved = pageTitle(title);
    const url = canonicalUrl(path);

    document.title = resolved;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex,nofollow' : 'index,follow',
    });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: resolved });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: site.name });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: resolved });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    upsertCanonical(url);
  }, [title, description, path, type, noIndex]);
}
