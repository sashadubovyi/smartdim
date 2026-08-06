import { useEffect, useState } from 'react';
import { PRODUCT, SITE, CONTACTS } from '../config';
import { formatPrice, contactHref } from '../lib/format';
import { submitOrder, paymentLabel, type DeliveryMethod, type PaymentOption } from '../lib/orders';
import { isFirebaseConfigured } from '../lib/firebase';
import { Icon } from './icons/Icon';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const DELIVERY_METHODS: DeliveryMethod[] = [
  'Відділення Нова Пошта',
  'Поштомат Нова Пошта',
  "Кур'єр Нова Пошта",
  'Укрпошта',
];

// Label for the free-text details field depending on the chosen method.
const detailsLabel: Record<DeliveryMethod, string> = {
  'Відділення Нова Пошта': 'Номер відділення',
  'Поштомат Нова Пошта': 'Номер поштомата',
  "Кур'єр Нова Пошта": 'Адреса (вулиця, будинок, квартира)',
  'Укрпошта': 'Відділення або поштовий індекс',
};

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<DeliveryMethod>('Відділення Нова Пошта');
  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const [payment, setPayment] = useState<PaymentOption>('full');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const total = PRODUCT.price * qty;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setDone(false);
        setError('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function orderText(): string {
    return (
      `Нове замовлення: ${PRODUCT.name}\n` +
      `Кількість: ${qty} × ${formatPrice(PRODUCT.price, SITE.currency)} = ${formatPrice(total, SITE.currency)}\n` +
      `ПІБ: ${fullName}\nТелефон: ${phone}\n` +
      `Доставка: ${method}, м. ${city}, ${details}\n` +
      `Оплата: ${paymentLabel[payment]}`
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !phone.trim() || !city.trim() || !details.trim()) {
      setError('Заповніть, будь ласка, усі обов’язкові поля.');
      return;
    }
    setBusy(true);
    try {
      const saved = await submitOrder({
        fullName: fullName.trim(),
        phone: phone.trim(),
        deliveryMethod: method,
        city: city.trim(),
        deliveryDetails: details.trim(),
        payment,
        productName: PRODUCT.name,
        price: PRODUCT.price,
        qty,
      });
      if (!saved) {
        // Firebase not configured yet — fall back to WhatsApp so the order
        // still reaches the seller.
        window.open(contactHref('whatsapp', CONTACTS.whatsapp, orderText()), '_blank', 'noopener');
      }
      setDone(true);
    } catch {
      setError('Не вдалося зберегти замовлення. Спробуйте ще раз або напишіть нам у WhatsApp.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center sm:items-center ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative max-h-[94dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl transition-all duration-300 ease-out sm:rounded-[2rem] ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-mint-200 sm:hidden" />

        {done ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-100 text-brand">
              <Icon name="check" size={34} />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-ink">Замовлення прийнято!</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Дякуємо, {fullName || 'друже'}! Ми зв’яжемося з вами найближчим часом для підтвердження.
            </p>
            <button type="button" onClick={onClose} className="btn-primary mt-6 w-full py-3.5">
              Готово
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-ink">Оформлення замовлення</h3>
                <p className="mt-1 text-sm text-ink-soft">{PRODUCT.name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint-100 text-brand-700 transition active:scale-95"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">ПІБ *</label>
                <input className="field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Прізвище Ім'я По батькові" autoComplete="name" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">Номер телефону *</label>
                <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380..." inputMode="tel" autoComplete="tel" />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between rounded-2xl bg-mint-50 px-4 py-3 ring-1 ring-mint-100">
                <span className="text-sm font-semibold text-ink">Кількість</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Менше" className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-700 shadow-soft active:scale-90">
                    <Icon name="minus" size={16} />
                  </button>
                  <span className="w-6 text-center text-base font-bold text-ink">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Більше" className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-700 shadow-soft active:scale-90">
                    <Icon name="plus" size={16} />
                  </button>
                </div>
              </div>

              {/* Delivery method */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">Спосіб доставки *</label>
                <select className="field" value={method} onChange={(e) => setMethod(e.target.value as DeliveryMethod)}>
                  {DELIVERY_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-soft">Місто *</label>
                  <input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Київ" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-soft">{detailsLabel[method]} *</label>
                  <input className="field" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={detailsLabel[method]} />
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">Оплата *</label>
                <div className="rounded-2xl bg-brand-50 px-4 py-3 text-xs leading-relaxed text-brand-700 ring-1 ring-brand-100">
                  Відправка здійснюється після повної оплати або після передплати 200 грн.
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(['full', 'prepay200'] as PaymentOption[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPayment(opt)}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition ${
                        payment === opt
                          ? 'bg-brand text-white ring-brand'
                          : 'bg-white text-ink ring-mint-200 hover:bg-mint-50'
                      }`}
                    >
                      <Icon name={payment === opt ? 'check' : opt === 'full' ? 'card' : 'cash'} size={16} />
                      {paymentLabel[opt]}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>}

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-ink-soft">Разом</span>
                <span className="text-xl font-extrabold text-ink">{formatPrice(total, SITE.currency)}</span>
              </div>

              <button type="submit" disabled={busy} className="btn-primary w-full py-4 text-base">
                {busy ? 'Надсилаємо…' : (
                  <>
                    <Icon name="check" size={20} /> Підтвердити замовлення
                  </>
                )}
              </button>
              {!isFirebaseConfigured && (
                <p className="text-center text-[11px] text-ink-muted">
                  Замовлення буде надіслано у WhatsApp продавця.
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
