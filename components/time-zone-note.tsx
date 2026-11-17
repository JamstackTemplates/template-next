import { site } from '../lib/site';
import { timeZoneLabel } from '../lib/time-zone';

/** "Times shown in Pacific Time" — so visitors elsewhere don't read the hours as their own local time. */
export function TimeZoneNote({ className = 'text-muted' }: { className?: string }) {
  const label = timeZoneLabel(site.timeZone);
  return label ? <p className={`mt-2.5 text-[.85rem] ${className}`}>Times shown in {label}</p> : null;
}
