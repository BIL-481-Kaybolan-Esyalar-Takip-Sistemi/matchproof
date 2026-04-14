import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Btn } from './ui';

export default function Header() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out.');
      navigate('/login');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const navLink = (to, label) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link to={to} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: active ? '#fff' : 'rgba(248,251,255,0.78)', textDecoration: 'none', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)'}`, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.15s, background 0.15s, border-color 0.15s' }}>
        {label}
      </Link>
    );
  };

  return (
    <header style={{ background: 'rgba(20, 32, 51, 0.92)', color: 'var(--accent-inv)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(18px)', boxShadow: '0 10px 28px rgba(20, 32, 51, 0.16)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', minHeight: 64, gap: 0 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.5px', color: 'var(--accent-inv)', textDecoration: 'none', paddingRight: 18, borderRight: '1px solid rgba(255,255,255,0.12)', marginRight: 16 }}>
          Match<span style={{ color: 'rgba(248,251,255,0.7)', fontWeight: 400 }}>Proof</span>
        </Link>
        {user && (
          <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
            {navLink('/', 'Browse')}
            {navLink('/new', '+ New Post')}
            {user.role === 'admin' && navLink('/admin', 'Admin')}
          </div>
        )}
        {!user && <div style={{ flex: 1 }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(248,251,255,0.62)', background: 'rgba(255,255,255,0.05)', padding: '7px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)' }}>
                <strong style={{ color: '#fff' }}>{user.name}</strong>
                <span style={{ color: 'rgba(248,251,255,0.52)' }}> [{user.role}]</span>
              </span>
              <Btn size="sm" onClick={handleLogout} style={{ color: '#eef4ff', borderColor: 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)' }}>Logout</Btn>
            </>
          ) : (
            <Btn size="sm" onClick={() => navigate('/login')} style={{ color: '#eef4ff', borderColor: 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)' }}>Login</Btn>
          )}
        </div>
      </div>
    </header>
  );
}
