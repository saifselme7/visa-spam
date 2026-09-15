import type { CategoryRow } from '@/types/database';

/** Mock rows shaped exactly like the future `public.categories` table. */
export const categoryRows: CategoryRow[] = [
  {
    id: 'c1000000-0000-4000-8000-000000000001',
    slug: 'prepaid-cards',
    name: 'Prepaid Cards',
    description: 'General-purpose prepaid denominations for online checkout.',
    position: 1,
    created_at: '2025-11-02T09:00:00.000Z',
  },
  {
    id: 'c1000000-0000-4000-8000-000000000002',
    slug: 'retail',
    name: 'Retail',
    description: 'Gift cards for large online and physical retailers.',
    position: 2,
    created_at: '2025-11-02T09:00:00.000Z',
  },
  {
    id: 'c1000000-0000-4000-8000-000000000003',
    slug: 'gaming',
    name: 'Gaming',
    description: 'Store credit for gaming platforms and marketplaces.',
    position: 3,
    created_at: '2025-11-02T09:00:00.000Z',
  },
  {
    id: 'c1000000-0000-4000-8000-000000000004',
    slug: 'streaming',
    name: 'Streaming',
    description: 'Subscription credit for music and video services.',
    position: 4,
    created_at: '2025-11-02T09:00:00.000Z',
  },
  {
    id: 'c1000000-0000-4000-8000-000000000005',
    slug: 'travel',
    name: 'Travel',
    description: 'Prepaid travel and mobility credit.',
    position: 5,
    created_at: '2025-11-02T09:00:00.000Z',
  },
];
