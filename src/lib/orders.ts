import { getFirebase, isFirebaseConfigured } from './firebase';

export type DeliveryMethod =
  | 'Відділення Нова Пошта'
  | 'Поштомат Нова Пошта'
  | "Кур'єр Нова Пошта"
  | 'Укрпошта';

export type PaymentOption = 'full' | 'prepay200';

export interface OrderInput {
  fullName: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  city: string;
  deliveryDetails: string;
  payment: PaymentOption;
  productName: string;
  price: number;
  qty: number;
}

export interface Order extends OrderInput {
  id: string;
  total: number;
  taken: boolean;
  createdAt: number;
}

export const paymentLabel: Record<PaymentOption, string> = {
  full: 'Повна оплата',
  prepay200: 'Передплата 200 грн',
};

/**
 * Persist an order to Firestore. Returns true on success. When Firebase is not
 * configured yet it returns false so the UI can fall back to another channel.
 */
export async function submitOrder(input: OrderInput): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  const { db } = await getFirebase();
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'orders'), {
    ...input,
    total: input.price * input.qty,
    taken: false,
    createdAt: serverTimestamp(),
  });
  return true;
}

/** Live-subscribe to all orders (admin only). Returns an unsubscribe fn. */
export async function watchOrders(cb: (orders: Order[]) => void): Promise<() => void> {
  const { db } = await getFirebase();
  const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const orders: Order[] = snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const ts = data.createdAt as { toMillis?: () => number } | undefined;
      return {
        id: d.id,
        fullName: (data.fullName as string) ?? '',
        phone: (data.phone as string) ?? '',
        deliveryMethod: data.deliveryMethod as DeliveryMethod,
        city: (data.city as string) ?? '',
        deliveryDetails: (data.deliveryDetails as string) ?? '',
        payment: (data.payment as PaymentOption) ?? 'full',
        productName: (data.productName as string) ?? '',
        price: (data.price as number) ?? 0,
        qty: (data.qty as number) ?? 1,
        total: (data.total as number) ?? 0,
        taken: Boolean(data.taken),
        createdAt: ts?.toMillis ? ts.toMillis() : Date.now(),
      };
    });
    cb(orders);
  });
}

/** Toggle the "taken by manager" flag on an order. */
export async function setOrderTaken(id: string, taken: boolean): Promise<void> {
  const { db } = await getFirebase();
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'orders', id), { taken });
}
