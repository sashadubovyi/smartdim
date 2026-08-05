import type { SiteContent } from '../types';
import { contactHref } from '../lib/format';
import { Icon, type IconName } from './icons/Icon';

interface FooterProps {
  content: SiteContent;
  onOpenContacts: () => void;
}

const channels: { kind: 'phone' | 'telegram' | 'whatsapp' | 'viber'; icon: IconName; label: string }[] = [
  { kind: 'phone', icon: 'phone', label: 'Телефон' },
  { kind: 'telegram', icon: 'telegram', label: 'Telegram' },
  { kind: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' },
  { kind: 'viber', icon: 'viber', label: 'Viber' },
];

export function Footer({ content, onOpenContacts }: FooterProps) {
  const { contacts } = content;
  return (
    <footer className="mt-12">
      <div className="relative overflow-hidden rounded-5xl bg-brand px-6 py-8 text-white shadow-card">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-extrabold">{content.siteTitle}</span>
            <span className="text-xl font-extrabold text-mint-200">.</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">{content.footer.about}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {channels.map((c) => (
              <a
                key={c.kind}
                href={contactHref(c.kind, contacts[c.kind])}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-semibold transition hover:bg-white/20"
              >
                <Icon name={c.icon} size={18} />
                {c.label}
              </a>
            ))}
          </div>

          <button type="button" onClick={onOpenContacts} className="btn mt-6 bg-white text-brand-700 hover:bg-mint-50">
            <Icon name="phone" size={18} /> Замовити консультацію
          </button>

          <p className="mt-6 text-xs text-white/50">{content.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
