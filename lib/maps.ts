// Google Maps links and embed. None of these need an API key or account:
// - search/directions links use Google's documented Maps URLs (https://developers.google.com/maps/documentation/urls);
// - the embed uses Google's keyless map embed, in the form google.com/maps?q=…&output=embed redirects to
//   (linking it directly saves visitors a redirect). For the officially supported Maps Embed API,
//   create a free browser key restricted to your domain and swap `mapEmbedUrl` for
//   `https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=...`.

export function mapEmbedUrl(query: string, zoom = 16): string {
  // `!` separates fields in the pb parameter, so it must be escaped inside the query.
  const place = encodeURIComponent(query).replace(/%20/g, '+').replace(/!/g, '%21');
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${place}!6i${zoom}`;
}

export function mapSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
