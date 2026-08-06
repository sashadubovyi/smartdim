// ─────────────────────────────────────────────────────────────────────────
//  Firebase web-конфіг для замовлень (Firestore) та захисту адмінки (Auth).
//
//  ЯК ЗАПОВНИТИ (одноразово):
//  1. Firebase Console → ваш проєкт water-rs → ⚙️ Project settings → вкладка
//     "General" → блок "Your apps" → Web app (</>) → SDK setup and config →
//     оберіть "Config". Скопіюйте значення й вставте нижче.
//  2. Увімкніть базу: Console → Build → Firestore Database → Create database
//     (production mode). Потім вкладка "Rules" → вставте правила з README
//     (файл firestore.rules) → Publish.
//  3. Увімкніть вхід: Console → Build → Authentication → Get started →
//     Sign-in method → Email/Password → Enable.
//
//  Значення apiKey/appId НЕ є секретними — вони призначені для клієнта.
// ─────────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'water-rs.firebaseapp.com',
  projectId: 'water-rs',
  storageBucket: 'water-rs.appspot.com',
  messagingSenderId: 'PASTE_SENDER_ID',
  appId: 'PASTE_APP_ID',
};

/** true, коли конфіг заповнено (не плейсхолдери). */
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE');

// Прихована службова адреса для входу адміністратора (Firebase Auth працює з
// e-mail). Логін, який вводить адмін, звіряється окремо (див. lib/adminAuth).
export const ADMIN_EMAIL = 'admin@water-rs.app';
export const DEFAULT_ADMIN_LOGIN = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'admin123';
