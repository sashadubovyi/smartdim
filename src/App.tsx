import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SITE,
  PRODUCT,
  FEATURES,
  STATS,
  USE_CASES,
  SPECS,
  IN_BOX,
  FAQ,
  ADVANTAGES,
  DELIVERY,
  PAYMENT,
} from './config';
import { formatPrice } from './lib/format';
import { Icon } from './components/icons/Icon';
import { TopBar } from './components/TopBar';
import { SiteFooter } from './components/SiteFooter';
import { ContactModal } from './components/ContactModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState('Замовити помпу');
  const rootRef = useRef<HTMLDivElement>(null);

  const openBuy = () => {
    setModalHeading('Замовити помпу');
    setModalOpen(true);
  };
  const openContact = () => {
    setModalHeading('Зв’язатися з нами');
    setModalOpen(true);
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // CSS already reveals everything for reduced motion.

    const ctx = gsap.context(() => {
      // Hero intro on load.
      gsap.to('.hero-in', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.05,
      });

      // Scroll reveals (batched for performance).
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out', overwrite: true }),
      });

      // Gentle parallax on scenic images.
      gsap.utils.toArray<HTMLElement>('.parallax').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      // Animated stat counters.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: end,
              duration: 1.3,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.v).toLocaleString('uk-UA');
              },
            }),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const discount =
    PRODUCT.oldPrice && PRODUCT.oldPrice > PRODUCT.price
      ? Math.round((1 - PRODUCT.price / PRODUCT.oldPrice) * 100)
      : 0;

  return (
    <div ref={rootRef} id="top">
      <TopBar onContact={openContact} />

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mint-50 to-white" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-2xl" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-8 px-5 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="hero-in chip bg-mint-200 text-brand-700">
              <Icon name="droplet" size={14} /> {PRODUCT.availability}
            </span>
            <h1 className="hero-in mt-4 text-[34px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {PRODUCT.name}
            </h1>
            <p className="hero-in mt-3 text-base font-medium text-brand-600">{PRODUCT.subtitle}</p>
            <p className="hero-in mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">{PRODUCT.lead}</p>

            <div className="hero-in mt-6 flex items-end gap-3">
              <span className="text-4xl font-extrabold text-brand-700">{formatPrice(PRODUCT.price, SITE.currency)}</span>
              {discount > 0 && (
                <>
                  <span className="mb-1 text-lg font-medium text-ink-muted line-through">
                    {formatPrice(PRODUCT.oldPrice!, SITE.currency)}
                  </span>
                  <span className="mb-1.5 chip bg-brand text-white">-{discount}%</span>
                </>
              )}
            </div>

            <div className="hero-in mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={openBuy} className="btn-primary px-7 py-4 text-base">
                <Icon name="bag" size={20} /> Купити
              </button>
              <button type="button" onClick={openContact} className="btn-ghost px-6 py-4 text-base">
                <Icon name="phone" size={18} /> Зв’язатися
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="hero-in relative mx-auto w-full max-w-sm">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-card ring-1 ring-mint-100">
              <img
                src={PRODUCT.images.hero}
                alt={PRODUCT.name}
                className="parallax aspect-[4/5] w-full scale-110 object-cover"
              />
            </div>
            <div className="absolute -left-3 top-6 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-brand-700 shadow-soft ring-1 ring-mint-100">
              <Icon name="plug" size={14} className="mb-0.5 inline" /> USB Type-C
            </div>
            <div className="absolute -right-2 bottom-24 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-brand-700 shadow-soft ring-1 ring-mint-100">
              <Icon name="mute" size={14} className="mb-0.5 inline" /> Безшумна
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Stats ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-6 sm:px-6">
        <div className="grid grid-cols-3 gap-3 rounded-[2rem] bg-brand-700 px-4 py-7 text-white shadow-card sm:gap-6 sm:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="reveal text-center">
              <div className="text-3xl font-extrabold sm:text-5xl">
                <span data-count={s.value}>0</span>
              </div>
              <div className="mt-1 text-[11px] leading-tight text-white/75 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Fast dispense (image + text) ───────────────── */}
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="reveal order-2 md:order-1">
          <span className="chip bg-mint-100 text-brand-700">
            <Icon name="bolt" size={14} /> Швидкість
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Склянка чистої води за 3 секунди
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Потужний насос подає воду майже миттєво — більше не потрібно нахиляти важкий бутель. Одне натискання, і
            склянка наповнена. Зручно та акуратно, без розливань.
          </p>
          <button type="button" onClick={openBuy} className="btn-primary mt-6 px-6 py-3.5">
            <Icon name="bag" size={18} /> Купити • {formatPrice(PRODUCT.price, SITE.currency)}
          </button>
        </div>
        <div className="reveal order-1 overflow-hidden rounded-[2.5rem] shadow-card ring-1 ring-mint-100 md:order-2">
          <img src={PRODUCT.images.flow} alt="Швидка подача води" className="parallax aspect-[4/3] w-full scale-110 object-cover" />
        </div>
      </section>

      {/* ───────────────── Features grid ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-6 sm:px-6">
        <h2 className="reveal text-center text-3xl font-extrabold text-ink sm:text-4xl">Чому саме ця помпа</h2>
        <p className="reveal mx-auto mt-2 max-w-xl text-center text-[15px] text-ink-soft">
          Продумана до дрібниць: швидка, тиха й автономна. Все, що потрібно для щоденного комфорту.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="reveal rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-mint-100">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-100 text-brand">
                <Icon name={f.icon} size={24} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── USB-C highlight (image + text) ───────────────── */}
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="reveal overflow-hidden rounded-[2.5rem] shadow-card ring-1 ring-mint-100">
          <img src={PRODUCT.images.usbc} alt="Заряджання USB Type-C" className="parallax aspect-[4/3] w-full scale-110 object-cover" />
        </div>
        <div className="reveal">
          <span className="chip bg-mint-100 text-brand-700">
            <Icon name="plug" size={14} /> Заряджання
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Один заряд — до 15 бутлів
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Ємний акумулятор 2000 мА·год і сучасний роз’єм USB Type-C. Заряджайте від адаптера, ноутбука чи павербанка —
            кабель уже в комплекті. Жодних дротів під час використання.
          </p>
          <ul className="mt-5 space-y-2">
            {['Кабель USB Type-C у комплекті', 'Повне заряджання за кілька годин', 'Індикатор роботи'].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-mint-100 text-brand">
                  <Icon name="check" size={14} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────── Use cases ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {USE_CASES.map((u) => (
            <div key={u.title} className="reveal rounded-[1.75rem] bg-mint-50 p-6 ring-1 ring-mint-100">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-soft">
                <Icon name={u.icon} size={24} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{u.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Full-width image CTA band ───────────────── */}
      <section className="relative my-10 overflow-hidden">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-[2.5rem] bg-brand-800 px-6 py-12 text-center text-white sm:px-10 md:flex-row md:justify-between md:text-left">
          <div className="reveal max-w-lg">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Замовте помпу вже сьогодні</h2>
            <p className="mt-3 text-white/75">
            Швидка доставка по всій Україні, оплата при отриманні, гарантія та повернення.
            </p>
          </div>
          <button type="button" onClick={openBuy} className="reveal btn bg-white px-8 py-4 text-base text-brand-700 hover:bg-mint-50">
            <Icon name="bag" size={20} /> Купити • {formatPrice(PRODUCT.price, SITE.currency)}
          </button>
        </div>
      </section>

      {/* ───────────────── Specs + description ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="reveal">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Опис</h2>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{PRODUCT.description}</p>

            <h3 className="mt-8 text-lg font-bold text-ink">Комплектація</h3>
            <ul className="mt-3 space-y-2">
              {IN_BOX.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-mint-100 text-brand">
                    <Icon name="check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Характеристики</h2>
            <dl className="mt-4 overflow-hidden rounded-[1.5rem] ring-1 ring-mint-100">
              {SPECS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${
                    i % 2 ? 'bg-white' : 'bg-mint-50'
                  }`}
                >
                  <dt className="text-ink-soft">{s.label}</dt>
                  <dd className="text-right font-bold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────────── Advantages ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((a) => (
            <div key={a.title} className="reveal flex items-center gap-3 rounded-[1.5rem] bg-white p-4 shadow-soft ring-1 ring-mint-100">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-100 text-brand">
                <Icon name={a.icon} size={22} />
              </span>
              <p className="text-sm font-bold leading-snug text-ink">{a.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
        <h2 className="reveal text-center text-3xl font-extrabold text-ink sm:text-4xl">Питання та відповіді</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="reveal group rounded-[1.5rem] bg-white p-5 shadow-soft ring-1 ring-mint-100 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                {item.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint-100 text-brand transition-transform group-open:rotate-45">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────────────── Contact CTA (center) ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-14 text-center text-white shadow-card">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Залишились питання?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Залиште контакти — ми передзвонимо та допоможемо з вибором і оформленням замовлення.
            </p>
            <button
              type="button"
              onClick={openContact}
              className="btn mx-auto mt-7 bg-white px-8 py-4 text-base text-brand-700 hover:bg-mint-50"
            >
              <Icon name="phone" size={20} /> Зв’язатися
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────── Delivery & payment ───────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6">
        <h2 className="reveal text-center text-3xl font-extrabold text-ink sm:text-4xl">Доставка та оплата</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="reveal rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-mint-100">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white">
                <Icon name="truck" size={22} />
              </span>
              <h3 className="text-lg font-extrabold text-ink">Доставка</h3>
            </div>
            <ul className="space-y-3">
              {DELIVERY.map((d) => (
                <li key={d.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-brand">
                    <Icon name={d.icon} size={18} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-ink">{d.title}</p>
                    <p className="text-sm text-ink-soft">{d.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-mint-100">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white">
                <Icon name="card" size={22} />
              </span>
              <h3 className="text-lg font-extrabold text-ink">Оплата</h3>
            </div>
            <ul className="space-y-3">
              {PAYMENT.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-brand">
                    <Icon name={p.icon} size={18} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-ink">{p.title}</p>
                    <p className="text-sm text-ink-soft">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter onContact={openContact} />

      {/* Floating buy button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={openBuy}
          className="btn-primary pointer-events-auto px-8 py-4 text-base shadow-float"
        >
          <Icon name="bag" size={20} /> Купити • {formatPrice(PRODUCT.price, SITE.currency)}
        </button>
      </div>

      <ContactModal open={modalOpen} heading={modalHeading} onClose={() => setModalOpen(false)} />
    </div>
  );
}
