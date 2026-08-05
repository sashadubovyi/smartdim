import type { AppData } from '../types';
import { hashPassword } from '../lib/auth';

const now = Date.now();

// Product photos live in /public/products and are served as static assets.
const PUMP_IMAGES = ['/products/pump-1.png', '/products/pump-2.jpg', '/products/pump-3.jpg'];

// Initial catalogue: a single water-pump product for the rs-water store.
export const SEED_DATA: AppData = {
  version: 2,
  products: [
    {
      id: 'p-pump',
      title: 'Помпа для води Redsack (Type-C)',
      tagline: 'Помпа для води',
      category: 'Помпи для води',
      description:
        'Автоматична електрична помпа для бутильованої води із заряджанням від USB Type-C. Потужний потік наповнює склянку 300 мл лише за 5 секунд — одне натискання, і чиста вода вже у склянці.\n\nОдного повного заряду вистачає приблизно на 15 бутлів (19 л / 5 галонів). Компактний білий корпус із нержавіючим носиком підходить для стандартних бутлів 11–19 л. Ідеальне рішення для дому та офісу.',
      price: 399,
      oldPrice: 549,
      images: PUMP_IMAGES,
      specs: [
        { label: 'Заряджання', value: 'USB Type-C' },
        { label: 'Один заряд', value: '≈15 бутлів (19 л)' },
        { label: 'Швидкість', value: '300 мл за 5 сек' },
        { label: 'Сумісність', value: 'Бутлі 11–19 л' },
        { label: 'Матеріал', value: 'Пластик + нерж. сталь' },
        { label: 'Колір', value: 'Білий' },
      ],
      featured: false,
      createdAt: now,
    },
  ],
  content: {
    siteTitle: 'rs-water',
    currency: '₴',
    hero: {
      eyebrow: 'Чиста вода',
      title: 'Помпа для води Redsack',
      subtitle: 'Заряджання від Type-C • Потужний потік • Швидка доставка по Україні',
    },
    advantagesTitle: 'Наші переваги',
    advantages: [
      { id: 'a1', icon: 'award', title: 'Більше 10 років на ринку України' },
      { id: 'a2', icon: 'ship', title: 'Прямий власний імпорт' },
      { id: 'a3', icon: 'truck', title: 'Швидка доставка' },
      { id: 'a4', icon: 'shield', title: 'Гарантія, обмін та повернення' },
    ],
    contacts: {
      phone: '+380000000000',
      telegram: 'rswater',
      whatsapp: '+380000000000',
      viber: '+380000000000',
    },
    footer: {
      about:
        'rs-water — надійні помпи для бутильованої води з прямим імпортом. Понад 10 років ми робимо чисту воду доступною: власний склад, гарантія на кожен товар та швидка доставка по всій Україні.',
      rights: '© rs-water. Усі права захищені.',
    },
  },
  credentials: {
    login: 'admin',
    passwordHash: hashPassword('admin'),
  },
};
