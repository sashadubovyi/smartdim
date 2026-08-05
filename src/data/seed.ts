import type { AppData } from '../types';
import { hashPassword } from '../lib/auth';

const now = Date.now();

// Product photos live in /public/products and are served as static assets.
const PUMP_IMAGES = ['/products/pump-1.png', '/products/pump-2.jpg', '/products/pump-3.jpg'];

// Initial catalogue: a single water-pump product for the rs-water store.
export const SEED_DATA: AppData = {
  version: 3,
  products: [
    {
      id: 'p-pump',
      title: 'Помпа для води Redsack, заряджається від Type-C (Біла)',
      tagline: 'Redsack',
      category: 'Помпи для бутлів',
      description:
        'Помпа для води Redsack — практичний аксесуар для швидкого та комфортного набору питної води з бутлів. Завдяки вбудованому акумулятору із заряджанням через Type-C вона не потребує постійного підключення до мережі, а потужний насос забезпечує швидку подачу води.\n\nКорпус із безпечного харчового ABS-пластику відрізняється міцністю та довговічністю, а безшумна робота робить пристрій зручним для використання вдома, в офісі чи на дачі.',
      price: 1015,
      images: PUMP_IMAGES,
      specs: [
        { label: 'Бренд', value: 'Redsack' },
        { label: 'Тип', value: 'Електрична помпа' },
        { label: 'Заряджання', value: 'USB Type-C' },
        { label: 'Акумулятор', value: '2000 мА·год' },
        { label: 'Матеріал', value: 'Харчовий ABS-пластик' },
        { label: 'Колір', value: 'Білий' },
        { label: 'Подача води', value: 'До 3 сек / склянку' },
        { label: 'Модель', value: '118947' },
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
      subtitle: 'Заряджання від Type-C • Безшумна робота • Швидка доставка по Україні',
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
