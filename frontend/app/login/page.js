'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') || '/';
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') await login({ email: form.email, password: form.password });
      else await signup(form);
      router.push(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className="muted">
          {mode === 'login' ? 'Sign in to place and track your orders.' : 'Sign up to start ordering.'}
        </p>

        {mode === 'signup' && (
          <label className="field">
            Full name
            <input required value={form.name} onChange={set('name')} autoComplete="name" />
          </label>
        )}
        <label className="field">
          Email
          <input type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        </label>
        <label className="field">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set('password')}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        {error && <p className="error-box" role="alert">{error}</p>}
        <button className="btn block" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <p className="muted center">
          {mode === 'login' ? 'New to Swadify?' : 'Already have an account?'}{' '}
          <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
