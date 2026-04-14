const SENSITIVE_IMAGE_CATEGORIES = new Set(['ID Card']);

function normalizeCategory(category) {
  return String(category || '').trim();
}

function isSensitiveImageCategory(category) {
  return SENSITIVE_IMAGE_CATEGORIES.has(normalizeCategory(category));
}

function resolvePrivacyFlag({ category, isPrivate }) {
  if (isSensitiveImageCategory(category)) {
    return true;
  }

  return Boolean(isPrivate);
}

module.exports = {
  isSensitiveImageCategory,
  resolvePrivacyFlag,
};
