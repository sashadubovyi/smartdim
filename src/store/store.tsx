import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppData, Product, SiteContent, Contacts } from '../types';
import { SEED_DATA } from '../data/seed';
import { hashPassword, verifyPassword } from '../lib/auth';

const STORAGE_KEY = 'rswater.data.v2';
const SESSION_KEY = 'rswater.admin.session';

function loadData(): AppData {
  if (typeof localStorage === 'undefined') return structuredClone(SEED_DATA);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(SEED_DATA);
    const parsed = JSON.parse(raw) as AppData;
    // Basic shape guard — fall back to seed if the payload looks corrupt.
    if (!parsed?.products || !parsed?.content || !parsed?.credentials) {
      return structuredClone(SEED_DATA);
    }
    // Additive migration: backfill any content fields introduced in newer
    // versions (e.g. delivery/payment) while keeping the user's own edits.
    parsed.content = { ...structuredClone(SEED_DATA.content), ...parsed.content };
    return parsed;
  } catch {
    return structuredClone(SEED_DATA);
  }
}

function persist(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // Most likely the ~5MB quota was hit by large base64 images.
    console.error('smartdim: не вдалося зберегти дані (можливо, перевищено ліміт сховища).', err);
    throw new Error(
      'Сховище переповнене. Спробуйте завантажувати менші зображення — вони автоматично стискаються, але дуже великі файли все одно можуть перевищити ліміт браузера.',
    );
  }
}

interface StoreValue {
  data: AppData;
  products: Product[];
  content: SiteContent;
  isAuthed: boolean;
  // storefront + admin shared
  categories: string[];
  // product CRUD
  createProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  // content
  updateContent: (patch: Partial<SiteContent>) => void;
  updateContacts: (patch: Partial<Contacts>) => void;
  // auth
  login: (login: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (nextLogin: string, nextPassword?: string) => void;
  // maintenance
  resetToSeed: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) === '1';
  });

  // Persist on every change.
  useEffect(() => {
    persist(data);
  }, [data]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const createProduct = useCallback((product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
    };
    setData((prev) => ({ ...prev, products: [newProduct, ...prev.products] }));
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setData((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  }, []);

  const getProduct = useCallback((id: string) => data.products.find((p) => p.id === id), [data.products]);

  const updateContent = useCallback((patch: Partial<SiteContent>) => {
    setData((prev) => ({ ...prev, content: { ...prev.content, ...patch } }));
  }, []);

  const updateContacts = useCallback((patch: Partial<Contacts>) => {
    setData((prev) => ({
      ...prev,
      content: { ...prev.content, contacts: { ...prev.content.contacts, ...patch } },
    }));
  }, []);

  const login = useCallback(
    (loginValue: string, password: string) => {
      const { credentials } = data;
      const ok =
        loginValue.trim() === credentials.login && verifyPassword(password, credentials.passwordHash);
      if (ok) {
        setIsAuthed(true);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* ignore */
        }
      }
      return ok;
    },
    [data],
  );

  const logout = useCallback(() => {
    setIsAuthed(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const updateCredentials = useCallback((nextLogin: string, nextPassword?: string) => {
    setData((prev) => ({
      ...prev,
      credentials: {
        login: nextLogin.trim() || prev.credentials.login,
        passwordHash: nextPassword ? hashPassword(nextPassword) : prev.credentials.passwordHash,
      },
    }));
  }, []);

  const resetToSeed = useCallback(() => {
    setData(structuredClone(SEED_DATA));
  }, []);

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);

  const importData = useCallback((json: string) => {
    const parsed = JSON.parse(json) as AppData;
    if (!parsed?.products || !parsed?.content || !parsed?.credentials) {
      throw new Error('Файл не схожий на резервну копію smartdim.');
    }
    setData(parsed);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    data.products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [data.products]);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      products: data.products,
      content: data.content,
      categories,
      isAuthed,
      createProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      updateContent,
      updateContacts,
      login,
      logout,
      updateCredentials,
      resetToSeed,
      exportData,
      importData,
    }),
    [
      data,
      categories,
      isAuthed,
      createProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      updateContent,
      updateContacts,
      login,
      logout,
      updateCredentials,
      resetToSeed,
      exportData,
      importData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
