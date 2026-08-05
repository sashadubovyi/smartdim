import { motion } from 'framer-motion';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { Icon } from './icons/Icon';

interface ProductCardProps {
  product: Product;
  currency: string;
  onOpen: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, currency, onOpen, index = 0 }: ProductCardProps) {
  const image = product.images[0];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(product)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex select-none flex-col overflow-hidden rounded-4xl bg-white p-3 text-left shadow-soft transition-shadow hover:shadow-card"
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
        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-brand-700 shadow-soft backdrop-blur transition group-hover:bg-brand group-hover:text-white">
          <Icon name="plus" size={18} />
        </span>
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
    </motion.button>
  );
}
