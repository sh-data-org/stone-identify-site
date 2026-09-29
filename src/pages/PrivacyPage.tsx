import { Site } from '../components/Site';
export function PrivacyPage() {
  return (
    <Site>
      <section className="section simple-page prose">
        <h1>Website privacy</h1>
        <p>This website is operated by Yoav Tzori and hosted on GitHub Pages.</p>
        <h2>Website visits</h2>
        <p>
          With your permission, Google Analytics measures page views and App Store button clicks. It
          is not loaded before you choose “Allow analytics.” You can decline or change your choice
          using Analytics preferences below. We store that choice in your browser. Page URL query
          strings and fragments are excluded from the events we send. App Store clicks are not
          downloads. GitHub processes network information to serve and secure the site, including
          visitors’ IP addresses. See{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
            GitHub’s privacy statement
          </a>
          .
        </p>
        <h2>External services</h2>
        <p>
          Download buttons open Apple’s App Store with a website campaign label so Apple can report
          attributed downloads in aggregate, subject to its reporting rules. Fonts are loaded from
          Google Fonts. These services receive ordinary network requests when used. The app has its
          own <a href="https://identifier-privacy-policy.sh-data.site/">privacy policy</a>.
        </p>
        <h2>No website accounts or uploads</h2>
        <p>
          This public site has no sign-in, photo scanner or upload form. App identification happens
          in the iPhone app.
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
