import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { AdminLogin } from '../admin/AdminLogin';
import { ProductsManager } from '../admin/ProductsManager';
import { ContentManager } from '../admin/ContentManager';
import { ContactsManager } from '../admin/ContactsManager';
import { SettingsManager } from '../admin/SettingsManager';
import { Icon, type IconName } from '../components/icons/Icon';

type Tab = 'products' | 'content' | 'contacts' | 'settings';

const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'products', label: 'Товари', icon: 'box' },
  { id: 'content', label: 'Тексти', icon: 'text' },
  { id: 'contacts', label: 'Контакти', icon: 'phone' },
  { id: 'settings', label: 'Налаштування', icon: 'settings' },
];

export function Admin() {
  const { isAuthed, content } = useStore();
  const [tab, setTab] = useState<Tab>('products');

  if (!isAuthed) return <AdminLogin />;

  return (
    <div className="min-h-[100dvh] pb-28">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-mint-200/60 bg-mint-100/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-extrabold text-ink">{content.siteTitle}</span>
            <span className="text-lg font-extrabold text-brand">.</span>
            <span className="ml-2 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              admin
            </span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            <Icon name="arrowLeft" size={16} /> На сайт
          </Link>
        </div>

        {/* Tabs — desktop / tablet */}
        <div className="no-scrollbar mx-auto hidden max-w-3xl gap-1 overflow-x-auto px-5 pb-2 sm:flex">
          {tabs.map((t) => (
            <TabButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'products' && <ProductsManager />}
            {tab === 'content' && <ContentManager />}
            {tab === 'contacts' && <ContactsManager />}
            {tab === 'settings' && <SettingsManager />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom tab bar — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-mint-200/60 bg-white/95 backdrop-blur sm:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-4">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition ${
                  active ? 'text-brand' : 'text-ink-muted'
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-2xl transition ${
                    active ? 'bg-mint-100 text-brand' : 'text-ink-muted'
                  }`}
                >
                  <Icon name={t.icon} size={20} />
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: { id: Tab; label: string; icon: IconName };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? 'text-white' : 'text-ink-soft hover:text-brand-700'
      }`}
    >
      {active && (
        <motion.span layoutId="admin-tab" className="absolute inset-0 -z-10 rounded-full bg-brand" />
      )}
      <Icon name={tab.icon} size={16} /> {tab.label}
    </button>
  );
}
