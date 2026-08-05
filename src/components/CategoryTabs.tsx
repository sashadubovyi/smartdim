import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  const tabs = [{ label: 'Усі', value: 'all' }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive ? 'text-white' : 'text-ink-soft hover:text-brand-700'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 -z-10 rounded-full bg-brand shadow-float"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
