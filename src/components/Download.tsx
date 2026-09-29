import { appStoreUrl, type appPlacements } from '../features/analytics/acquisition';

type Props = {
  placement?: (typeof appPlacements)[number];
};

export function Download({ placement = 'article' }: Props) {
  return (
    <a className="store-badge download-button" href={appStoreUrl()} data-app-placement={placement}>
      <img src="/app-store-badge.svg" alt="Download on the App Store" width="180" height="60" />
    </a>
  );
}
