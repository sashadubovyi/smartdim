import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../store/cart';
import { Icon } from './icons/Icon';

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const { count } = useCart();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Кошик${count ? `, ${count} товарів` : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.35 }}
      whileTap={{ scale: 0.92 }}
      className="pointer-events-auto relative grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-float"
    >
      <Icon name="bag" size={26} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-xs font-extrabold text-brand ring-2 ring-brand"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
