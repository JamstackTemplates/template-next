import { DarkModeToggle } from 'jamstacks';
import { business } from '../content/business';
import { SiteLink } from './site-link';

export function SiteHeader() {
  return <header className="border-b border-line bg-surface">
    <div className="wrap flex min-h-20 items-center justify-between gap-3">
      <SiteLink href="/" className="max-w-40 text-lg font-bold leading-tight no-underline">{business.name}</SiteLink>
      <nav aria-label="Main" className="flex items-center gap-4">
        <SiteLink href="/" markCurrent="page">Home</SiteLink>
        <SiteLink href="/contact/" markCurrent="page">Contact</SiteLink>
        <DarkModeToggle />
      </nav>
    </div>
  </header>;
}
