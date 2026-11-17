import { business } from '../content/business';
import { SiteLink } from './site-link';

export function SiteFooter() {
  return <footer className="mt-16 border-t border-line py-8">
    <div className="wrap flex flex-wrap justify-between gap-6 text-sm text-muted">
      <p>{business.name} · <SiteLink href="/contact/">Contact</SiteLink></p>
      <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-accent-ink hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
    </div>
  </footer>;
}
