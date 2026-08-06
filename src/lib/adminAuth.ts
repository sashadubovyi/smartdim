import { getFirebase } from './firebase';
import { ADMIN_EMAIL, DEFAULT_ADMIN_LOGIN, DEFAULT_ADMIN_PASSWORD } from '../firebaseConfig';

// Admin identity model
// ────────────────────
// The password is a real Firebase Auth password on a fixed hidden e-mail
// (ADMIN_EMAIL). The visible *login* is stored in Firestore (settings/admin)
// and only has to match on sign-in. This lets the admin change BOTH the login
// (Firestore write) and the password (Firebase Auth) from inside the panel,
// while Firestore security rules still gate order access behind real auth.

async function readStoredLogin(): Promise<string> {
  try {
    const { db } = await getFirebase();
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'settings', 'admin'));
    const login = snap.exists() ? (snap.data().login as string) : '';
    return login || DEFAULT_ADMIN_LOGIN;
  } catch {
    return DEFAULT_ADMIN_LOGIN;
  }
}

export async function signInAdmin(login: string, password: string): Promise<void> {
  const { auth, db } = await getFirebase();
  const authMod = await import('firebase/auth');
  const { doc, setDoc } = await import('firebase/firestore');

  const storedLogin = await readStoredLogin();
  if (login.trim() !== storedLogin) {
    throw new Error('Невірний логін або пароль.');
  }

  try {
    await authMod.signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
  } catch (err) {
    const code = (err as { code?: string })?.code ?? '';
    const firstRun = code === 'auth/user-not-found' || code === 'auth/invalid-credential';
    // Bootstrap the default admin account on first successful default login.
    if (firstRun && login.trim() === DEFAULT_ADMIN_LOGIN && password === DEFAULT_ADMIN_PASSWORD) {
      await authMod.createUserWithEmailAndPassword(auth, ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
      await setDoc(doc(db, 'settings', 'admin'), { login: DEFAULT_ADMIN_LOGIN }, { merge: true });
      return;
    }
    throw new Error('Невірний логін або пароль.');
  }
}

export async function signOutAdmin(): Promise<void> {
  const { auth } = await getFirebase();
  const { signOut } = await import('firebase/auth');
  await signOut(auth);
}

export async function watchAdmin(cb: (signedIn: boolean) => void): Promise<() => void> {
  const { auth } = await getFirebase();
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, (user) => cb(!!user));
}

export async function getCurrentLogin(): Promise<string> {
  return readStoredLogin();
}

export async function changeCredentials(newLogin: string, newPassword?: string): Promise<void> {
  const { auth, db } = await getFirebase();
  const authMod = await import('firebase/auth');
  const { doc, setDoc } = await import('firebase/firestore');

  const user = auth.currentUser;
  if (!user) throw new Error('Сесія завершилась. Увійдіть ще раз.');

  if (newPassword) {
    try {
      await authMod.updatePassword(user, newPassword);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/requires-recent-login') {
        throw new Error('Для зміни пароля увійдіть заново, потім спробуйте ще раз.');
      }
      throw err;
    }
  }

  if (newLogin.trim()) {
    await setDoc(doc(db, 'settings', 'admin'), { login: newLogin.trim() }, { merge: true });
  }
}
