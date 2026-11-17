import { mapEmbedUrl } from '../lib/maps';

/** Optional location component. Pass the formatted address from content; never embed a secret key. */
export function GoogleMap({ address, title, className = '' }: {
  address: string; title: string; className?: string;
}) {
  return <div className={`map ${className}`}><iframe src={mapEmbedUrl(address)} title={title}
    loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>;
}
