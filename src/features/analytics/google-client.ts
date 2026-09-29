import { analyticsReferrer } from './google';
import { acquisition, appClickPlacement } from './acquisition';
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
const preferenceKey = 'stone-analytics-consent';
export function setupGoogleAnalytics(container: HTMLElement) {
  if (location.origin !== acquisition.siteUrl) {
    container.hidden = true;
    return;
  }
  const measurementId = container.dataset.measurementId;
  const panel = container.querySelector<HTMLElement>('[data-analytics-panel]');
  const status = container.querySelector<HTMLElement>('[role="status"]');
  if (!measurementId || !panel) return;
  let allowed = false;
  let started = false;
  window.dataLayer = window.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // Keep Google's documented gtag command format (an Arguments object).
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  function start() {
    if (started) return;
    started = true;
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_location: location.origin + location.pathname,
      page_referrer: analyticsReferrer(document.referrer),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onerror = () => {
      if (status) status.textContent = 'Google Analytics could not load. The website still works.';
    };
    document.head.appendChild(script);
  }
  function choose(value: 'granted' | 'denied') {
    allowed = value === 'granted';
    Reflect.set(window, `ga-disable-${measurementId}`, !allowed);
    let persisted = false;
    try {
      localStorage.setItem(preferenceKey, value);
      persisted = true;
    } catch {
      if (status)
        status.textContent = 'Your browser could not save this preference for your next visit.';
    }
    if (allowed) start();
    else if (started) {
      gtag('consent', 'update', { analytics_storage: 'denied' });
      // A reload removes the loaded tag as well as our event listeners after withdrawal.
      if (persisted) location.reload();
    }
    if (panel) panel.hidden = true;
  }
  container
    .querySelector('[data-analytics-accept]')
    ?.addEventListener('click', () => choose('granted'));
  container
    .querySelector('[data-analytics-reject]')
    ?.addEventListener('click', () => choose('denied'));
  container.querySelector('[data-analytics-settings]')?.addEventListener('click', () => {
    panel.hidden = false;
    panel.querySelector<HTMLButtonElement>('button')?.focus();
  });
  document.addEventListener('click', (event) => {
    if (!allowed || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    const destination = new URL(link.href);
    const placement = appClickPlacement(destination, location.origin, link.dataset.appPlacement);
    if (!placement) return;
    gtag('event', 'app_store_click', {
      page_path: location.pathname,
      button_placement: placement,
      app_campaign: acquisition.campaign,
      transport_type: 'beacon',
    });
  });
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (saved === 'granted') {
      allowed = true;
      start();
    }
    panel.hidden = saved === 'granted' || saved === 'denied';
  } catch {
    panel.hidden = false;
  }
}
