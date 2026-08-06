// Lazy Firebase initialiser. Firebase is dynamically imported so it never
// weighs down the landing page — it loads only when checkout or the admin
// panel actually needs it.
import { firebaseConfig, isFirebaseConfigured } from '../firebaseConfig';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

let cached: Promise<{ app: FirebaseApp; db: Firestore; auth: Auth }> | null = null;

export function getFirebase() {
  if (!isFirebaseConfigured) {
    return Promise.reject(new Error('Firebase не налаштовано (див. src/firebaseConfig.ts).'));
  }
  if (!cached) {
    cached = (async () => {
      const [{ initializeApp, getApps, getApp }, { getFirestore }, { getAuth, setPersistence, browserLocalPersistence }] =
        await Promise.all([import('firebase/app'), import('firebase/firestore'), import('firebase/auth')]);
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      // Keep the admin signed in across reloads.
      await setPersistence(auth, browserLocalPersistence).catch(() => {});
      return { app, db: getFirestore(app), auth };
    })();
  }
  return cached;
}

export { isFirebaseConfigured };
