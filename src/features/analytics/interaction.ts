import { appPlatform } from './acquisition';

const controls = 'a[href],button,summary,[role="button"],input[type="submit"]';
const regions = [
  ['.article-toc', 'article_contents'],
  ['.sources', 'article_sources'],
  ['.related', 'related_articles'],
  ['.article-reading', 'article_body'],
  ['aside', 'sidebar'],
  ['header', 'header'],
  ['footer', 'footer'],
  ['nav', 'navigation'],
  ['form', 'form'],
  ['main', 'main'],
] as const;

export function clickInteraction(target: Element, current: URL, paths: ReadonlySet<string>) {
  const control = target.closest(controls);
  if (!control || control.closest('#google-analytics')) return null;
  const region = regions.find(([selector]) => control.closest(selector));
  const container = region ? control.closest(region[0]) : control.ownerDocument.body;
  if (!container) return null;
  const position = Array.from(container.querySelectorAll(controls)).indexOf(control) + 1;
  const link = control.closest<HTMLAnchorElement>('a[href]');
  const destination = link ? new URL(link.href, current) : null;
  let label = control.tagName === 'SUMMARY' ? 'disclosure' : 'button';
  if (destination) {
    const platform = appPlatform(destination);
    if (platform) label = platform === 'ios' ? 'app_store' : 'google_play';
    else if (destination.origin === current.origin) {
      if (destination.hash && destination.pathname === current.pathname) label = 'page_section';
      else if (paths.has(destination.pathname)) label = destination.pathname;
      else label = 'internal_link';
    } else {
      label = ['mailto:', 'tel:'].includes(destination.protocol) ? 'contact_link' : 'external_link';
    }
  }
  return {
    link,
    destination,
    parameters: {
      click_region: region?.[1] ?? 'page',
      control_position: String(position),
      click_destination: label,
    },
  };
}
