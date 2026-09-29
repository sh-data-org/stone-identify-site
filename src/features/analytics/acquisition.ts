import settings from '../../../content/acquisition.json';

export const acquisition = settings;
export const appPlacements = [
  'header',
  'hero',
  'article',
  'footer',
  'qr',
  'sticky',
  'sidebar',
  'article-top',
] as const;

export function appStoreUrl(
  providerToken = settings.providerToken,
  appId = settings.appId,
): string {
  if (!/^\d+$/.test(appId)) throw new Error('App Store ID must be numeric.');
  if (providerToken && !/^\d+$/.test(providerToken)) {
    throw new Error('App Store provider token must be numeric.');
  }
  const url = new URL(`https://apps.apple.com/us/app/id${appId}`);
  if (providerToken) {
    url.searchParams.set('pt', providerToken);
    url.searchParams.set('ct', settings.campaign);
    url.searchParams.set('mt', '8');
  }
  return url.href;
}

export function appClickPlacement(
  destination: URL,
  origin: string,
  placement?: string,
): string | null {
  const internal = destination.origin === origin && destination.pathname === '/go';
  const external =
    destination.protocol === 'https:' &&
    destination.hostname === 'apps.apple.com' &&
    destination.pathname.split('/').includes(`id${settings.appId}`);
  if (!internal && !external) return null;
  const value = placement ?? destination.searchParams.get('placement') ?? 'article';
  return appPlacements.find((candidate) => candidate === value) ?? 'article';
}
