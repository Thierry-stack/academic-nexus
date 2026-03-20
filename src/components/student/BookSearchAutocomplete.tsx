'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface BookSuggestion {
  id: string;
  title: string;
  author: string;
  isbn: string;
}

interface BookSearchAutocompleteProps {
  variant: 'hero' | 'inline';
  value: string;
  onChange: (value: string) => void;
  onSubmitSearch?: () => void;
  /** If set, called after a suggestion is chosen (e.g. navigate to catalog). */
  onSuggestionSelect?: (suggestion: BookSuggestion) => void;
  placeholder?: string;
}

export default function BookSearchAutocomplete({
  variant,
  value,
  onChange,
  onSubmitSearch,
  onSuggestionSelect,
  placeholder,
}: BookSearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debounced, setDebounced] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useRef(`book-search-suggestions-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 220);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const q = debounced.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/books/suggestions?q=${encodeURIComponent(q)}`
        );
        if (!res.ok) {
          if (!cancelled) setSuggestions([]);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
        }
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    const v = value.trim();
    const d = debounced.trim();
    if (suggestions.length > 0 && v.length >= 2 && v === d) {
      setOpen(true);
    }
  }, [suggestions, debounced, value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const showList = open && suggestions.length > 0;

  const pickSuggestion = useCallback(
    (s: BookSuggestion) => {
      onChange(s.title);
      setOpen(false);
      setActiveIndex(-1);
      onSuggestionSelect?.(s);
    },
    [onChange, onSuggestionSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) {
      if (e.key === 'Enter' && onSubmitSearch) {
        onSubmitSearch();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        pickSuggestion(suggestions[activeIndex]);
      } else if (onSubmitSearch) {
        onSubmitSearch();
      }
    }
  };

  const inputClass =
    variant === 'hero'
      ? 'w-full px-6 py-4 pr-36 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent text-lg shadow-sm'
      : 'w-full px-6 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent shadow-sm';

  return (
    <div ref={rootRef} className={variant === 'hero' ? 'max-w-2xl mx-auto' : 'w-full'}>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listId : undefined}
          aria-autocomplete="list"
          placeholder={
            placeholder ??
            (variant === 'hero'
              ? 'Search for books, authors, ISBN, or topics...'
              : 'Search by title, author, ISBN, or description...')
          }
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (value.trim().length >= 2 && suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={inputClass}
        />

        {variant === 'hero' ? (
          <button
            type="button"
            onClick={() => onSubmitSearch?.()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-academic-blue text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        ) : (
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden
          >
            🔍
          </div>
        )}

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
          >
            {suggestions.map((s, index) => (
              <li key={s.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left text-sm transition-colors ${
                    index === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickSuggestion(s)}
                >
                  <span className="font-medium text-gray-900">{s.title}</span>
                  <span className="text-gray-600">by {s.author}</span>
                  {s.isbn ? (
                    <span className="text-xs text-gray-400">ISBN {s.isbn}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
