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
      <Link to={to} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: active ? '#fff' : '#aaa', textDecoration: 'none', padding: '6px 12px', borderRadius: 2, cursor: 'pointer', background: active ? '#333' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.15s, background 0.15s' }}>
        {label}
      </Link>
    );
  };

  return (
    <header style={{ background: 'var(--accent)', color: 'var(--accent-inv)', borderBottom: '2px solid #000', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 52, gap: 0 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.5px', color: 'var(--accent-inv)', textDecoration: 'none', paddingRight: 24, borderRight: '1px solid #444', marginRight: 16 }}>
          Match<span style={{ color: '#aaa', fontWeight: 400 }}>Proof</span>
        </Link>
        {user && (
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {navLink('/', 'Browse')}
            {navLink('/new', '+ New Post')}
            {user.role === 'admin' && navLink('/admin', 'Admin')}
          </div>
        )}
        {!user && <div style={{ flex: 1 }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#888' }}>
                <strong style={{ color: '#ddd' }}>{user.name}</strong>
                <span style={{ color: '#555' }}> [{user.role}]</span>
              </span>
              <Btn size="sm" onClick={handleLogout} style={{ color: '#ccc', borderColor: '#444', background: 'transparent' }}>Logout</Btn>
            </>
          ) : (
            <Btn size="sm" onClick={() => navigate('/login')} style={{ color: '#ccc', borderColor: '#444', background: 'transparent' }}>Login</Btn>
          )}
        </div>
      </div>
    </header>
  );
}
