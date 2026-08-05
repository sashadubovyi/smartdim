export function formatPrice(value: number, currency = '₴'): string {
  const formatted = new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} ${currency}`;
}

/**
 * Build a tel:/https: link from a raw phone or handle for each channel.
 * An optional `message` prefills the text where the channel supports it
 * (WhatsApp and Viber); Telegram/phone open the chat/dialer directly.
 */
export function contactHref(
  kind: 'phone' | 'telegram' | 'whatsapp' | 'viber',
  value: string,
  message?: string,
): string {
  const digits = value.replace(/[^\d+]/g, '');
  const text = message ? encodeURIComponent(message) : '';
  switch (kind) {
    case 'phone':
      return `tel:${digits}`;
    case 'telegram': {
      const handle = value.replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
      return `https://t.me/${handle}`;
    }
    case 'whatsapp':
      return `https://wa.me/${digits.replace(/^\+/, '')}${text ? `?text=${text}` : ''}`;
    case 'viber':
      return `viber://chat?number=${encodeURIComponent(digits)}${text ? `&text=${text}` : ''}`;
  }
}
