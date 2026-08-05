import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  const tabs = [{ label: 'Усі', value: 'all' }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <motion.div layoutScroll className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`relative select-none whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? 'text-white' : 'text-ink-soft hover:text-brand-700'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 -z-10 bg-brand shadow-float"
                style={{ borderRadius: 999 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </motion.div>
  );
}
