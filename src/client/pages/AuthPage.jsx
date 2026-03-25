import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Field, Input, Btn, Alert } from '../components/ui';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 52px)', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Card>
          <div style={{ padding: 28 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, marginBottom: 2 }}>MatchProof</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>Campus Lost & Found Board</div>
            <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
              {['login', 'register'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, padding: '10px 20px', cursor: 'pointer', background: 'none', border: 'none', color: tab === t ? 'var(--text)' : 'var(--text-3)', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, marginBottom: -2, textTransform: 'capitalize', transition: 'all 0.12s' }}>
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>
            {tab === 'login'
              ? <LoginForm login={login} navigate={navigate} showToast={showToast} />
              : <RegisterForm register={register} navigate={navigate} showToast={showToast} />
            }
          </div>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ login, navigate, showToast }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form);
      showToast('Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Alert type="error">{error}</Alert>}
      <Field label="Email">
        <Input type="text" autoComplete="off" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.edu" />
      </Field>
      <Field label="Password">
        <Input type="password" autoComplete="off" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
      </Field>
      <Btn variant="primary" onClick={handle} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
        {loading ? 'Logging in…' : 'Login'}
      </Btn>
    </div>
  );
}

function RegisterForm({ register, navigate, showToast }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      showToast('Registered successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Alert type="error">{error}</Alert>}
      <Field label="Full Name">
        <Input type="text" autoComplete="off" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
      </Field>
      <Field label="Email">
        <Input type="text" autoComplete="off" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.edu" />
      </Field>
      <Field label="Password (min 8 chars)">
        <Input type="password" autoComplete="off" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
      </Field>
      <Btn variant="primary" onClick={handle} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
        {loading ? 'Registering…' : 'Register'}
      </Btn>
    </div>
  );
}
