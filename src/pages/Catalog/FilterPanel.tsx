import { X } from 'lucide-react';
import type { AvailabilityState, Category } from '@/types/domain';
import { formatMoney } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/forms/Checkbox';

export interface CatalogFilters {
  categories: string[];
  maxPrice: number | null;
  minDiscount: number;
  availability: AvailabilityState[];
}

export const EMPTY_FILTERS: CatalogFilters = {
  categories: [],
  maxPrice: null,
  minDiscount: 0,
  availability: [],
};

const AVAILABILITY_OPTIONS: { value: AvailabilityState; label: string }[] = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'preorder', label: 'Pre-order' },
];

const DISCOUNT_STEPS = [0, 4, 6, 8];

export interface FilterPanelProps {
  categories: Category[];
  filters: CatalogFilters;
  priceRange: { min: number; max: number };
  onChange: (filters: CatalogFilters) => void;
}

export function FilterPanel({ categories, filters, priceRange, onChange }: FilterPanelProps) {
  const activeCount =
    filters.categories.length +
    filters.availability.length +
    (filters.maxPrice !== null ? 1 : 0) +
    (filters.minDiscount > 0 ? 1 : 0);

  const toggleCategory = (slug: string) => {
    onChange({
      ...filters,
      categories: filters.categories.includes(slug)
        ? filters.categories.filter((item) => item !== slug)
        : [...filters.categories, slug],
    });
  };

  const toggleAvailability = (value: AvailabilityState) => {
    onChange({
      ...filters,
      availability: filters.availability.includes(value)
        ? filters.availability.filter((item) => item !== value)
        : [...filters.availability, value],
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="mono-label">Filters</h2>
        {activeCount > 0 && (
          <Button
            variant="link"
            size="sm"
            iconLeft={<X />}
            onClick={() => {
              onChange(EMPTY_FILTERS);
            }}
          >
            Clear {activeCount}
          </Button>
        )}
      </div>

      <fieldset className="border-0 p-0">
        <legend className="mb-3 text-[13px] font-medium text-void-100">Category</legend>
        <div className="space-y-2.5">
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              label={category.name}
              checked={filters.categories.includes(category.slug)}
              onChange={() => {
                toggleCategory(category.slug);
              }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-3 text-[13px] font-medium text-void-100">Maximum price</legend>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={5}
          value={filters.maxPrice ?? priceRange.max}
          aria-label="Maximum price"
          onChange={(event) => {
            const value = Number(event.target.value);
            onChange({ ...filters, maxPrice: value >= priceRange.max ? null : value });
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-void-600 accent-[var(--color-accent-500)]"
        />
        <p className="mt-2.5 text-[12px] text-void-300 tabular">
          Up to {formatMoney(filters.maxPrice ?? priceRange.max)}
        </p>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-3 text-[13px] font-medium text-void-100">Minimum discount</legend>
        <div className="flex flex-wrap gap-2">
          {DISCOUNT_STEPS.map((step) => {
            const active = filters.minDiscount === step;
            return (
              <button
                key={step}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  onChange({ ...filters, minDiscount: step });
                }}
                className={
                  active
                    ? 'h-9 rounded-[9px] border border-accent-500/40 bg-accent-500/12 px-3 text-[12.5px] text-accent-400'
                    : 'h-9 rounded-[9px] border border-white/9 px-3 text-[12.5px] text-void-200 transition-colors hover:border-white/18'
                }
              >
                {step === 0 ? 'Any' : `${step}%+`}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-3 text-[13px] font-medium text-void-100">Availability</legend>
        <div className="space-y-2.5">
          {AVAILABILITY_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={filters.availability.includes(option.value)}
              onChange={() => {
                toggleAvailability(option.value);
              }}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
