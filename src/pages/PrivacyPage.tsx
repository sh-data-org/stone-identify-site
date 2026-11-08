import { Site } from '../components/Site';
export function PrivacyPage() {
  return (
    <Site>
      <section className="section simple-page prose">
        <h1>Website privacy</h1>
        <p>This website is operated by Yoav Tzori and hosted on GitHub Pages.</p>
        <h2>Website visits</h2>
        <p>
          With your permission, Google Analytics measures page views and app store button clicks. It
          is not loaded before you choose “Allow analytics.” You can decline or change your choice
          using Analytics preferences below. We store that choice in your browser. Page URL query
          strings and fragments are excluded from page URLs in the events we send. For recognized AI
          services, we use the referral domain or an allowed source label in the URL to measure
          which service brought you here. After consent, we keep that service name and the landing
          page path in this tab’s session storage through site navigation, for up to 30 minutes
          between page loads. We include them with page views and store clicks. We do not send
          conversation links, prompts or arbitrary URL parameter values. Withdrawing consent clears
          this saved attribution. Store clicks are not downloads. GitHub processes network
          information to serve and secure the site, including visitors’ IP addresses. See{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
            GitHub’s privacy statement
          </a>
          .
        </p>
        <h2>External services</h2>
        <p>
          Download buttons open Apple’s App Store or Google Play with a website campaign label. The
          shared download link selects a store using the device type in your browser. Campaign
          downloads are reported separately, subject to provider reporting rules. Fonts are loaded
          from Google Fonts. These services receive ordinary network requests when used. The app has
          its own <a href="https://identifier-privacy-policy.sh-data.site/">privacy policy</a>.
        </p>
        <h2>No website accounts or uploads</h2>
        <p>
          This public site has no sign-in, photo scanner or upload form. App identification happens
          in the mobile apps.
        </p>
        <h2>Contact</h2>
        <p>
          For support or privacy requests, use the support information on the{' '}
          <a href="https://apps.apple.com/us/app/id6782013876">official app listing</a>.
        </p>
      </section>
    </Site>
  );
}
