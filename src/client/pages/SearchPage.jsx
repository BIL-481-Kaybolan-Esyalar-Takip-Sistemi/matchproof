import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Items } from '../api';
import { useToast } from '../context/ToastContext';
import { PageHeader, Field, Input, Select, Btn, Badge, Spinner, EmptyState, formatDate, CATEGORIES } from '../components/ui';

const DEFAULT_FILTERS = { query: '', category: '', itemType: '', status: '', dateFrom: '', dateTo: '', page: 1, pageSize: 10 };

export default function SearchPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchItems = useCallback(async (f) => {
    setLoading(true);
    try {
      const data = await Items.search(f);
      setResult(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchItems(filters); }, [filters, fetchItems]);

  const handleSearch = () => setFilters({ ...draft, page: 1 });
  const setPage = (p) => setFilters(f => ({ ...f, page: p }));
  const d = (key) => (e) => setDraft(f => ({ ...f, [key]: e.target.value }));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}>
      <PageHeader title="Lost & Found Board" subtitle="Browse and search campus item listings" action={<Btn variant="primary" onClick={() => navigate('/new')}>+ New Post</Btn>} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, marginBottom: 20 }}>
        <div style={{ flex: '1 1 160px' }}>
          <Field label="Search"><Input aria-label="Search" value={draft.query} onChange={d('query')} placeholder="keywords…" onKeyDown={e => e.key === 'Enter' && handleSearch()} /></Field>
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <Field label="Category">
            <Select aria-label="Category" value={draft.category} onChange={d('category')}>
              <option value="">All</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <Field label="Type">
            <Select aria-label="Type" value={draft.itemType} onChange={d('itemType')}>
              <option value="">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </Select>
          </Field>
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <Field label="Status">
            <Select aria-label="Status" value={draft.status} onChange={d('status')}>
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
            </Select>
          </Field>
        </div>
        <div style={{ flex: '1 1 110px' }}>
          <Field label="From"><Input aria-label="From" type="date" value={draft.dateFrom} onChange={d('dateFrom')} /></Field>
        </div>
        <div style={{ flex: '1 1 110px' }}>
          <Field label="To"><Input aria-label="To" type="date" value={draft.dateTo} onChange={d('dateTo')} /></Field>
        </div>
        <div style={{ marginBottom: 16 }}><Btn variant="primary" onClick={handleSearch}>Find</Btn></div>
      </div>
      {loading ? <Spinner /> : (
        <>
          {!result?.items?.length ? <EmptyState message="No items found." /> : (
            <div style={{ display: 'grid', gap: 10 }}>
              {result.items.map(item => <ItemCard key={item.id} item={item} onClick={() => navigate(`/items/${item.id}`)} />)}
            </div>
          )}
          {result && <Pagination pagination={result.pagination} onPage={setPage} />}
        </>
      )}
    </div>
  );
}

function ItemCard({ item, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div data-testid={`item-card-${item.id}`} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--surface)', border: `1px solid ${hover ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 2, padding: '16px 20px', cursor: 'pointer', boxShadow: hover ? '0 2px 8px rgba(0,0,0,0.08)' : 'var(--shadow)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start', transition: 'border-color 0.12s, box-shadow 0.12s' }}>
      <div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          <Badge value={item.itemType} /><Badge value={item.status} />{item.isPrivate && <Badge value="private" />}
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>{(item.description || '').slice(0, 120)}{item.description?.length > 120 ? '…' : ''}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>📁 {item.category}</span><span>📍 {item.location}</span><span>🗓 {formatDate(item.createdAt)}</span>
        </div>
      </div>
      {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 2, border: '1px solid var(--border)', filter: item.isPrivate ? 'blur(8px)' : 'none' }} />}
    </div>
  );
}

function Pagination({ pagination, onPage }) {
  const { page, totalPages, total } = pagination;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
      {totalPages > 1 && <Btn size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>← Prev</Btn>}
      <span style={{ color: 'var(--text-3)' }}>{totalPages > 1 ? `Page ${page} / ${totalPages} — ` : ''}{total} result{total !== 1 ? 's' : ''}</span>
      {totalPages > 1 && <Btn size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next →</Btn>}
    </div>
  );
}
