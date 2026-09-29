import { appStoreUrl, type appPlacements } from '../features/analytics/acquisition';

type Props = {
  placement?: (typeof appPlacements)[number];
  label?: string;
  badge?: boolean;
};

export function Download({
  placement = 'article',
  label = 'Open in App Store',
  badge = false,
}: Props) {
  return (
    <a
      className={badge ? 'store-badge' : 'button'}
      href={appStoreUrl()}
      data-app-placement={placement}
    >
      {badge ? (
        <img src="/app-store-badge.svg" alt="Download on the App Store" width="180" height="60" />
      ) : (
        label
      )}
    </a>
  );
}
