export function normalizeLinkedInUrl(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return null;

  const candidate = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue.replace(/^\/+/, '')}`;

  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase();
    if (hostname !== 'linkedin.com' && !hostname.endsWith('.linkedin.com')) return null;

    return url.toString();
  } catch {
    return null;
  }
}
