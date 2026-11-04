import { deviceStoreUrl } from './acquisition';

export function setupDownloadRouting() {
  const destination = deviceStoreUrl(navigator.userAgent, navigator.maxTouchPoints);
  if (!destination) return;
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href="/go/"]')) {
    link.href = destination;
  }
  if (document.getElementById('store-redirect')) {
    // The destination is selected from fixed store URLs, never from query parameters.
    location.replace(destination);
  }
}
