import { SITE, CONTACTS } from '../config';
import { contactHref } from '../lib/format';
import { Icon, type IconName } from './icons/Icon';

interface TopBarProps {
  onContact: () => void;
}

const links: { kind: keyof typeof CONTACTS; icon: IconName; label: string }[] = [
  { kind: 'phone', icon: 'phone', label: 'Телефон' },
  { kind: 'telegram', icon: 'telegram', label: 'Telegram' },
  { kind: 'viber', icon: 'viber', label: 'Viber' },
];

export function TopBar({ onContact }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-mint-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-baseline gap-0.5">
          <span className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{SITE.brand}</span>
          <span className="text-lg font-extrabold text-brand sm:text-xl">.</span>
        </a>

        <div className="flex items-center gap-1.5">
          {links.map((l) => (
            <a
              key={l.kind}
              href={contactHref(l.kind, CONTACTS[l.kind])}
              target="_blank"
              rel="noreferrer"
              aria-label={l.label}
              className="grid h-9 w-9 place-items-center rounded-full text-brand-700 transition hover:bg-mint-100 active:scale-90"
            >
              <Icon name={l.icon} size={19} />
            </a>
          ))}
          <button type="button" onClick={onContact} className="btn-primary ml-1 hidden !py-2 !px-4 text-sm sm:inline-flex">
            <Icon name="phone" size={16} /> Зв’язатися
          </button>
        </div>
      </div>
    </header>
  );
}
