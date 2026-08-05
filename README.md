# water-rs — помпа для води 💧

Легкий, швидкий, **односторінковий лендинг** для помпи для води Redsack. Побудований так, щоб миттєво деплоїтись на **Firebase Hosting** і легко передаватись клієнту під ребрендинг/перепродаж.

> Один товар, без бекенду й адмін-панелі. Увесь контент редагується в одному файлі — [`src/config.ts`](./src/config.ts).
>
> ℹ️ Задеплоєно у Firebase-проєкт `water-rs` → **https://water-rs.web.app**

---

## ✨ Що всередині

- **Односторінковий сайт** (лендинг) лише для одного товару — помпи для води.
- Світла **синьо-блакитна** тема, mobile-first, високий контраст.
- **GSAP + ScrollTrigger** анімації: плавні появи по скролу, паралакс на фото, лічильники цифр. Поважає `prefers-reduced-motion`.
- Фотографії розміщені **по ходу скролу** (без слайдера).
- Контакти **зверху й знизу** (Телефон, Telegram, WhatsApp, Viber).
- Кнопки **«Купити»** повторюються по сайту + фіксована плаваюча кнопка.
- Центральна кнопка **«Зв’язатися»** відкриває модалку зі **зворотною формою** (ім’я + телефон) та контактами. Форма надсилає замовлення у WhatsApp продавця.
- Максимум інформації: переваги, характеристики, комплектація, сценарії використання, доставка й оплата, FAQ.

---

## 🧱 Стек

| Шар | Технологія |
| --- | --- |
| Збірка | **Vite 5** |
| UI | **React 18 + TypeScript** |
| Стилі | **Tailwind CSS 3** |
| Анімації | **GSAP 3 + ScrollTrigger** |
| Хостинг | **Firebase Hosting** |

Продакшн-бандл: **~107 КБ gzip** сумарно.

---

## ✏️ Як редагувати контент (без коду)

Майже все — в одному файлі [`src/config.ts`](./src/config.ts):

- **`CONTACTS`** — телефон, Telegram, WhatsApp, Viber. ⚠️ Замініть плейсхолдери `+380000000000` на реальні.
- **`PRODUCT`** — назва, ціна, стара ціна, опис, характеристики, шляхи до фото.
- **`FEATURES`, `STATS`, `USE_CASES`, `SPECS`, `IN_BOX`, `FAQ`, `ADVANTAGES`, `DELIVERY`, `PAYMENT`** — блоки сайту.

**Фотографії товару** лежать у [`public/products/`](./public/products/) (`pump-1.png`, `pump-2.jpg`, `pump-3.jpg`). Замініть файли (лишивши ті самі імена) або додайте нові й пропишіть шлях у `PRODUCT.images`.

**Колір бренду** — палітра `brand` у [`tailwind.config.js`](./tailwind.config.js); **фавікон** — [`public/favicon.svg`](./public/favicon.svg).

---

## 🚀 Локальний запуск

Потрібен **Node.js 18+**.

```bash
npm install       # встановити залежності
npm run dev       # дев-сервер http://localhost:5173
npm run build     # прод-збірка у dist/
npm run preview   # перегляд зібраної версії
```

---

## 🔥 Деплой на Firebase Hosting

### Автоматично (рекомендовано)
У репозиторії налаштований GitHub Actions workflow [`.github/workflows/firebase-deploy.yml`](./.github/workflows/firebase-deploy.yml): **кожен пуш у `main`** автоматично збирає та публікує сайт на `water-rs.web.app`.

Одноразове налаштування (кліки у браузері):
1. Firebase Console → ⚙️ **Project settings → Service accounts → Generate new private key** (завантажиться `.json`).
2. GitHub → репозиторій → **Settings → Secrets and variables → Actions → New repository secret**: ім’я `FIREBASE_SERVICE_ACCOUNT`, значення — весь вміст `.json`.

### Вручну
```bash
npm install -g firebase-tools
firebase login
npm run deploy    # build + firebase deploy --only hosting
```
Проєкт заданий у [`.firebaserc`](./.firebaserc) (`water-rs`), конфіг хостингу — у [`firebase.json`](./firebase.json).

---

## 🔁 Передача клієнту / перепродаж

1. **Контент** — відредагуйте [`src/config.ts`](./src/config.ts) (назва, ціна, контакти, тексти) і фото в `public/products/`.
2. **Колір/бренд** — `tailwind.config.js` (палітра `brand`) та `public/favicon.svg`.
3. **Свій Firebase-проєкт клієнта:**
   ```bash
   firebase login
   firebase use --add          # оберіть проєкт клієнта, alias "default"
   npm run deploy
   ```
   Також оновіть `projectId` у workflow, якщо користуєтесь автодеплоєм.
4. **Власний домен:** Firebase Console → **Hosting → Add custom domain** → додайте DNS-записи у реєстратора → Firebase автоматично випустить безкоштовний SSL.

---

## 📁 Структура

```
water-rs/
├── firebase.json            # Firebase Hosting (public: dist, SPA-rewrites, кеш)
├── .firebaserc              # проєкт water-rs
├── .github/workflows/       # автодеплой
├── public/
│   ├── favicon.svg
│   └── products/            # фото товару (pump-1..3)
└── src/
    ├── config.ts            # ⭐ увесь контент сайту
    ├── App.tsx              # односторінковий лендинг + GSAP
    ├── main.tsx
    ├── index.css            # тема, кнопки, стани анімацій
    ├── lib/format.ts        # ціна та посилання на контакти
    └── components/          # TopBar, SiteFooter, ContactModal, іконки
```
