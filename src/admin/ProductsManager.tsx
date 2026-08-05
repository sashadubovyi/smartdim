import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/store';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { ProductForm } from './ProductForm';
import { Icon } from '../components/icons/Icon';

export function ProductsManager() {
  const { products, content, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Товари</h2>
          <p className="text-sm text-ink-soft">{products.length} позицій у каталозі</p>
        </div>
        <button type="button" onClick={() => setCreating(true)} className="btn-primary">
          <Icon name="plus" size={18} /> Додати
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-soft"
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-ink">{product.title}</p>
                  {product.featured && (
                    <span className="chip shrink-0 bg-mint-100 text-brand-700">
                      <Icon name="star" size={12} /> ТОП
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-ink-muted">{product.category}</p>
                <p className="mt-0.5 text-sm font-bold text-brand-700">
                  {formatPrice(product.price, content.currency)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(product)}
                  aria-label="Редагувати"
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-mint-100 text-brand-700 transition active:scale-95"
                >
                  <Icon name="edit" size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(product.id)}
                  aria-label="Видалити"
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-500 transition active:scale-95"
                >
                  <Icon name="trash" size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {products.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center text-ink-soft shadow-soft">
            Ще немає товарів. Натисніть «Додати», щоб створити перший.
          </div>
        )}
      </div>

      <AnimatePresence>
        {(creating || editing) && (
          <ProductForm
            product={editing}
            onClose={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmId && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-sm rounded-4xl bg-white p-6 text-center shadow-card"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
                <Icon name="trash" size={26} />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-ink">Видалити товар?</h3>
              <p className="mt-1 text-sm text-ink-soft">Цю дію не можна скасувати.</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setConfirmId(null)} className="btn-ghost flex-1">
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteProduct(confirmId);
                    setConfirmId(null);
                  }}
                  className="btn flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  Видалити
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
