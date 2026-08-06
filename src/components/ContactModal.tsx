import { useEffect, useState } from 'react';
import { CONTACTS, PRODUCT } from '../config';
import { contactHref } from '../lib/format';
import { Icon, type IconName } from './icons/Icon';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  heading?: string;
}

const channels: { kind: keyof typeof CONTACTS; icon: IconName; label: string; accent: string }[] = [
  { kind: 'phone', icon: 'phone', label: 'Подзвонити', accent: 'bg-brand text-white' },
  { kind: 'telegram', icon: 'telegram', label: 'Telegram', accent: 'bg-[#2aabee] text-white' },
  { kind: 'viber', icon: 'viber', label: 'Viber', accent: 'bg-[#7360f2] text-white' },
];

export function ContactModal({ open, onClose, heading = 'Замовити помпу' }: ContactModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Reset the confirmation state a moment after the modal is closed.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setSent(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend on a static site — deliver the lead straight to the seller's
    // Viber with the details prefilled.
    const text = `Замовлення: ${PRODUCT.name}\nІм'я: ${name || '—'}\nТелефон: ${phone || '—'}`;
    window.open(contactHref('viber', CONTACTS.viber, text), '_blank', 'noopener');
    setSent(true);
  }

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center sm:items-center ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl transition-all duration-300 ease-out sm:rounded-[2rem] ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-mint-200 sm:hidden" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-ink">{sent ? 'Дякуємо!' : heading}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {sent
                ? 'Ми відкрили чат із замовленням. Якщо ні — оберіть спосіб зв’язку нижче.'
                : 'Залиште контакти — і ми передзвонимо, або напишіть нам напряму.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint-100 text-brand-700 transition active:scale-95"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {!sent && (
          <form onSubmit={handleSubmit} className="mb-5 space-y-3">
            <input
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім'я"
              autoComplete="name"
            />
            <input
              className="field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ваш телефон"
              inputMode="tel"
              autoComplete="tel"
              required
            />
            <button type="submit" className="btn-primary w-full py-3.5 text-base">
              <Icon name="phone" size={18} /> Замовити дзвінок
            </button>
          </form>
        )}

        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">
          або напишіть нам
        </p>
        <div className="grid grid-cols-2 gap-3">
          {channels.map((c) => (
            <a
              key={c.kind}
              href={contactHref(c.kind, CONTACTS[c.kind])}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-mint-50 p-3 ring-1 ring-mint-100 transition hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.98]"
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.accent}`}>
                <Icon name={c.icon} size={18} />
              </span>
              <span className="text-sm font-bold text-ink">{c.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
