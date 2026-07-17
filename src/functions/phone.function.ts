export function normalizePhoneForSubmit(phone: string): string {
  const value = phone.trim();
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 9 && digits.startsWith('9')) return `+51${digits}`;
  if (value.startsWith('+')) return value;
  return `+${digits}`;
}
