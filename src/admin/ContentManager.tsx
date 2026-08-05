import { useState } from 'react';
import { useStore } from '../store/store';
import type { Advantage, InfoItem, SiteContent } from '../types';
import { Icon, type IconName } from '../components/icons/Icon';
import { SavedToast } from './SavedToast';

const iconOptions: { value: string; label: string }[] = [
  { value: 'award', label: '🏅 Нагорода' },
  { value: 'ship', label: '🚢 Імпорт' },
  { value: 'truck', label: '🚚 Доставка' },
  { value: 'box', label: '📦 Пошта / товар' },
  { value: 'card', label: '💳 Картка' },
  { value: 'cash', label: '💵 Готівка' },
  { value: 'shield', label: '🛡 Гарантія' },
  { value: 'star', label: '⭐ Зірка' },
  { value: 'sparkle', label: '✨ Якість' },
  { value: 'check', label: '✔ Галочка' },
];

type ItemListKey = 'delivery' | 'payment';

export function ContentManager() {
  const { content, updateContent } = useStore();
  const [draft, setDraft] = useState<SiteContent>(() => structuredClone(content));
  const [saved, setSaved] = useState(false);

  function setHero<K extends keyof SiteContent['hero']>(key: K, value: string) {
    setDraft((d) => ({ ...d, hero: { ...d.hero, [key]: value } }));
  }

  function setFooter<K extends keyof SiteContent['footer']>(key: K, value: string) {
    setDraft((d) => ({ ...d, footer: { ...d.footer, [key]: value } }));
  }

  function updateAdvantage(id: string, patch: Partial<Advantage>) {
    setDraft((d) => ({
      ...d,
      advantages: d.advantages.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }

  function addAdvantage() {
    setDraft((d) => ({
      ...d,
      advantages: [...d.advantages, { id: `a-${Date.now().toString(36)}`, icon: 'check', title: '' }],
    }));
  }

  function removeAdvantage(id: string) {
    setDraft((d) => ({ ...d, advantages: d.advantages.filter((a) => a.id !== id) }));
  }

  function updateItem(list: ItemListKey, id: string, patch: Partial<InfoItem>) {
    setDraft((d) => ({
      ...d,
      [list]: d[list].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }

  function addItem(list: ItemListKey) {
    const item: InfoItem = {
      id: `${list}-${Date.now().toString(36)}`,
      icon: list === 'payment' ? 'card' : 'truck',
      title: '',
      text: '',
    };
    setDraft((d) => ({ ...d, [list]: [...d[list], item] }));
  }

  function removeItem(list: ItemListKey, id: string) {
    setDraft((d) => ({ ...d, [list]: d[list].filter((it) => it.id !== id) }));
  }

  function renderItemList(list: ItemListKey) {
    return (
      <div className="space-y-3">
        {draft[list].map((it) => (
          <div key={it.id} className="rounded-3xl bg-mint-50 p-3 ring-1 ring-mint-100">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand">
                <Icon name={(iconOptions.find((o) => o.value === it.icon)?.value ?? 'check') as IconName} size={20} />
              </span>
              <select
                className="field !py-2"
                value={it.icon}
                onChange={(e) => updateItem(list, it.id, { icon: e.target.value })}
              >
                {iconOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeItem(list, it.id)}
                aria-label="Видалити рядок"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-red-500"
              >
                <Icon name="trash" size={18} />
              </button>
            </div>
            <input
              className="field mt-2"
              value={it.title}
              onChange={(e) => updateItem(list, it.id, { title: e.target.value })}
              placeholder="Назва (напр. Нова Пошта)"
            />
            <input
              className="field mt-2"
              value={it.text ?? ''}
              onChange={(e) => updateItem(list, it.id, { text: e.target.value })}
              placeholder="Опис (необов’язково)"
            />
          </div>
        ))}
        <button type="button" onClick={() => addItem(list)} className="btn-soft">
          <Icon name="plus" size={16} /> Додати рядок
        </button>
      </div>
    );
  }

  function save() {
    updateContent({
      siteTitle: draft.siteTitle,
      currency: draft.currency,
      hero: draft.hero,
      advantagesTitle: draft.advantagesTitle,
      advantages: draft.advantages.filter((a) => a.title.trim()),
      deliveryPaymentTitle: draft.deliveryPaymentTitle,
      deliveryTitle: draft.deliveryTitle,
      delivery: draft.delivery.filter((it) => it.title.trim()),
      paymentTitle: draft.paymentTitle,
      payment: draft.payment.filter((it) => it.title.trim()),
      footer: draft.footer,
    });
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <h3 className="mb-4 text-base font-extrabold text-ink">Загальне</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Назва сайту</label>
            <input
              className="field"
              value={draft.siteTitle}
              onChange={(e) => setDraft((d) => ({ ...d, siteTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Валюта</label>
            <input
              className="field"
              value={draft.currency}
              onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
            />
          </div>
        </div>
      </section>

      <section className="surface p-5">
        <h3 className="mb-4 text-base font-extrabold text-ink">Головний банер</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Верхній підпис</label>
            <input className="field" value={draft.hero.eyebrow} onChange={(e) => setHero('eyebrow', e.target.value)} />
          </div>
          <div>
            <label className="label">Заголовок</label>
            <input className="field" value={draft.hero.title} onChange={(e) => setHero('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Підзаголовок</label>
            <input className="field" value={draft.hero.subtitle} onChange={(e) => setHero('subtitle', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-ink">Наші переваги</h3>
        </div>
        <div className="mb-4">
          <label className="label">Заголовок блоку</label>
          <input
            className="field"
            value={draft.advantagesTitle}
            onChange={(e) => setDraft((d) => ({ ...d, advantagesTitle: e.target.value }))}
          />
        </div>
        <div className="space-y-3">
          {draft.advantages.map((adv) => (
            <div key={adv.id} className="rounded-3xl bg-mint-50 p-3 ring-1 ring-mint-100">
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand">
                  <Icon name={(iconOptions.find((o) => o.value === adv.icon)?.value ?? 'check') as IconName} size={20} />
                </span>
                <select
                  className="field !py-2"
                  value={adv.icon}
                  onChange={(e) => updateAdvantage(adv.id, { icon: e.target.value })}
                >
                  {iconOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeAdvantage(adv.id)}
                  aria-label="Видалити перевагу"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-red-500"
                >
                  <Icon name="trash" size={18} />
                </button>
              </div>
              <input
                className="field mt-2"
                value={adv.title}
                onChange={(e) => updateAdvantage(adv.id, { title: e.target.value })}
                placeholder="Текст переваги"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={addAdvantage} className="btn-soft mt-3">
          <Icon name="plus" size={16} /> Додати перевагу
        </button>
      </section>

      <section className="surface p-5">
        <h3 className="mb-1 text-base font-extrabold text-ink">Доставка та оплата</h3>
        <p className="mb-4 text-sm text-ink-soft">Блок відображається на головній сторінці.</p>
        <div className="mb-4">
          <label className="label">Заголовок блоку</label>
          <input
            className="field"
            value={draft.deliveryPaymentTitle}
            onChange={(e) => setDraft((d) => ({ ...d, deliveryPaymentTitle: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Заголовок колонки «Доставка»</label>
            <input
              className="field mb-3"
              value={draft.deliveryTitle}
              onChange={(e) => setDraft((d) => ({ ...d, deliveryTitle: e.target.value }))}
            />
            {renderItemList('delivery')}
          </div>
          <div>
            <label className="label">Заголовок колонки «Оплата»</label>
            <input
              className="field mb-3"
              value={draft.paymentTitle}
              onChange={(e) => setDraft((d) => ({ ...d, paymentTitle: e.target.value }))}
            />
            {renderItemList('payment')}
          </div>
        </div>
      </section>

      <section className="surface p-5">
        <h3 className="mb-4 text-base font-extrabold text-ink">Футер</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Про компанію</label>
            <textarea
              className="field min-h-[100px] resize-y"
              value={draft.footer.about}
              onChange={(e) => setFooter('about', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Копірайт</label>
            <input className="field" value={draft.footer.rights} onChange={(e) => setFooter('rights', e.target.value)} />
          </div>
        </div>
      </section>

      <button type="button" onClick={save} className="btn-primary sticky bottom-4 w-full py-3.5 shadow-float">
        <Icon name="check" size={18} /> Зберегти зміни
      </button>

      <SavedToast show={saved} onDone={() => setSaved(false)} />
    </div>
  );
}
