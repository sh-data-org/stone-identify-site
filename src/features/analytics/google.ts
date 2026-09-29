export function googleMeasurementId(
  env: { GA_MEASUREMENT_ID?: string; SITE_URL?: string; LAUNCH_READY?: string },
  url: URL,
  admin: boolean,
): string | null {
  if (admin || env.LAUNCH_READY !== 'true' || url.protocol !== 'https:') return null;
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return null;
  if (!env.GA_MEASUREMENT_ID || !/^G-[A-Z0-9]{6,20}$/.test(env.GA_MEASUREMENT_ID)) return null;
  try {
    return new URL(env.SITE_URL ?? '').origin === url.origin ? env.GA_MEASUREMENT_ID : null;
  } catch {
    return null;
  }
}
export function analyticsReferrer(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return '';
  }
}
