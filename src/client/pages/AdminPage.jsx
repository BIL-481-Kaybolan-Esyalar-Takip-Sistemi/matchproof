import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Items, Moderation } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader, Badge, Btn, Modal, Field, Textarea, Spinner, EmptyState, Alert, MonoLabel, formatDate } from '../components/ui';

export default function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [reason, setReason] = useState('');

  const fetchItemsCallback = useCallback((p = 1) => {
    setLoading(true);
    Items.search({ page: p, pageSize: 20 })
      .then(data => { setItems(data.items); setPagination(data.pagination); })
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { fetchItemsCallback(page); }, [page, fetchItemsCallback]);

  const handleRemove = async () => {
    if (!reason.trim()) { showToast('Reason is required.', 'error'); return; }
    try {
      await Moderation.removePost(removeTarget.id, reason.trim());
      showToast('Post removed.');
      setRemoveTarget(null);
      fetchItemsCallback(page);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}>
        <Alert type="error">Access denied. Admin role required.</Alert>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}>
      <PageHeader title="Moderation Panel" subtitle="Admin — manage and remove posts" action={<Btn size="sm" onClick={() => fetchItemsCallback(page)}>↺ Refresh</Btn>} />
      <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderLeft: '4px solid var(--amber)', borderRadius: 2, padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#7a5c00', marginBottom: 20 }}>
        ⚠ Admin panel — actions here are permanent. Always provide a clear reason when removing posts.
      </div>
      {loading ? <Spinner /> : (
        <>
          {!items.length ? <EmptyState message="No items to moderate." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => (
                <ModerationCard key={item.id} item={item}
                  onView={() => navigate(`/items/${item.id}`)}
                  onRemove={() => { setReason(''); setRemoveTarget({ id: item.id, title: item.title }); }} />
              ))}
            </div>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              <Btn size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</Btn>
              <span style={{ color: 'var(--text-3)' }}>Page {page} / {pagination.totalPages}</span>
              <Btn size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next →</Btn>
            </div>
          )}
        </>
      )}
      <Modal open={Boolean(removeTarget)} onClose={() => setRemoveTarget(null)} title="Remove Post (Admin)">
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12 }}>Removing <strong>"{removeTarget?.title}"</strong>. Please provide a reason:</p>
        <Field label="Reason *">
          <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Duplicate post, inappropriate content…" />
        </Field>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <Btn onClick={() => setRemoveTarget(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={handleRemove}>Remove</Btn>
        </div>
      </Modal>
    </div>
  );
}

function ModerationCard({ item, onView, onRemove }) {
  return (
    <div data-testid={`moderation-card-${item.id}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      {item.imageUrl
        ? <img src={item.imageUrl} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 2, border: '1px solid var(--border)', flexShrink: 0 }} />
        : <div style={{ width: 56, height: 56, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 2, flexShrink: 0 }} />
      }
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <Badge value={item.itemType} /><Badge value={item.status} /><strong>{item.title}</strong>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>{(item.description || '').slice(0, 100)}…</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>📁 {item.category}</span><span>📍 {item.location}</span><span>🗓 {formatDate(item.createdAt)}</span><span>ID: {item.id}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <Btn size="sm" data-testid={`view-item-${item.id}`} onClick={onView}>View</Btn>
        {item.status !== 'removed' ? <Btn size="sm" variant="danger" data-testid={`remove-item-${item.id}`} onClick={onRemove}>Remove</Btn> : <Badge value="removed" />}
      </div>
    </div>
  );
}
