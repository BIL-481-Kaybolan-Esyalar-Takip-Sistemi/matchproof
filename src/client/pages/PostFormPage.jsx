import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Items } from '../api';
import { useToast } from '../context/ToastContext';
import { PageHeader, Card, Field, Input, Select, Textarea, Btn, Alert, Spinner, CATEGORIES } from '../components/ui';

export default function PostFormPage() {
  const { itemId } = useParams();
  const isEdit = Boolean(itemId);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ itemType: 'lost', title: '', category: '', location: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    Items.get(itemId)
      .then(d => {
        const it = d.item;
        setForm({ itemType: it.itemType, title: it.title, category: it.category, location: it.location, description: it.description });
        setExistingImageUrl(it.imageUrl);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [itemId, isEdit]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.category) return setError('Category is required.');
    if (!form.location.trim()) return setError('Location is required.');
    if (!form.description.trim()) return setError('Description is required.');
    setSubmitting(true);
    try {
      if (isEdit) {
        const d = await Items.update(itemId, form, imageFile);
        showToast('Post updated!');
        navigate(`/items/${d.item.id}`);
      } else {
        const d = await Items.create(form, imageFile);
        showToast('Post created!');
        navigate(`/items/${d.item.id}`);
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}><Spinner /></div>;

  const shownPreview = previewUrl || existingImageUrl;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}>
      <PageHeader title={isEdit ? 'Edit Post' : 'New Post'} />
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Card>
          <div style={{ padding: 24 }}>
            <form onSubmit={handleSubmit}>
              {error && <Alert type="error">{error}</Alert>}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Post Type *</div>
                <div style={{ display: 'flex', gap: 20 }}>
                  {['lost', 'found'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      <input type="radio" name="itemType" value={t} checked={form.itemType === t} onChange={() => setForm(f => ({ ...f, itemType: t }))} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <Field label="Title *"><Input aria-label="Title" value={form.title} onChange={set('title')} placeholder="e.g. Black leather wallet" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Category *">
                  <Select aria-label="Category" value={form.category} onChange={set('category')}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Location *"><Input aria-label="Location" value={form.location} onChange={set('location')} placeholder="e.g. Library, Floor 2" /></Field>
              </div>
              <Field label="Description *"><Textarea aria-label="Description" value={form.description} onChange={set('description')} placeholder="Describe the item in detail…" /></Field>
              <Field label="Photo">
                <div onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed var(--border-dark)', borderRadius: 2, padding: 24, textAlign: 'center', cursor: 'pointer', background: 'var(--surface-2)' }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  {shownPreview
                    ? <><img src={shownPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 2, border: '1px solid var(--border)', marginBottom: 8 }} /><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}><strong style={{ color: 'var(--text)' }}>Click to change photo</strong></div></>
                    : <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}><strong style={{ color: 'var(--text)' }}>Click to upload</strong> or drag & drop<br />PNG, JPG, WEBP up to 5MB</div>
                  }
                </div>
              </Field>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <Btn type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Post'}</Btn>
                <Btn type="button" onClick={() => isEdit ? navigate(`/items/${itemId}`) : navigate('/')}>Cancel</Btn>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
