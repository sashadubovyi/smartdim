import { AnimatePresence, motion } from 'framer-motion';
import type { Contacts } from '../types';
import { contactHref } from '../lib/format';
import { Icon, type IconName } from './icons/Icon';

interface ContactsModalProps {
  open: boolean;
  contacts: Contacts;
  onClose: () => void;
  productTitle?: string;
}

const channels: { kind: keyof Contacts; icon: IconName; label: string; accent: string }[] = [
  { kind: 'phone', icon: 'phone', label: 'Подзвонити', accent: 'bg-brand text-white' },
  { kind: 'telegram', icon: 'telegram', label: 'Telegram', accent: 'bg-[#2aabee] text-white' },
  { kind: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', accent: 'bg-[#25d366] text-white' },
  { kind: 'viber', icon: 'viber', label: 'Viber', accent: 'bg-[#7360f2] text-white' },
];

export function ContactsModal({ open, contacts, onClose, productTitle }: ContactsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-t-5xl bg-white p-6 pb-8 shadow-card sm:rounded-5xl"
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-mint-200 sm:hidden" />
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-ink">Зв’язатися з нами</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {productTitle ? `Замовлення: ${productTitle}` : 'Оберіть зручний спосіб зв’язку'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити"
                className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-brand-700 transition active:scale-95"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {channels.map((c, i) => {
                const value = contacts[c.kind];
                return (
                  <motion.a
                    key={c.kind}
                    href={contactHref(c.kind, value)}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i }}
                    className="flex flex-col items-start gap-3 rounded-3xl bg-mint-50 p-4 ring-1 ring-mint-100 transition hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.98]"
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-2xl ${c.accent}`}>
                      <Icon name={c.icon} size={22} />
                    </span>
                    <span className="text-sm font-bold text-ink">{c.label}</span>
                    <span className="-mt-2 truncate text-xs text-ink-muted">{value}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
