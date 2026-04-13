import { useState } from 'react';

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
      padding: '4px 8px', borderRadius: 999, border: `1px solid ${c.border}`,
      color: c.color, background: c.bg,
    }}>{value}</span>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled,
  type = 'button',
  style: sx,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--font-mono)', fontSize: size === 'sm' ? 12 : 13,
    fontWeight: 500, padding: size === 'sm' ? '7px 12px' : '10px 16px',
    border: '1px solid var(--border-dark)', borderRadius: 999,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
    transition: 'transform 0.14s ease, box-shadow 0.14s ease, background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease',
    letterSpacing: '0.2px',
    boxShadow: hovered && !disabled ? '0 10px 22px rgba(20, 32, 51, 0.12)' : '0 2px 6px rgba(20, 32, 51, 0.06)',
    transform: pressed && !disabled ? 'translateY(1px)' : hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
  };
  const variants = {
    default: { background: hovered ? 'var(--surface-2)' : 'var(--surface)', color: 'var(--text)' },
    primary: { background: hovered ? 'var(--accent-soft)' : 'var(--accent)', color: 'var(--accent-inv)', borderColor: hovered ? 'var(--accent-soft)' : 'var(--accent)' },
    danger:  { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(event) => { setHovered(true); onMouseEnter?.(event); }}
      onMouseLeave={(event) => { setHovered(false); setPressed(false); onMouseLeave?.(event); }}
      onMouseDown={(event) => { setPressed(true); onMouseDown?.(event); }}
      onMouseUp={(event) => { setPressed(false); onMouseUp?.(event); }}
      style={{ ...base, ...variants[variant], ...sx }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>{label}</label>}
      {children}
      {error && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{error}</div>}
    </div>
  );
}

const controlStyle = {
  display: 'block',
  width: '100%',
  padding: '11px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: 'var(--text)',
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid var(--border-dark)',
  borderRadius: 14,
  outline: 'none',
  transition: 'border-color 0.14s ease, box-shadow 0.14s ease, background-color 0.14s ease',
};

export function Input({ style: sx, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{
        ...controlStyle,
        borderColor: focused ? 'var(--blue)' : 'var(--border-dark)',
        boxShadow: focused ? '0 0 0 4px var(--focus-ring)' : 'none',
        ...sx,
      }}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      {...props}
    />
  );
}

export function Textarea({ style: sx, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      style={{
        ...controlStyle,
        resize: 'vertical',
        minHeight: 96,
        borderColor: focused ? 'var(--blue)' : 'var(--border-dark)',
        boxShadow: focused ? '0 0 0 4px var(--focus-ring)' : 'none',
        ...sx,
      }}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      {...props}
    />
  );
}

export function Select({ children, style: sx, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      style={{
        ...controlStyle,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23666'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: 38,
        borderColor: focused ? 'var(--blue)' : 'var(--border-dark)',
        boxShadow: focused ? '0 0 0 4px var(--focus-ring)' : 'none',
        ...sx,
      }}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Card({ children, style: sx }) {
  return <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', borderRadius: 18, boxShadow: 'var(--shadow)', backdropFilter: 'blur(8px)', ...sx }}>{children}</div>;
}

export function Alert({ children, type = 'error' }) {
  const t = { error: { bg: '#fdf0ef', color: 'var(--red)', border: '#f5c6c2' }, success: { bg: '#edf7f1', color: 'var(--green)', border: '#b8ddc8' }, info: { bg: '#edf2fb', color: 'var(--blue)', border: '#b8cce8' } }[type];
  return <div style={{ padding: '13px 16px', borderRadius: 14, fontFamily: 'var(--font-mono)', fontSize: 13, border: `1px solid ${t.border}`, borderLeft: `4px solid ${t.color}`, background: t.bg, color: t.color, marginBottom: 16, boxShadow: '0 8px 18px rgba(20, 32, 51, 0.05)' }}>{children}</div>;
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
      <div style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 440, padding: 24, backdropFilter: 'blur(12px)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ padding: '20px 22px', border: '1px solid var(--border)', borderRadius: 18, marginBottom: 24, background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,247,251,0.92))', boxShadow: 'var(--shadow)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ width: 52, height: 4, background: 'linear-gradient(90deg, var(--blue), var(--green))', borderRadius: 999, marginBottom: 12 }} />
          <h1>{title}</h1>
          {subtitle && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function EmptyState({ message }) {
  return <div style={{ textAlign: 'center', padding: '72px 24px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13, background: 'rgba(255,255,255,0.76)', border: '1px dashed var(--border-dark)', borderRadius: 18 }}>{message}</div>;
}

export function MonoLabel({ children }) {
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-3)', marginBottom: 3 }}>{children}</div>;
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />;
}
