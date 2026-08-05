import { useRef, useState } from 'react';
import { Reorder } from 'framer-motion';
import { fileToCompressedDataUrl } from '../lib/image';
import { Icon } from '../components/icons/Icon';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [urlValue, setUrlValue] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const encoded: string[] = [];
      for (const file of Array.from(files)) {
        encoded.push(await fileToCompressedDataUrl(file));
      }
      onChange([...images, ...encoded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося завантажити зображення.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function addUrl() {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlValue('');
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="label">Зображення (перше — головне, можна перетягувати)</label>

      {images.length > 0 && (
        <Reorder.Group axis="x" values={images} onReorder={onChange} className="mb-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <Reorder.Item
              key={src}
              value={src}
              className="relative h-24 w-24 cursor-grab overflow-hidden rounded-2xl ring-1 ring-mint-200 active:cursor-grabbing"
            >
              <img src={src} alt={`Фото ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                  Головне
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Видалити зображення"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-red-500 shadow"
              >
                <Icon name="close" size={14} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="btn-soft"
        >
          <Icon name="image" size={18} /> {busy ? 'Обробка…' : 'Завантажити фото'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="mt-2 flex gap-2">
        <input
          className="field"
          placeholder="…або вставте посилання на зображення"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button type="button" onClick={addUrl} className="btn-ghost shrink-0">
          <Icon name="plus" size={18} />
        </button>
      </div>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-ink-muted">
        Фото автоматично стискаються для швидкого завантаження. Рекомендовано до 5–6 зображень на товар.
      </p>
    </div>
  );
}
