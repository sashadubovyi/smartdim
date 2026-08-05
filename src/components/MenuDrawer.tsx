import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from './icons/Icon';

interface MenuDrawerProps {
  open: boolean;
  categories: string[];
  activeCategory: string;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onOpenContacts: () => void;
}

const listItem = {
  hidden: { opacity: 0, x: 18 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.4 },
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
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            {/* Decorative curved shapes echoing the reference menu screen. */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand" />
            <div className="pointer-events-none absolute -bottom-10 right-6 h-28 w-28 rounded-full bg-mint-200" />

            <div className="relative flex items-center justify-end px-6 pt-6">
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити меню"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-white ring-1 ring-white/40 backdrop-blur transition active:scale-95"
              >
                <Icon name="close" size={22} className="text-white" />
              </button>
            </div>

            <nav className="relative flex flex-1 flex-col gap-1 px-8 pt-10">
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
                    className={`relative w-fit rounded-full py-2 text-left text-2xl font-bold transition ${
                      isActive ? 'text-brand' : 'text-ink hover:text-brand-600'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="menu-active"
                        className="absolute inset-y-1 -left-4 -right-4 -z-10 bg-mint-100"
                        style={{ borderRadius: 999 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    {label}
                  </motion.button>
                );
              })}
            </nav>

            <div className="relative space-y-3 px-8 pb-10">
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
              <Link to="/admin" onClick={onClose} className="btn-ghost w-full">
                <Icon name="settings" size={18} /> Адмін-панель
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
