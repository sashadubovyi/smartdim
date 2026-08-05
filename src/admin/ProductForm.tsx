import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product, Spec } from '../types';
import { useStore } from '../store/store';
import { EMPTY_IMAGE } from '../lib/placeholders';
import { ImageUploader } from './ImageUploader';
import { Icon } from '../components/icons/Icon';

interface ProductFormProps {
  product: Product | null; // null = create new
  onClose: () => void;
}

interface FormState {
  title: string;
  tagline: string;
  category: string;
  description: string;
  price: string;
  oldPrice: string;
  images: string[];
  specs: Spec[];
  featured: boolean;
}

function toFormState(product: Product | null): FormState {
  return {
    title: product?.title ?? '',
    tagline: product?.tagline ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    oldPrice: product?.oldPrice ? String(product.oldPrice) : '',
    images: product?.images ?? [],
    specs: product?.specs?.length ? product.specs : [{ label: '', value: '' }],
    featured: product?.featured ?? false,
  };
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { createProduct, updateProduct, categories } = useStore();
  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [error, setError] = useState('');

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSpec(index: number, patch: Partial<Spec>) {
    set(
      'specs',
      form.specs.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Вкажіть назву товару.');
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setError('Вкажіть коректну ціну.');
      return;
    }

    const cleanSpecs = form.specs.filter((s) => s.label.trim() || s.value.trim());
    const images = form.images.length ? form.images : [EMPTY_IMAGE];

    const payload = {
      title: form.title.trim(),
      tagline: form.tagline.trim() || undefined,
      category: form.category.trim() || 'Без категорії',
      description: form.description.trim(),
      price,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      images,
      specs: cleanSpecs,
      featured: form.featured,
    };

    try {
      if (product) updateProduct(product.id, payload);
      else createProduct(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти товар.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto my-6 w-full max-w-2xl px-4"
      >
        <form onSubmit={handleSubmit} className="surface p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-ink">
              {product ? 'Редагувати товар' : 'Новий товар'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрити"
              className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-brand-700"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Назва *</label>
              <input
                className="field"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Помпа для води Redsack"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Категорія</label>
                <input
                  className="field"
                  list="category-list"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  placeholder="Помпи для бутлів"
                />
                <datalist id="category-list">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="label">Підпис / серія</label>
                <input
                  className="field"
                  value={form.tagline}
                  onChange={(e) => set('tagline', e.target.value)}
                  placeholder="Redsack"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Ціна *</label>
                <input
                  className="field"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="1015"
                />
              </div>
              <div>
                <label className="label">Стара ціна</label>
                <input
                  className="field"
                  inputMode="numeric"
                  value={form.oldPrice}
                  onChange={(e) => set('oldPrice', e.target.value)}
                  placeholder="1290"
                />
              </div>
            </div>

            <ImageUploader images={form.images} onChange={(imgs) => set('images', imgs)} />

            <div>
              <label className="label">Опис</label>
              <textarea
                className="field min-h-[110px] resize-y"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Детальний опис товару…"
              />
            </div>

            {/* Specs editor */}
            <div>
              <label className="label">Характеристики</label>
              <div className="space-y-2">
                {form.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="field"
                      value={spec.label}
                      onChange={(e) => updateSpec(i, { label: e.target.value })}
                      placeholder="Бренд"
                    />
                    <input
                      className="field"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, { value: e.target.value })}
                      placeholder="Redsack"
                    />
                    <button
                      type="button"
                      onClick={() => set('specs', form.specs.filter((_, idx) => idx !== i))}
                      aria-label="Видалити характеристику"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-100 text-red-500"
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => set('specs', [...form.specs, { label: '', value: '' }])}
                className="btn-soft mt-2"
              >
                <Icon name="plus" size={16} /> Додати характеристику
              </button>
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-mint-50 px-4 py-3 ring-1 ring-mint-100">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-5 w-5 rounded accent-brand"
              />
              <span className="text-sm font-semibold text-ink">
                Показувати у блоці «Рекомендовані» (верхній слайдер)
              </span>
            </label>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Скасувати
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Icon name="check" size={18} /> Зберегти
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
