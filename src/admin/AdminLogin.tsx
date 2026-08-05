import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { Icon } from '../components/icons/Icon';

export function AdminLogin() {
  const { login, content } = useStore();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!login(loginValue, password)) {
      setError('Невірний логін або пароль.');
    }
  }

  return (
    <div className="app-shell flex min-h-[100dvh] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white shadow-float">
            <Icon name="settings" size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink">Адмін-панель</h1>
          <p className="mt-1 text-sm text-ink-soft">Увійдіть, щоб керувати магазином {content.siteTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="surface space-y-4 p-6">
          <div>
            <label className="label" htmlFor="login">
              Логін
            </label>
            <input
              id="login"
              className="field"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              autoComplete="username"
              placeholder="Ваш логін"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Ваш пароль"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600"
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="btn-primary w-full py-3.5">
            Увійти
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-brand-700"
        >
          <Icon name="arrowLeft" size={16} /> На головну
        </Link>
      </motion.div>
    </div>
  );
}
