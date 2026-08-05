import { Icon } from './icons/Icon';

interface HeaderProps {
  title: string;
  onOpenMenu: () => void;
}

export function Header({ title, onOpenMenu }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-2">
      <a href="/" className="flex items-baseline gap-0.5">
        <span className="text-3xl font-extrabold tracking-tight text-ink">{title}</span>
        <span className="text-2xl font-extrabold text-brand">.</span>
      </a>
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Відкрити меню"
        className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-700 shadow-soft transition active:scale-95"
      >
        <Icon name="menu" size={22} />
      </button>
    </header>
  );
}
