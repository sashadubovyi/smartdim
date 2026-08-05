import { SITE, CONTACTS, PRODUCT } from '../config';
import { contactHref } from '../lib/format';
import { Icon, type IconName } from './icons/Icon';

interface SiteFooterProps {
  onContact: () => void;
}

const channels: { kind: keyof typeof CONTACTS; icon: IconName; label: string }[] = [
  { kind: 'phone', icon: 'phone', label: 'Телефон' },
  { kind: 'telegram', icon: 'telegram', label: 'Telegram' },
  { kind: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' },
  { kind: 'viber', icon: 'viber', label: 'Viber' },
];

export function SiteFooter({ onContact }: SiteFooterProps) {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-extrabold">{SITE.brand}</span>
          <span className="text-xl font-extrabold text-brand-300">.</span>
        </div>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
          {PRODUCT.name}. Прямий імпорт, гарантія та швидка доставка по всій Україні. Понад 10 років на ринку.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-lg sm:grid-cols-4">
          {channels.map((c) => (
            <a
              key={c.kind}
              href={contactHref(c.kind, CONTACTS[c.kind])}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              <Icon name={c.icon} size={18} />
              {c.label}
            </a>
          ))}
        </div>

        <button type="button" onClick={onContact} className="btn mt-6 bg-white text-brand-700 hover:bg-mint-50">
          <Icon name="phone" size={18} /> Замовити консультацію
        </button>

        <p className="mt-8 text-xs text-white/45">© {new Date().getFullYear()} {SITE.brand}. Усі права захищені.</p>
      </div>
    </footer>
  );
}
