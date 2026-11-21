import { appStoreUrl, googlePlayUrl, type appPlacements } from '../features/analytics/acquisition';

type Props = {
  label?: string;
  placement?: (typeof appPlacements)[number];
};

export function Download({ placement = 'article', label = 'Download app ↗' }: Props) {
  return (
    <div className="download-options">
      <a
        className="button download-button"
        href="/go/"
        data-smart-download
        data-app-placement={placement}
      >
        {label}
      </a>
      <div className="download-stores" aria-label="Choose your app store">
        <a href={appStoreUrl()} data-app-placement={placement}>
          App Store
        </a>
        <span aria-hidden="true"> · </span>
        <a href={googlePlayUrl()} data-app-placement={placement}>
          Google Play
        </a>
      </div>
    </div>
  );
}
