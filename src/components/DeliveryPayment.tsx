import { motion } from 'framer-motion';
import type { InfoItem } from '../types';
import { Icon, type IconName } from './icons/Icon';

interface DeliveryPaymentProps {
  title: string;
  deliveryTitle: string;
  delivery: InfoItem[];
  paymentTitle: string;
  payment: InfoItem[];
}

const validIcons: IconName[] = [
  'truck',
  'box',
  'ship',
  'card',
  'cash',
  'shield',
  'check',
  'phone',
  'star',
  'sparkle',
];

function iconFor(key: string): IconName {
  return (validIcons as string[]).includes(key) ? (key as IconName) : 'check';
}

function InfoColumn({ heading, items, icon }: { heading: string; items: InfoItem[]; icon: IconName }) {
  if (!items.length) return null;
  return (
    <div className="rounded-4xl bg-white p-5 shadow-soft ring-1 ring-mint-100">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white">
          <Icon name={icon} size={22} />
        </span>
        <h3 className="text-lg font-extrabold text-ink">{heading}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-brand">
              <Icon name={iconFor(item.icon)} size={18} />
            </span>
            <div>
              <p className="text-[15px] font-bold leading-snug text-ink">{item.title}</p>
              {item.text && <p className="mt-0.5 text-sm text-ink-soft">{item.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DeliveryPayment({
  title,
  deliveryTitle,
  delivery,
  paymentTitle,
  payment,
}: DeliveryPaymentProps) {
  if (!delivery?.length && !payment?.length) return null;

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="px-1 text-xl font-extrabold text-ink">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoColumn heading={deliveryTitle} items={delivery ?? []} icon="truck" />
        <InfoColumn heading={paymentTitle} items={payment ?? []} icon="card" />
      </div>
    </motion.section>
  );
}
