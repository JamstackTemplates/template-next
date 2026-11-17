import { SiteLink } from '../components/site-link';
export default function NotFound() {
  return <section className="wrap py-20"><h1 className="text-4xl font-bold">Page not found</h1>
    <p className="my-6 text-muted">Try the home page or get in touch.</p>
    <SiteLink href="/" className="button">Go home</SiteLink></section>;
}
