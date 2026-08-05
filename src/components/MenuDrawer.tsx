import { useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Icon } from './icons/Icon';

interface MenuDrawerProps {
  open: boolean;
  categories: string[];
  activeCategory: string;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onOpenContacts: () => void;
}

const listItem: Variants = {
  hidden: { opacity: 0, x: 18 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.35 },
  }),
};

export function MenuDrawer({
  open,
  categories,
  activeCategory,
  onClose,
  onSelectCategory,
  onOpenContacts,
}: MenuDrawerProps) {
  const items = ['Усі товари', ...categories];

  // Lock background scroll while the drawer is open (prevents layout shift).
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-hidden rounded-l-5xl bg-white shadow-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 0.8 }}
          >
            <div className="flex items-center justify-between px-7 pt-7">
              <span className="text-lg font-extrabold text-ink">Меню</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити меню"
                className="grid h-10 w-10 place-items-center rounded-full text-brand transition hover:bg-mint-50 active:scale-90"
              >
                <Icon name="close" size={24} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-7 pt-8">
              {items.map((label, i) => {
                const value = i === 0 ? 'all' : label;
                const isActive = activeCategory === value;
                return (
                  <motion.button
                    key={label}
                    type="button"
                    custom={i}
                    variants={listItem}
                    initial="hidden"
                    animate="show"
                    onClick={() => {
                      onSelectCategory(value);
                      onClose();
                    }}
                    className={`relative w-fit select-none rounded-full py-2 text-left text-2xl font-bold transition-colors ${
                      isActive ? 'text-brand' : 'text-ink hover:text-brand-600'
                    }`}
                  >
                    {/* Static highlight — no layout animation, so opening the
                        menu no longer jitters. */}
                    {isActive && (
                      <span className="absolute inset-y-1 -left-4 -right-4 -z-10 rounded-full bg-mint-100" />
                    )}
                    {label}
                  </motion.button>
                );
              })}
            </nav>

            <div className="border-t border-mint-100 px-7 py-7">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenContacts();
                }}
                className="btn-primary w-full"
              >
                <Icon name="phone" size={18} /> Зв’язатися
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
