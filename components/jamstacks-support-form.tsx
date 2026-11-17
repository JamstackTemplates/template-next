'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { nextEmbedStatus, type EmbedStatus } from '../lib/embed-status';

type Props = {
  /** Public Jamstacks website ID. */
  siteId: string;
  /** The site bootstrap: {cdn}/sites/{siteId}/embed.js */
  embedUrl: string;
  /** Public alternative contact address, always offered beside the hosted form. */
  email: string;
};

const POLL_MS = 100;
const SLOW_AFTER_MS = 12_000;

/**
 * Host and loader for the hosted Jamstacks contact form.
 *
 * - Emits the real <jamstacks-support-form> tag with the data attributes the current shared
 *   runtime uses for discovery. The template never registers the element or renders a substitute form.
 * - The runtime attaches a shadow root and owns everything inside the host, including validation,
 *   anti-spam, submission and success/error messages. React renders no children into it.
 * - Status text here reflects only what the page can observe: the bootstrap loading, failing, or
 *   the host receiving content. It never reports that a message was delivered.
 */
export function JamstacksSupportForm({ siteId, embedUrl, email }: Props) {
  const host = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<EmbedStatus>('loading');

  useEffect(() => {
    // Keep watching while slow, so a late form still clears the notice.
    if (status === 'present' || status === 'error') return;
    const started = performance.now();
    const observe = () => {
      const element = host.current;
      setStatus(current => nextEmbedStatus(current, {
        hostHasContent: !!element && (!!element.shadowRoot || element.childNodes.length > 0),
        elapsedMs: performance.now() - started,
        slowAfterMs: SLOW_AFTER_MS,
      }));
    };
    // The runtime exposes no ready event, so observe the host itself: an attached shadow root
    // (or the bootstrap's own fallback text) means the hosted component now owns this space.
    observe();
    const timer = setInterval(observe, POLL_MS);
    return () => clearInterval(timer);
  }, [status]);

  const mail = <a className="text-link" href={`mailto:${email}`}>{email}</a>;

  return (
    <div className="enquiry" data-state={status}>
      {/* Owned by the Jamstacks runtime once its bootstrap runs. Keep React children out of it. */}
      <jamstacks-support-form
        ref={host}
        className="enquiry__host"
        data-jamstacks-component="support-form"
        data-jamstacks-site={siteId}
      />

      <p className="enquiry__status" role="status" aria-live="polite">
        {status === 'loading' || status === 'loaded' ? 'Loading the enquiry form…'
          : status === 'slow' ? <>The form is taking longer than usual to appear. You can also email {mail}.</>
          : status === 'error' ? <>The enquiry form couldn’t be loaded just now. Please email {mail} instead — it reaches us just the same.</>
          : null}
      </p>

      <noscript>
        <p className="enquiry__status">The enquiry form needs JavaScript. Please email {mail} instead.</p>
      </noscript>

      <Script
        id="jamstacks-site-bootstrap"
        src={embedUrl}
        strategy="afterInteractive"
        onLoad={() => setStatus(current => nextEmbedStatus(current, { scriptLoaded: true }))}
        onError={() => setStatus(current => nextEmbedStatus(current, { scriptFailed: true }))}
      />
    </div>
  );
}
