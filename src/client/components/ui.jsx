export const CATEGORIES = [
  'Electronics', 'Books & Notes', 'Keys', 'ID Card', 'Clothing',
  'Bag & Backpack', 'Wallet', 'Glasses', 'Jewelry', 'Sports Equipment',
  'Stationery', 'Other',
];

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const badgeColors = {
  lost:     { color: 'var(--red)',    border: 'var(--red)',         bg: '#fdf0ef' },
  found:    { color: 'var(--green)',  border: 'var(--green)',       bg: '#edf7f1' },
  open:     { color: 'var(--blue)',   border: 'var(--blue)',        bg: '#edf2fb' },
  claimed:  { color: 'var(--amber)',  border: 'var(--amber)',       bg: '#fdf8ec' },
  resolved: { color: 'var(--text-3)', border: 'var(--border-dark)', bg: 'var(--surface-2)' },
  removed:  { color: 'var(--red)',    border: 'var(--red)',         bg: '#fdf0ef' },
};

export function Badge({ value }) {
  const c = badgeColors[value] || badgeColors.open;
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 10,
      fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 2, border: `1px solid ${c.border}`,
      color: c.color, background: c.bg,
    }}>{value}</span>
  );
}

export function Btn({ children, onClick, variant = 'default', size = 'md', disabled, type = 'button', style: sx, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--font-mono)', fontSize: size === 'sm' ? 12 : 13,
    fontWeight: 500, padding: size === 'sm' ? '5px 10px' : '8px 16px',
    border: '1px solid var(--border-dark)', borderRadius: 2,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
    transition: 'all 0.12s', letterSpacing: '0.2px',
  };
  const variants = {
    default: { background: 'var(--surface)', color: 'var(--text)' },
    primary: { background: 'var(--accent)', color: 'var(--accent-inv)', borderColor: 'var(--accent)' },
    danger:  { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...sx }} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-2)', marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      {children}
      {error && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{error}</div>}
    </div>
  );
}

const controlStyle = { display: 'block', width: '100%', padding: '9px 12px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border-dark)', borderRadius: 2, outline: 'none' };

export function Input({ ...props }) { return <input style={controlStyle} {...props} />; }
export function Textarea({ ...props }) { return <textarea style={{ ...controlStyle, resize: 'vertical', minHeight: 90 }} {...props} />; }
export function Select({ children, ...props }) {
  return (
    <select style={{ ...controlStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23666'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }} {...props}>
      {children}
    </select>
  );
}

export function Card({ children, style: sx }) {
  return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, boxShadow: 'var(--shadow)', ...sx }}>{children}</div>;
}

export function Alert({ children, type = 'error' }) {
  const t = { error: { bg: '#fdf0ef', color: 'var(--red)', border: '#f5c6c2' }, success: { bg: '#edf7f1', color: 'var(--green)', border: '#b8ddc8' }, info: { bg: '#edf2fb', color: 'var(--blue)', border: '#b8cce8' } }[type];
  return <div style={{ padding: '12px 16px', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 13, border: `1px solid ${t.border}`, background: t.bg, color: t.color, marginBottom: 16 }}>{children}</div>;
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13, gap: 10 }}>
      <div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Loading…
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 440, padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ padding: '28px 0 20px', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1>{title}</h1>
          {subtitle && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function EmptyState({ message }) {
  return <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{message}</div>;
}

export function MonoLabel({ children }) {
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-3)', marginBottom: 3 }}>{children}</div>;
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />;
}
