import type { SVGProps } from 'react';

export type IconName =
  | 'menu'
  | 'close'
  | 'arrowLeft'
  | 'arrowRight'
  | 'phone'
  | 'telegram'
  | 'whatsapp'
  | 'viber'
  | 'bag'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'edit'
  | 'star'
  | 'check'
  | 'award'
  | 'ship'
  | 'truck'
  | 'shield'
  | 'settings'
  | 'box'
  | 'text'
  | 'logout'
  | 'image'
  | 'chevronDown'
  | 'sparkle';

const paths: Record<IconName, JSX.Element> = {
  menu: (
    <>
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="14" y2="16" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  arrowLeft: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
  arrowRight: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  telegram: <path d="M21.5 4.5 2.5 11.8c-.9.35-.88 1.63.03 1.95l4.7 1.64 1.8 5.4c.26.78 1.28.94 1.77.28l2.6-3.5 4.9 3.6c.6.44 1.46.12 1.62-.6l3.3-14.9c.2-.9-.68-1.66-1.52-1.17Z" />,
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm-2.5 5.3c.18 0 .37 0 .53.01.18.01.42-.07.66.5.24.58.82 2 .9 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.16-.31.37-.44.5-.15.14-.3.3-.13.58.18.29.8 1.3 1.7 2.11 1.18 1.05 2.17 1.37 2.46 1.52.29.15.46.13.63-.08.18-.2.73-.85.93-1.14.19-.29.38-.24.64-.14.26.1 1.66.78 1.95.92.29.15.48.22.55.34.07.13.07.72-.17 1.4-.24.68-1.4 1.32-1.96 1.36-.56.05-1.06.24-3.57-.77-3.02-1.19-4.9-4.32-5.05-4.52-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.29.58-.36.78-.36Z" />
  ),
  viber: (
    <path d="M12 2C6.9 2 3 5.4 3 10.2c0 2.5 1.1 4.7 3 6.2v3.9l3.3-1.8c.9.2 1.8.3 2.7.3 5.1 0 9-3.4 9-8.2S17.1 2 12 2Zm4.9 11.4c-.2.5-1 1-1.5 1.1-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.4-.5-2.4-1-4-3.4-4.1-3.6-.1-.2-1-1.3-1-2.4 0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.6c.1.1 0 .3-.1.4l-.3.4c-.1.1-.2.3-.1.5.1.2.6.9 1.2 1.5.8.7 1.4.9 1.6 1 .2.1.3.1.4-.1l.6-.7c.1-.2.3-.1.5-.1l1.5.7c.2.1.3.2.4.3 0 .1 0 .7-.3 1.3Z" />
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
    </>
  ),
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  check: <polyline points="20 6 9 17 4 12" />,
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" />
    </>
  ),
  ship: (
    <>
      <path d="M3 15h18l-2 5H5l-2-5Z" />
      <path d="M12 3v9" />
      <path d="M8 8l4-2 4 2" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="6" width="13" height="10" rx="1" />
      <path d="M14 9h4l3 3v4h-7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  shield: <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
  box: (
    <>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  text: (
    <>
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  sparkle: <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  filled?: boolean;
}

export function Icon({ name, size = 22, filled = false, ...props }: IconProps) {
  const solid = filled || ['telegram', 'whatsapp', 'viber', 'shield', 'star', 'phone', 'sparkle'].includes(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke={solid ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
