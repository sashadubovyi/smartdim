import { useEffect, useRef, useState } from 'react';

interface AutocompleteProps<T> {
  value: string;
  onChange: (v: string) => void; // вільне введення тексту
  onPick: (item: T) => void; // вибір підказки зі списку
  fetcher: (q: string) => Promise<T[]>;
  getLabel: (item: T) => string;
  getSub?: (item: T) => string | undefined;
  placeholder?: string;
  disabled?: boolean;
  minChars?: number;
}

// Легкий автокомпліт: debounce + випадаючий список. Без сторонніх бібліотек.
export function Autocomplete<T>({
  value,
  onChange,
  onPick,
  fetcher,
  getLabel,
  getSub,
  placeholder,
  disabled,
  minChars = 2,
}: AutocompleteProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const skipNext = useRef(false); // не шукати одразу після вибору зі списку

  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (disabled || value.trim().length < minChars) {
      setItems([]);
      setOpen(false);
      return;
    }
    let active = true;
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await fetcher(value);
      if (!active) return;
      setItems(res);
      setLoading(false);
      setOpen(true);
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled]);

  // Закриття при кліку поза компонентом.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <input
        className="field"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
        autoComplete="off"
      />
      {open && (items.length > 0 || loading) && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-mint-200 bg-white py-1 shadow-card">
          {loading && items.length === 0 ? (
            <div className="px-4 py-2 text-sm text-ink-muted">Пошук…</div>
          ) : (
            items.map((item, i) => {
              const sub = getSub?.(item);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    skipNext.current = true;
                    onPick(item);
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-mint-50"
                >
                  <span className="font-medium text-ink">{getLabel(item)}</span>
                  {sub && <span className="ml-2 text-xs text-ink-muted">{sub}</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
