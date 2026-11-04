import { Site } from '../components/Site';
import { appStoreUrl, googlePlayUrl } from '../features/analytics/acquisition';

export function DownloadPage() {
  return (
    <Site>
      <section className="section simple-page prose" id="store-redirect">
        <h1>Get Stone Identifier</h1>
        <p>On a phone or tablet, we’ll open the matching store. You can also choose below.</p>
        <p>
          <a className="button download-button" href={appStoreUrl()} data-app-placement="article">
            App Store for iOS ↗
          </a>
        </p>
        <p>
          <a className="button download-button" href={googlePlayUrl()} data-app-placement="article">
            Google Play for Android ↗
          </a>
        </p>
        <p>Check the store listing for device compatibility, features and in-app purchases.</p>
        <p>
          <a href="/app/">Learn about the apps</a>
        </p>
      </section>
    </Site>
  );
}
