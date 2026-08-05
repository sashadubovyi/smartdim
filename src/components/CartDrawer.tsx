import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/store';
import { useCart } from '../store/cart';
import { formatPrice } from '../lib/format';
import { Icon } from './icons/Icon';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: (orderText: string, total: number) => void;
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { products, content } = useStore();
  const { items, setQty, remove, clear } = useCart();
  const currency = content.currency;

  // Join cart entries with live product data (skip products that were deleted).
  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product ? { product, qty: item.qty } : null;
        })
        .filter((l): l is { product: (typeof products)[number]; qty: number } => l !== null),
    [items, products],
  );

  const total = useMemo(() => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0), [lines]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  function buildOrderText(): string {
    const rows = lines.map(
      (l) => `• ${l.product.title} — ${l.qty} × ${formatPrice(l.product.price, currency)}`,
    );
    return `Нове замовлення:\n${rows.join('\n')}\n\nРазом: ${formatPrice(total, currency)}`;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[55]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

          <motion.aside
            className="absolute inset-y-0 right-0 flex w-[92%] max-w-md flex-col overflow-hidden rounded-l-5xl bg-white shadow-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 0.8 }}
          >
            <div className="flex items-center justify-between border-b border-mint-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <Icon name="bag" size={22} className="text-brand" />
                <h3 className="text-xl font-extrabold text-ink">Кошик</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити кошик"
                className="grid h-10 w-10 place-items-center rounded-full text-brand transition hover:bg-mint-50 active:scale-90"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-mint-50 text-brand">
                  <Icon name="bag" size={34} />
                </span>
                <p className="text-lg font-bold text-ink">Кошик порожній</p>
                <p className="text-sm text-ink-soft">Додайте товари, щоб оформити замовлення.</p>
                <button type="button" onClick={onClose} className="btn-soft mt-2">
                  Перейти до покупок
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  <AnimatePresence initial={false}>
                    {lines.map(({ product, qty }) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-mint-100"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="line-clamp-2 text-sm font-bold text-ink">{product.title}</p>
                          <p className="mt-0.5 text-sm font-extrabold text-brand-700">
                            {formatPrice(product.price, currency)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setQty(product.id, qty - 1)}
                                aria-label="Зменшити"
                                className="grid h-8 w-8 place-items-center rounded-full bg-mint-100 text-brand-700 active:scale-90"
                              >
                                <Icon name="minus" size={16} />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-ink">{qty}</span>
                              <button
                                type="button"
                                onClick={() => setQty(product.id, qty + 1)}
                                aria-label="Збільшити"
                                className="grid h-8 w-8 place-items-center rounded-full bg-mint-100 text-brand-700 active:scale-90"
                              >
                                <Icon name="plus" size={16} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(product.id)}
                              aria-label="Видалити з кошика"
                              className="grid h-8 w-8 place-items-center rounded-full text-red-400 transition hover:bg-red-50"
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={clear}
                    className="mx-auto flex items-center gap-1.5 pt-1 text-xs font-semibold text-ink-muted hover:text-red-400"
                  >
                    <Icon name="trash" size={14} /> Очистити кошик
                  </button>
                </div>

                <div className="border-t border-mint-100 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-soft">Разом</span>
                    <span className="text-2xl font-extrabold text-ink">{formatPrice(total, currency)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCheckout(buildOrderText(), total)}
                    className="btn-primary w-full py-4 text-base"
                  >
                    <Icon name="check" size={20} /> Оформити замовлення
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
