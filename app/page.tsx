import type { Metadata } from 'next';
import { business } from '../content/business';
import { SiteLink } from '../components/site-link';
import { absoluteUrl } from '../lib/paths';
import { businessStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = { alternates: { canonical: absoluteUrl('/') } };

export default function HomePage() {
  return <section className="wrap py-20">
    <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">{business.tagline}</h1>
    <p className="mt-6 max-w-2xl text-lg text-muted">{business.introduction}</p>
    <SiteLink href="/contact/" className="button mt-8">{business.enquiries.title}</SiteLink>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessStructuredData()) }} />
  </section>;
}
