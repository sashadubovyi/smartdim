import { motion } from 'framer-motion';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { Icon } from './icons/Icon';

interface FeaturedSliderProps {
  products: Product[];
  currency: string;
  onOpen: (product: Product) => void;
}

export function FeaturedSlider({ products, currency, onOpen }: FeaturedSliderProps) {
  if (!products.length) return null;

  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
      {products.map((product, i) => (
        <motion.button
          key={product.id}
          type="button"
          onClick={() => onOpen(product)}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.98 }}
          className="relative flex h-72 w-[78%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[2.5rem] bg-brand p-6 text-left text-white shadow-card sm:w-[60%]"
        >
          {/* Product image floating in a soft capsule, echoing the reference. */}
          <div className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 overflow-hidden rounded-full bg-white/10">
            <img src={product.images[0]} alt="" className="h-full w-full object-cover opacity-95" />
          </div>
          <div className="pointer-events-none absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/20 backdrop-blur">
            <Icon name="plus" size={20} />
          </div>

          <div className="relative z-10">
            {product.tagline && (
              <span className="text-xs font-semibold uppercase tracking-wide text-mint-200">
                {product.tagline}
              </span>
            )}
            <h3 className="mt-1 max-w-[70%] text-xl font-extrabold leading-tight">{product.title}</h3>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold backdrop-blur">
              {formatPrice(product.price, currency)}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
