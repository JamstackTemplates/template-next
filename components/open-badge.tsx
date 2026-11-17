"use client";
import { useEffect, useState } from 'react';
import { openingLabel, type OpeningHours } from '../lib/hours';
import { site } from '../lib/site';

/** Optional. Neutral static output; browser refreshes in the business zone every minute. */
export function OpenBadge({ hours }: { hours: readonly OpeningHours[] }) {
  const [label, setLabel] = useState('See opening hours');
  useEffect(() => {
    const update = () => setLabel(openingLabel(hours, site.timeZone));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [hours]);
  return <span>{label}</span>;
}
