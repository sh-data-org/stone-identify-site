import settings from '../../../content/acquisition.json';

export const acquisition = settings;
export type AppPlatform = 'ios' | 'android';
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

export function appClickPlacement(destination: URL, placement?: string): string | null {
  // Visiting the store chooser is not an outbound store click.
  if (!appPlatform(destination)) return null;
  const value = placement ?? destination.searchParams.get('placement') ?? 'article';
  return appPlacements.find((candidate) => candidate === value) ?? 'article';
}

export function googlePlayUrl(): string {
  const url = new URL('https://play.google.com/store/apps/details');
  url.searchParams.set('id', settings.androidPackage);
  url.searchParams.set(
    'referrer',
    new URLSearchParams({
      utm_source: 'stoneidentify.app',
      utm_medium: 'website',
      utm_campaign: settings.campaign,
    }).toString(),
  );
  return url.href;
}

export function appPlatform(destination: URL): AppPlatform | null {
  if (destination.protocol !== 'https:') return null;
  if (
    destination.hostname === 'apps.apple.com' &&
    destination.pathname.split('/').includes(`id${settings.appId}`)
  )
    return 'ios';
  if (
    destination.hostname === 'play.google.com' &&
    destination.pathname === '/store/apps/details' &&
    destination.searchParams.get('id') === settings.androidPackage
  )
    return 'android';
  return null;
}

export function devicePlatform(userAgent: string, maxTouchPoints = 0): AppPlatform | null {
  if (/android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  // iPadOS can use a desktop Mac user agent.
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'ios';
  return null;
}

export function deviceStoreUrl(userAgent: string, maxTouchPoints = 0): string | null {
  const platform = devicePlatform(userAgent, maxTouchPoints);
  if (platform === 'ios') return appStoreUrl();
  if (platform === 'android') return googlePlayUrl();
  return null;
}
