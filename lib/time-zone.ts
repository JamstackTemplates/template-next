/**
 * Readable name for an IANA time zone, e.g. "America/Los_Angeles" → "Pacific Time".
 * Falls back to the city ("Kolkata time") when the locale has no generic name, and '' when unset.
 */
export function timeZoneLabel(zone: string, locale = 'en-US'): string {
  if (!zone) return '';
  try {
    const name = new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: 'longGeneric' })
      .formatToParts(new Date(Date.UTC(2026, 0, 15)))
      .find(part => part.type === 'timeZoneName')?.value ?? '';
    if (name && !/^GMT|^UTC[+-]/.test(name)) return name;
  } catch {
    return '';
  }
  if (zone === 'UTC' || zone.startsWith('Etc/')) return 'UTC';
  return `${zone.split('/').at(-1)!.replaceAll('_', ' ')} time`;
}
