import { useRef, useState } from 'react';
import { useStore } from '../store/store';
import { Icon } from '../components/icons/Icon';
import { SavedToast } from './SavedToast';

export function SettingsManager() {
  const { data, updateCredentials, exportData, importData, resetToSeed, logout } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [login, setLogin] = useState(data.credentials.login);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [credError, setCredError] = useState('');
  const [toast, setToast] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  function saveCredentials() {
    setCredError('');
    if (!login.trim()) {
      setCredError('Логін не може бути порожнім.');
      return;
    }
    if (password || confirm) {
      if (password.length < 4) {
        setCredError('Пароль має містити щонайменше 4 символи.');
        return;
      }
      if (password !== confirm) {
        setCredError('Паролі не збігаються.');
        return;
      }
    }
    updateCredentials(login, password || undefined);
    setPassword('');
    setConfirm('');
    setToast('Дані для входу оновлено');
  }

  function handleExport() {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = data.content.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'store';
    a.download = `${slug}-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(String(reader.result));
        setToast('Дані імпортовано');
      } catch (err) {
        setToast(err instanceof Error ? err.message : 'Помилка імпорту');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="space-y-4">
      {/* Credentials */}
      <section className="surface p-5">
        <h3 className="mb-1 text-base font-extrabold text-ink">Дані для входу</h3>
        <p className="mb-4 text-sm text-ink-soft">Змініть логін та пароль адміністратора.</p>
        <div className="space-y-4">
          <div>
            <label className="label">Логін</label>
            <input className="field" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Новий пароль</label>
              <input
                type="password"
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Залиште порожнім, щоб не змінювати"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="label">Повторіть пароль</label>
              <input
                type="password"
                className="field"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          {credError && (
            <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{credError}</p>
          )}
          <button type="button" onClick={saveCredentials} className="btn-primary">
            <Icon name="check" size={18} /> Оновити дані входу
          </button>
        </div>
      </section>

      {/* Data backup */}
      <section className="surface p-5">
        <h3 className="mb-1 text-base font-extrabold text-ink">Резервне копіювання</h3>
        <p className="mb-4 text-sm text-ink-soft">
          Дані магазину зберігаються у цьому браузері. Робіть резервні копії, щоб перенести їх на інший
          пристрій.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleExport} className="btn-ghost">
            <Icon name="box" size={18} /> Експорт (JSON)
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost">
            <Icon name="image" size={18} /> Імпорт
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => handleImport(e.target.files?.[0])}
          />
        </div>
      </section>

      {/* Danger zone */}
      <section className="surface border border-red-100 p-5">
        <h3 className="mb-1 text-base font-extrabold text-red-500">Небезпечна зона</h3>
        <p className="mb-4 text-sm text-ink-soft">
          Скидання поверне демонстраційні товари й тексти. Усі ваші зміни буде втрачено.
        </p>
        {confirmReset ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetToSeed();
                setConfirmReset(false);
                setToast('Відновлено демо-дані');
              }}
              className="btn bg-red-500 text-white hover:bg-red-600"
            >
              Так, скинути все
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="btn-ghost">
              Скасувати
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="btn bg-red-50 text-red-600 hover:bg-red-100"
          >
            <Icon name="trash" size={18} /> Скинути до демо-даних
          </button>
        )}
      </section>

      <button type="button" onClick={logout} className="btn-ghost w-full">
        <Icon name="logout" size={18} /> Вийти з панелі
      </button>

      <SavedToast show={!!toast} onDone={() => setToast('')} message={toast} />
    </div>
  );
}
