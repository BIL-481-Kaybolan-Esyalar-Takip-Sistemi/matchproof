const SENSITIVE_IMAGE_CATEGORIES = new Set(['ID Card']);

export function isSensitiveImageCategory(category) {
  return SENSITIVE_IMAGE_CATEGORIES.has(String(category || '').trim());
}

export function shouldBlurItemImage(item, viewer) {
  if (!item?.isPrivate) {
    return false;
  }

  const isAdmin = viewer?.role === 'admin';
  const isOwner = viewer && String(item.ownerId) === String(viewer.id);

  return !isAdmin && !isOwner;
}

