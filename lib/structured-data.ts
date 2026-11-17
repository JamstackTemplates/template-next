import { business } from '../content/business.ts';
import { absoluteUrl } from './paths.ts';

/** Replace Organization with the appropriate business schema when designing a template. */
export function businessStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: business.name, description: business.introduction, email: business.email,
    ...(business.phone ? { telephone: business.phone } : {}), ...(url ? { url } : {}),
  };
}

/** Prevent content containing a closing script tag from escaping JSON-LD. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
