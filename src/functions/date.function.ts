/**
 * Formats a given date string or object into a string suitable for <input type="datetime-local">.
 * Ensures the date is formatted in the local timezone: yyyy-MM-ddThh:mm
 */
export function formatDateForDatetimeLocal(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';

  const d = new Date(dateInput);
  // Check for invalid date
  if (isNaN(d.getTime())) return '';

  const pad = (n: number) => (n < 10 ? '0' + n : n);

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/**
 * Ensures a date used for query parameters covers the full local day in UTC.
 * @param dateStr Date string in YYYY-MM-DD format (local date)
 * @param type 'start' for 00:00:00, 'end' for 23:59:59
 * @returns ISO string with local timezone offset applied
 */
export function formatQueryDate(dateStr: string, type: 'start' | 'end'): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00'); // Treat as local start of day
  if (type === 'end') {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  // Return ISO string which is UTC, effectively shifting the local start/end to UTC
  return d.toISOString();
}

/**
 * Formats a Date object to YYYY-MM-DD string using local timezone.
 * Useful for initializing <input type="date"> values.
 */
export function formatDateInput(date: Date): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}
