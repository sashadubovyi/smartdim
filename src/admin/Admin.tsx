import { useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';
import { watchAdmin, signInAdmin, signOutAdmin, getCurrentLogin, changeCredentials } from '../lib/adminAuth';
import { watchOrders, setOrderTaken, paymentLabel, type Order } from '../lib/orders';
import { SITE } from '../config';
import { formatPrice } from '../lib/format';
import { Icon } from '../components/icons/Icon';

export function Admin() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setReady(true);
      return;
    }
    let unsub: (() => void) | undefined;
    watchAdmin((v) => {
      setSignedIn(v);
      setReady(true);
    }).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  if (!isFirebaseConfigured) return <SetupNotice />;
  if (!ready) return <Splash />;
  if (!signedIn) return <LoginForm />;
  return <Dashboard />;
}

function Splash() {
  return (
    <div className="grid min-h-[100dvh] place-items-center text-ink-muted">
      <div className="animate-pulse text-sm">Завантаження…</div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white shadow-float">
        <Icon name="settings" size={28} />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">Потрібне налаштування</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Щоб замовлення зберігались і зʼявлялись тут, заповніть Firebase-конфіг у файлі{' '}
        <span className="font-semibold">src/firebaseConfig.ts</span> та виконайте кроки з README (Firestore + Auth).
      </p>
      <a href="/" className="btn-ghost mt-6">
        <Icon name="arrowLeft" size={16} /> На сайт
      </a>
    </div>
  );
}

function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInAdmin(login, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка входу.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-sm flex-col items-center justify-center px-5">
      <div className="w-full">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white shadow-float">
            <Icon name="settings" size={28} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-ink">Адмін-панель</h1>
          <p className="mt-1 text-sm text-ink-soft">Увійдіть, щоб керувати замовленнями {SITE.brand}</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-mint-100">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Логін</label>
            <input className="field" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Ваш логін" autoComplete="username" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Пароль</label>
            <input type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ваш пароль" autoComplete="current-password" />
          </div>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
            {busy ? 'Вхід…' : 'Увійти'}
          </button>
        </form>
        <a href="/" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-brand-700">
          <Icon name="arrowLeft" size={16} /> На головну
        </a>
      </div>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<'orders' | 'settings'>('orders');

  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="sticky top-0 z-40 border-b border-mint-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-ink">{SITE.brand}</span>
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
              <Icon name="arrowLeft" size={16} /> На сайт
            </a>
            <button type="button" onClick={() => signOutAdmin()} aria-label="Вийти" className="grid h-9 w-9 place-items-center rounded-full text-brand-700 hover:bg-mint-100">
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-3xl gap-1 px-5 pb-2">
          {(['orders', 'settings'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t ? 'bg-brand text-white' : 'text-ink-soft hover:text-brand-700'
              }`}
            >
              {t === 'orders' ? 'Замовлення' : 'Налаштування'}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6">
        {tab === 'orders' ? <Orders /> : <Settings />}
      </main>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let unsub: (() => void) | undefined;
    watchOrders(setOrders)
      .then((u) => (unsub = u))
      .catch(() => setErr('Не вдалося завантажити замовлення.'));
    return () => unsub?.();
  }, []);

  if (err) return <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{err}</p>;
  if (!orders) return <p className="text-sm text-ink-muted">Завантаження замовлень…</p>;

  const newCount = orders.filter((o) => !o.taken).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-ink">Замовлення</h2>
        <span className="text-sm text-ink-soft">
          Усього: {orders.length} · Нових: {newCount}
        </span>
      </div>

      {orders.length === 0 && (
        <div className="rounded-[1.5rem] bg-mint-50 p-8 text-center text-ink-soft ring-1 ring-mint-100">
          Замовлень поки немає.
        </div>
      )}

      <div className="space-y-3">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      await setOrderTaken(order.id, !order.taken);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`rounded-[1.5rem] p-4 shadow-soft ring-1 transition ${order.taken ? 'bg-mint-50 ring-mint-200' : 'bg-white ring-mint-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-ink">{order.fullName}</p>
          <a href={`tel:${order.phone}`} className="text-sm font-semibold text-brand-700">
            {order.phone}
          </a>
        </div>
        <span className="text-xs text-ink-muted">{new Date(order.createdAt).toLocaleString('uk-UA')}</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-mint-50 px-3 py-2 ring-1 ring-mint-100">
          <div className="text-[11px] font-semibold uppercase text-ink-muted">Доставка</div>
          <div className="font-medium text-ink">{order.deliveryMethod}</div>
          <div className="text-ink-soft">м. {order.city}, {order.deliveryDetails}</div>
        </div>
        <div className="rounded-xl bg-mint-50 px-3 py-2 ring-1 ring-mint-100">
          <div className="text-[11px] font-semibold uppercase text-ink-muted">Товар</div>
          <div className="font-medium text-ink">{order.productName}</div>
          <div className="text-ink-soft">
            {order.qty} шт · {paymentLabel[order.payment]}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-extrabold text-brand-700">{formatPrice(order.total, SITE.currency)}</span>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" checked={order.taken} onChange={toggle} disabled={saving} className="h-5 w-5 rounded accent-brand" />
          Взято в роботу менеджером
        </label>
      </div>
    </div>
  );
}

function Settings() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCurrentLogin().then(setLogin);
  }, []);

  async function save() {
    setErr('');
    setMsg('');
    if (!login.trim()) {
      setErr('Логін не може бути порожнім.');
      return;
    }
    if (password || confirm) {
      if (password.length < 6) {
        setErr('Пароль має містити щонайменше 6 символів.');
        return;
      }
      if (password !== confirm) {
        setErr('Паролі не збігаються.');
        return;
      }
    }
    setBusy(true);
    try {
      await changeCredentials(login, password || undefined);
      setPassword('');
      setConfirm('');
      setMsg('Дані для входу оновлено.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Не вдалося зберегти.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-mint-100">
        <h2 className="mb-1 text-lg font-extrabold text-ink">Дані для входу</h2>
        <p className="mb-4 text-sm text-ink-soft">Змініть логін і пароль адміністратора.</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Логін</label>
            <input className="field" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Новий пароль</label>
              <input type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Залиште порожнім, щоб не змінювати" autoComplete="new-password" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Повторіть пароль</label>
              <input type="password" className="field" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </div>
          </div>
          {err && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{err}</p>}
          {msg && <p className="rounded-2xl bg-mint-100 px-4 py-2.5 text-sm font-medium text-brand-700">{msg}</p>}
          <button type="button" onClick={save} disabled={busy} className="btn-primary">
            <Icon name="check" size={18} /> {busy ? 'Збереження…' : 'Оновити дані входу'}
          </button>
        </div>
      </section>

      <button type="button" onClick={() => signOutAdmin()} className="btn-ghost w-full">
        <Icon name="logout" size={18} /> Вийти з панелі
      </button>
    </div>
  );
}
