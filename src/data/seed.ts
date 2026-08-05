import type { AppData } from '../types';
import { hashPassword } from '../lib/auth';
import { PLACEHOLDERS } from '../lib/placeholders';

const now = Date.now();

// Initial mock catalogue with placeholder imagery so the storefront and the
// admin panel look complete the moment the app is opened.
export const SEED_DATA: AppData = {
  version: 1,
  products: [
    {
      id: 'p-bulb',
      title: 'Розумна лампа smartdim Aura',
      tagline: 'Освітлення',
      category: 'Освітлення',
      description:
        'RGBW лампа з керуванням через застосунок та голосом. 16 млн кольорів, сценарії, розклад та плавне пробудження. Працює з Wi-Fi без хабів.',
      price: 549,
      oldPrice: 690,
      images: [PLACEHOLDERS.bulb, PLACEHOLDERS.bulb2],
      specs: [
        { label: 'Тип', value: 'RGBW E27' },
        { label: 'Яскравість', value: '900 лм' },
        { label: "З'єднання", value: 'Wi-Fi 2.4 ГГц' },
      ],
      featured: true,
      createdAt: now - 6000,
    },
    {
      id: 'p-plug',
      title: 'Розумна розетка smartdim Plug',
      tagline: 'Енергія',
      category: 'Розетки',
      description:
        'Керуйте будь-яким приладом дистанційно, стежте за споживанням електроенергії та вмикайте техніку за розкладом. Захист від перевантаження.',
      price: 389,
      images: [PLACEHOLDERS.plug],
      specs: [
        { label: 'Навантаження', value: '16 А / 3680 Вт' },
        { label: 'Облік', value: 'кВт·год' },
        { label: "З'єднання", value: 'Wi-Fi' },
      ],
      featured: true,
      createdAt: now - 5000,
    },
    {
      id: 'p-camera',
      title: 'Wi-Fi камера smartdim View 2K',
      tagline: 'Безпека',
      category: 'Безпека',
      description:
        'Домашня камера 2K з нічним баченням, детекцією руху та двостороннім аудіо. Сповіщення на телефон і запис на карту пам’яті до 256 ГБ.',
      price: 1290,
      oldPrice: 1490,
      images: [PLACEHOLDERS.camera],
      specs: [
        { label: 'Роздільна здатність', value: '2K (2304×1296)' },
        { label: 'Нічний режим', value: 'ІЧ до 10 м' },
        { label: 'Кут огляду', value: '110°' },
      ],
      featured: true,
      createdAt: now - 4000,
    },
    {
      id: 'p-speaker',
      title: 'Розумна колонка smartdim Voice',
      tagline: 'Аудіо',
      category: 'Аудіо',
      description:
        'Голосовий асистент та кімнатний звук 360°. Керуйте сценаріями розумного дому голосом, слухайте музику та ставте нагадування.',
      price: 1590,
      images: [PLACEHOLDERS.speaker],
      specs: [
        { label: 'Потужність', value: '20 Вт' },
        { label: 'Мікрофони', value: '4 далекого поля' },
        { label: "З'єднання", value: 'Wi-Fi + BT 5.0' },
      ],
      createdAt: now - 3000,
    },
    {
      id: 'p-thermostat',
      title: 'Термостат smartdim Climate',
      tagline: 'Клімат',
      category: 'Клімат',
      description:
        'Керуйте опаленням зі смартфона, економте до 30% на рахунках. Тижневий розклад, геолокація та звіти про споживання.',
      price: 2190,
      images: [PLACEHOLDERS.thermostat],
      specs: [
        { label: 'Сумісність', value: 'Котли/тепла підлога' },
        { label: 'Датчик', value: 'Температура + вологість' },
        { label: "З'єднання", value: 'Wi-Fi' },
      ],
      createdAt: now - 2000,
    },
    {
      id: 'p-lock',
      title: 'Розумний замок smartdim Lock',
      tagline: 'Доступ',
      category: 'Безпека',
      description:
        'Відкривайте двері відбитком пальця, кодом, карткою або зі смартфона. Журнал доступу та тимчасові ключі для гостей.',
      price: 3490,
      oldPrice: 3990,
      images: [PLACEHOLDERS.lock],
      specs: [
        { label: 'Розблокування', value: '5 способів' },
        { label: 'Акумулятор', value: 'до 8 місяців' },
        { label: 'Захист', value: 'IP54' },
      ],
      createdAt: now - 1000,
    },
  ],
  content: {
    siteTitle: 'smartdim',
    currency: '₴',
    hero: {
      eyebrow: 'Розумний дім',
      title: 'Розумні пристрої для вашого дому',
      subtitle: 'Прямий імпорт • Гарантія • Швидка доставка по Україні',
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
      telegram: 'smartdim',
      whatsapp: '+380000000000',
      viber: '+380000000000',
    },
    footer: {
      about:
        'smartdim — це прямий імпортер розумних пристроїв для дому. Понад 10 років ми робимо технології доступними: власний склад, гарантія на кожен товар та швидка доставка по всій Україні.',
      rights: '© smartdim. Усі права захищені.',
    },
  },
  credentials: {
    login: 'admin',
    passwordHash: hashPassword('admin'),
  },
};
