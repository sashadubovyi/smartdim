import { useState } from 'react';
import { useStore } from '../store/store';
import type { Contacts } from '../types';
import { Icon, type IconName } from '../components/icons/Icon';
import { SavedToast } from './SavedToast';

const fields: { key: keyof Contacts; label: string; icon: IconName; hint: string }[] = [
  { key: 'phone', label: 'Телефон', icon: 'phone', hint: '+380XXXXXXXXX' },
  { key: 'telegram', label: 'Telegram', icon: 'telegram', hint: 'нік без @ або посилання' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', hint: '+380XXXXXXXXX' },
  { key: 'viber', label: 'Viber', icon: 'viber', hint: '+380XXXXXXXXX' },
];

export function ContactsManager() {
  const { content, updateContacts } = useStore();
  const [draft, setDraft] = useState<Contacts>(() => ({ ...content.contacts }));
  const [saved, setSaved] = useState(false);

  function save() {
    updateContacts(draft);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <section className="surface p-5">
        <h3 className="mb-1 text-base font-extrabold text-ink">Контакти</h3>
        <p className="mb-4 text-sm text-ink-soft">
          Ці дані використовуються у меню, футері та вікні «Купити».
        </p>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label flex items-center gap-2">
                <Icon name={f.icon} size={16} /> {f.label}
              </label>
              <input
                className="field"
                value={draft[f.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                placeholder={f.hint}
              />
            </div>
          ))}
        </div>
      </section>

      <button type="button" onClick={save} className="btn-primary w-full py-3.5">
        <Icon name="check" size={18} /> Зберегти контакти
      </button>

      <SavedToast show={saved} onDone={() => setSaved(false)} />
    </div>
  );
}
