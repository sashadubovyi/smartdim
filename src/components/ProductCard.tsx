import { motion } from 'framer-motion';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { Icon } from './icons/Icon';

interface ProductCardProps {
  product: Product;
  currency: string;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, currency, onOpen, onAdd, index = 0 }: ProductCardProps) {
  const image = product.images[0];

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(product);
        }
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex cursor-pointer select-none flex-col overflow-hidden rounded-4xl bg-white p-3 text-left shadow-soft ring-1 ring-mint-100 transition-shadow hover:shadow-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-mint-50">
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="chip absolute left-3 top-3 bg-brand text-white shadow-float">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        <button
          type="button"
          aria-label="Додати в кошик"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-700 shadow-soft ring-1 ring-mint-100 backdrop-blur transition hover:bg-brand hover:text-white active:scale-90"
        >
          <Icon name="plus" size={20} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        {product.tagline && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-400">
            {product.tagline}
          </span>
        )}
        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug text-ink">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-extrabold text-brand-700">
            {formatPrice(product.price, currency)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs font-medium text-ink-muted line-through">
              {formatPrice(product.oldPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
