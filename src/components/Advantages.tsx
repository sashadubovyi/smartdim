import { motion } from 'framer-motion';
import type { Advantage } from '../types';
import { Icon, type IconName } from './icons/Icon';

interface AdvantagesProps {
  title: string;
  advantages: Advantage[];
}

const validIcons: IconName[] = ['award', 'ship', 'truck', 'shield', 'star', 'box', 'sparkle', 'check'];

function iconFor(key: string): IconName {
  return (validIcons as string[]).includes(key) ? (key as IconName) : 'check';
}

export function Advantages({ title, advantages }: AdvantagesProps) {
  return (
    <section className="mt-10">
      <h2 className="px-1 text-xl font-extrabold text-ink">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {advantages.map((adv, i) => (
          <motion.div
            key={adv.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 rounded-4xl bg-white p-4 shadow-soft ring-1 ring-mint-100"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint-100 text-brand">
              <Icon name={iconFor(adv.icon)} size={24} />
            </span>
            <div>
              <p className="text-[15px] font-bold leading-snug text-ink">{adv.title}</p>
              {adv.text && <p className="mt-0.5 text-sm text-ink-soft">{adv.text}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
