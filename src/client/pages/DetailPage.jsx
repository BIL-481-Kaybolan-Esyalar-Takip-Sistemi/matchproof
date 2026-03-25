import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Items, Moderation } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge, Btn, Card, Spinner, Alert, Modal, MonoLabel, Divider, Field, Textarea, formatDate } from '../components/ui';

export default function DetailPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeReason, setRemoveReason] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Items.get(itemId)
      .then(d => setItem(d.item))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [itemId]);

  const handleStatus = async (status) => {
    try {
      const d = await Items.updateStatus(item.id, status);
      setItem(d.item);
      showToast(`Status updated to "${status}"`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await Items.delete(item.id);
      showToast('Post deleted.');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAdminRemove = async () => {
    if (!removeReason.trim()) { showToast('Reason is required.', 'error'); return; }
    try {
      await Moderation.removePost(item.id, removeReason.trim());
      showToast('Post removed by admin.');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}><Spinner /></div>;
  if (error) return <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}><Alert type="error">{error}</Alert></div>;
  if (!item) return null;

  const isOwner = user && String(item.ownerId) === String(user.id);
  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}>
      <div style={{ marginBottom: 16 }}>
        <Btn size="sm" onClick={() => navigate('/')}>← Back to Listings</Btn>
      </div>
      <Card>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <Badge value={item.itemType} /><Badge value={item.status} />
            <h1 style={{ margin: 0 }}>{item.title}</h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, alignItems: 'start' }}>
            <div>
              {item.imageUrl
                ? <img src={item.imageUrl} alt="Item" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 2, border: '1px solid var(--border)', marginBottom: 20 }} />
                : <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 20 }}>No photo uploaded</div>
              }
              <div style={{ marginBottom: 16 }}><MonoLabel>Description</MonoLabel><div style={{ fontSize: 14 }}>{item.description}</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div><MonoLabel>Category</MonoLabel><div style={{ fontSize: 14 }}>{item.category}</div></div>
                <div><MonoLabel>Location</MonoLabel><div style={{ fontSize: 14 }}>{item.location}</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><MonoLabel>Posted</MonoLabel><div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{formatDate(item.createdAt)}</div></div>
                <div><MonoLabel>Updated</MonoLabel><div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{formatDate(item.updatedAt)}</div></div>
              </div>
            </div>
            <div>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 2, padding: 16, marginBottom: 12 }}>
                <MonoLabel>Owner Contact</MonoLabel>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{item.ownerContact?.name || '—'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{item.ownerContact?.email || '—'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {isOwner && item.status === 'open' && <Btn variant="primary" onClick={() => handleStatus('claimed')}>Mark as Claimed</Btn>}
                {isOwner && item.status === 'claimed' && <Btn variant="primary" onClick={() => handleStatus('resolved')}>Mark as Resolved</Btn>}
                {isOwner && item.status !== 'removed' && (
                  <>
                    <Btn onClick={() => navigate(`/items/${item.id}/edit`)}>Edit Post</Btn>
                    <Btn variant="danger" onClick={() => setDeleteOpen(true)}>Delete Post</Btn>
                  </>
                )}
                {isAdmin && item.status !== 'removed' && (
                  <>
                    <Divider />
                    <MonoLabel>Admin</MonoLabel>
                    <Btn variant="danger" onClick={() => { setRemoveReason(''); setRemoveOpen(true); }}>Remove Post</Btn>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Post">
        <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Are you sure you want to delete <strong>"{item.title}"</strong>? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <Btn onClick={() => setDeleteOpen(false)}>Cancel</Btn>
          <Btn variant="danger" onClick={handleDelete}>Delete</Btn>
        </div>
      </Modal>

      <Modal open={removeOpen} onClose={() => setRemoveOpen(false)} title="Remove Post (Admin)">
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12 }}>Removing <strong>"{item.title}"</strong>. Please provide a reason:</p>
        <Field label="Reason *">
          <Textarea value={removeReason} onChange={e => setRemoveReason(e.target.value)} placeholder="e.g. Duplicate post, inappropriate content…" />
        </Field>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <Btn onClick={() => setRemoveOpen(false)}>Cancel</Btn>
          <Btn variant="danger" onClick={handleAdminRemove}>Remove</Btn>
        </div>
      </Modal>
    </div>
  );
}
