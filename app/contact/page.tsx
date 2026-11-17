import type { Metadata } from 'next';
import { business } from '../../content/business';
import { CopyEmail } from '../../components/copy-email';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = { title: 'Contact', description: business.enquiries.introduction,
  alternates: { canonical: absoluteUrl('/contact/') } };

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return <>
    <PageHead eyebrow="Contact" title={business.enquiries.title}><p>{business.enquiries.introduction}</p></PageHead>
    <div className="wrap grid gap-10 pb-12 md:grid-cols-2">
      <section aria-label="Enquiry form">
        {hosted ? <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={business.email} />
          : <div className="rounded-ui border border-line bg-surface p-6">
            <h2 className="text-xl font-bold">Write to us directly</h2>
            <p className="mt-3 text-muted">The enquiry form is not connected. Please use the email address alongside.</p>
          </div>}
      </section>
      <aside aria-label="Contact details" className="grid content-start gap-4">
        <h2 className="text-xl font-bold">Email</h2>
        <a className="text-link wrap-anywhere" href={`mailto:${business.email}`}>{business.email}</a>
        <div className="flex flex-wrap items-center gap-3"><CopyEmail email={business.email} /></div>
        {business.phone ? <p><a className="text-link" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>{business.phone}</a></p> : null}
        <h2 className="mt-3 text-xl font-bold">Useful to include</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted">{business.enquiries.usefulToInclude.map(tip => <li key={tip}>{tip}</li>)}</ul>
      </aside>
    </div>
  </>;
}
