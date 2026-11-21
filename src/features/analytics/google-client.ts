import { socialCampaignParameters } from './social-campaign';
import { clickInteraction } from './interaction';
import { analyticsReferrer } from './google';
import { acquisition, appClickPlacement, appPlatform } from './acquisition';
import { downloadArticleContext, downloadContextKey } from './article-context';
import {
  aiCampaignParameters,
  aiReferralKey,
  aiReferralParameters,
  resolveAiReferral,
  type AiReferral,
} from './ai-referral';
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
const pageNames = new Map([
  ['/', 'Home – Rock Identification'],
  ['/jewelry/', 'Jewelry – Guide Directory'],
  ['/apps/', 'Apps – Guide Directory'],
  ['/404', 'Page Not Found'],
]);
const preferenceKey = 'stone-analytics-consent';
export function setupGoogleAnalytics(container: HTMLElement) {
  if (location.origin !== acquisition.siteUrl) {
    container.hidden = true;
    return;
  }
  const measurementId = container.dataset.measurementId;
  const panel = container.querySelector<HTMLElement>('[data-analytics-panel]');
  const status = container.querySelector<HTMLElement>('[role="status"]');
  const article = document.querySelector<HTMLElement>('article[data-article-id]');
  const articleContext = article
    ? { article_id: article.dataset.articleId, article_cluster: article.dataset.articleCluster }
    : {};
  if (!measurementId || !panel) return;
  const pathList = document.querySelector<HTMLMetaElement>('meta[name="stone-public-paths"]');
  const publicPaths = new Set(pathList?.content.split(' '));
  const currentUrl = new URL(location.href);
  const pagePath = publicPaths.has(currentUrl.pathname) ? currentUrl.pathname : '/404';
  const pageUrl = new URL(pagePath, currentUrl.origin);
  pageUrl.search = currentUrl.search;
  let allowed = false;
  let started = false;
  let aiReferral: AiReferral | null = null;
  window.dataLayer = window.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // Keep Google's documented gtag command format (an Arguments object).
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  function pageParameters() {
    return {
      ...articleContext,
      ...aiReferralParameters(aiReferral),
      page_path: pagePath,
      page_title: pageNames.get(pagePath) ?? document.title,
      page_location: currentUrl.origin + pagePath,
      page_referrer: analyticsReferrer(document.referrer, currentUrl.origin, publicPaths),
    };
  }
  function pageView() {
    gtag('event', 'page_view', pageParameters());
  }
  function start() {
    if (started) return;
    started = true;
    let storedReferral = null;
    try {
      storedReferral = sessionStorage.getItem(aiReferralKey);
    } catch {
      if (status) status.textContent = 'Your browser could not read referral attribution.';
    }
    aiReferral = resolveAiReferral(pageUrl, document.referrer, storedReferral);
    try {
      if (aiReferral) sessionStorage.setItem(aiReferralKey, JSON.stringify(aiReferral));
      else sessionStorage.removeItem(aiReferralKey);
    } catch {
      if (status) status.textContent = 'Your browser could not preserve referral attribution.';
    }
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    gtag('js', new Date());
    gtag('config', measurementId, {
      ...pageParameters(),
      ...aiCampaignParameters(pageUrl, document.referrer),
      ...socialCampaignParameters(pageUrl),
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    pageView();
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
    else {
      aiReferral = null;
      try {
        sessionStorage.removeItem(downloadContextKey);
        sessionStorage.removeItem(aiReferralKey);
      } catch {
        if (status) status.textContent = 'Your browser could not clear saved visit attribution.';
      }
    }
    if (!allowed && started) {
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
  function trackClick(event: MouseEvent) {
    if (!allowed || event.button > 1 || !(event.target instanceof Element)) return;
    const interaction = clickInteraction(event.target, currentUrl, publicPaths);
    if (!interaction) return;
    const { link, destination, parameters } = interaction;
    const placement = destination && appClickPlacement(destination, link?.dataset.appPlacement);
    if (!placement) {
      gtag('event', 'site_click', {
        ...pageParameters(),
        ...parameters,
        transport_type: 'beacon',
      });
    }
    if (!destination) return;
    if (destination.origin === location.origin && destination.pathname === '/go/') {
      try {
        // Only retain public article metadata after consent and an explicit chooser click.
        if (articleContext.article_id && articleContext.article_cluster) {
          sessionStorage.setItem(
            downloadContextKey,
            JSON.stringify({
              ...articleContext,
              source_page_path: location.pathname,
              createdAt: Date.now(),
            }),
          );
        } else sessionStorage.removeItem(downloadContextKey);
      } catch {
        if (status) status.textContent = 'Your browser could not preserve article attribution.';
      }
      return;
    }
    if (!placement) return;
    let sourceContext = null;
    if (location.pathname === '/go/') {
      try {
        sourceContext = downloadArticleContext(
          sessionStorage.getItem(downloadContextKey),
          new URL(location.href),
          document.referrer,
        );
      } catch {
        if (status) status.textContent = 'Your browser could not read article attribution.';
      }
    }
    gtag('event', 'app_store_click', {
      ...pageParameters(),
      ...sourceContext,
      ...parameters,
      button_placement: placement,
      app_campaign: acquisition.campaign,
      app_platform: appPlatform(destination),
      transport_type: 'beacon',
    });
  }
  document.addEventListener('click', trackClick, true);
  document.addEventListener('auxclick', trackClick, true);
  function syncSavedChoice() {
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (allowed !== (saved === 'granted')) {
        // Reinitialize the tag and its consent state after a change in another tab.
        allowed = false;
        Reflect.set(window, `ga-disable-${measurementId}`, true);
        location.reload();
        return false;
      }
    } catch {
      // If persistence is blocked, retain the explicit choice made on this document.
    }
    return allowed;
  }
  window.addEventListener('storage', (event) => {
    if (event.key === preferenceKey || event.key === null) syncSavedChoice();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && syncSavedChoice()) pageView();
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
