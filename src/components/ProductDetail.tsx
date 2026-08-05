import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { ImageGallery } from './ImageGallery';
import { Icon } from './icons/Icon';

interface ProductDetailProps {
  product: Product | null;
  currency: string;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export function ProductDetail({ product, currency, onClose, onAdd }: ProductDetailProps) {
  const [added, setAdded] = useState(false);

  // Reset the "added" confirmation whenever a different product is opened.
  useEffect(() => {
    setAdded(false);
  }, [product]);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (product) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative mx-auto min-h-full w-full max-w-lg"
            initial={{ y: 40, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            <div className="relative mt-6 min-h-[calc(100dvh-1.5rem)] rounded-t-5xl bg-white px-5 pb-36 pt-5 shadow-card sm:mt-10 sm:min-h-0 sm:rounded-5xl">
              {/* Top bar */}
              <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between rounded-t-5xl bg-white/85 px-5 py-2 backdrop-blur">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Назад"
                  className="grid h-11 w-11 place-items-center rounded-full bg-mint-100 text-brand-700 transition active:scale-95"
                >
                  <Icon name="arrowLeft" size={22} />
                </button>
                <span className="chip bg-mint-100 text-brand-700">{product.category}</span>
              </div>

              <div className="pt-3">
                <ImageGallery
                  images={product.images}
                  alt={product.title}
                  layoutId={`product-image-${product.id}`}
                />
              </div>

              <div className="mt-6">
                {product.tagline && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-400">
                    {product.tagline}
                  </span>
                )}
                <h2 className="mt-1 text-2xl font-extrabold leading-tight text-ink">{product.title}</h2>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-brand-700">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm font-medium text-ink-muted line-through">
                      {formatPrice(product.oldPrice, currency)}
                    </span>
                  )}
                </div>

                {product.specs.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="rounded-3xl bg-mint-50 px-4 py-3 ring-1 ring-mint-100">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                          {spec.label}
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-ink">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Floating add-to-cart button */}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-lg justify-center px-5 pb-6">
              <motion.button
                type="button"
                onClick={() => {
                  onAdd(product);
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1600);
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 26 }}
                className={`pointer-events-auto w-full py-4 text-base shadow-float transition-colors ${
                  added ? 'btn bg-brand-700 text-white' : 'btn-primary'
                }`}
              >
                {added ? (
                  <>
                    <Icon name="check" size={20} /> Додано в кошик
                  </>
                ) : (
                  <>
                    <Icon name="bag" size={20} /> Додати в кошик • {formatPrice(product.price, currency)}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
