import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { productService } from '@/services/products';
import type { Product } from '@/types/domain';
import { formatMoney } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface SearchBarProps {
  /** Rendered inside the header overlay vs. inline on the search page. */
  variant?: 'overlay' | 'inline';
  initialValue?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  onChange?: (value: string) => void;
  placeholder?: string;
}

/**
 * Keyboard-first search input with a suggestion list.
 * Arrow keys move through suggestions, Enter opens the highlighted one (or runs
 * a full search), Escape clears.
 */
export function SearchBar({
  variant = 'overlay',
  initialValue = '',
  autoFocus,
  onSubmitted,
  onChange,
  placeholder = 'Search cards, brands or denominations',
}: SearchBarProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [highlight, setHighlight] = useState(-1);
  const debounced = useDebouncedValue(term, 180);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    let active = true;
    if (debounced.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    void productService()
      .suggest(debounced, 5)
      .then((result) => {
        if (active && result.ok) {
          setSuggestions(result.data);
          setHighlight((current) => (current === -1 ? current : -1));
        }
      });
    return () => {
      active = false;
    };
  }, [debounced]);

  const runSearch = (value: string) => {
    const query = value.trim();
    if (!query) return;
    navigate(`${ROUTES.search}?q=${encodeURIComponent(query)}`);
    onSubmitted?.();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((current) => Math.max(current - 1, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const picked = suggestions[highlight];
      if (picked) {
        navigate(ROUTES.product(picked.slug));
        onSubmitted?.();
      } else {
        runSearch(term);
      }
    } else if (event.key === 'Escape') {
      setTerm('');
      setSuggestions([]);
    }
  };

  const showSuggestions = variant === 'overlay' && suggestions.length > 0;

  return (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          runSearch(term);
        }}
      >
        <label htmlFor="voidcard-search" className="sr-only">
          Search the catalogue
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-void-400"
          />
          <input
            ref={inputRef}
            id="voidcard-search"
            type="search"
            value={term}
            onChange={(event) => {
              setTerm(event.target.value);
              onChange?.(event.target.value);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={showSuggestions ? 'search-suggestions' : undefined}
            className={cn(
              'h-12 w-full rounded-[12px] border border-white/9 bg-void-900/80 pr-10 pl-11 text-sm text-void-50 transition-colors placeholder:text-void-400 hover:border-white/16 focus:border-accent-500/60 focus:outline-none',
              variant === 'inline' && 'h-13',
            )}
          />
          {term && (
            <button
              type="button"
              onClick={() => {
                setTerm('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-void-400 hover:text-void-100"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className="panel absolute inset-x-0 top-[calc(100%+8px)] z-10 max-h-80 overflow-y-auto rounded-[12px] p-1.5"
        >
          {suggestions.map((product, index) => (
            <li key={product.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseEnter={() => {
                  setHighlight(index);
                }}
                onClick={() => {
                  navigate(ROUTES.product(product.slug));
                  onSubmitted?.();
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-4 rounded-[9px] px-3 py-2.5 text-left transition-colors',
                  index === highlight ? 'bg-white/7' : 'hover:bg-white/5',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-void-50">{product.name}</span>
                  <span className="mono-label">{product.categoryName}</span>
                </span>
                <span className="shrink-0 text-[13px] text-void-100 tabular">
                  {formatMoney(product.price)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
