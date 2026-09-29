import { Site } from '../components/Site';
import { Download } from '../components/Download';
import { applicationName, applicationDescription } from '../features/seo/structured-data';

export function AppPage() {
  return (
    <Site>
      <article className="section simple-page prose">
        <h1>{applicationName}</h1>
        <p className="intro">{applicationDescription}</p>
        <Download placement="hero" />
        <h2>What does Rock Scan do?</h2>
        <p>
          Take a photograph or choose one from your library to explore a possible stone identity.
          The app provides educational profiles and comparison details to help you investigate your
          find.
        </p>
        <h2>Is Stone Identifier the same as Rock Scan?</h2>
        <p>
          Stone Identifier is this website. Our app is listed on the App Store as Rock Scan: Jewelry
          Identifier and is also described as Stone Identify. The publisher is Yoav Tzori. Use the
          App Store links on this site to find the correct app.
        </p>
        <h2>Which devices can use the app?</h2>
        <p>
          The app is available through Apple’s App Store and requires iOS 18.0 or later. Check the
          listing for current device compatibility.
        </p>
        <h2>Does it have a subscription?</h2>
        <p>
          The app offers an optional Pro subscription. Features vary by subscription status. Check
          the App Store and the in-app purchase screen for current plans, prices and terms.
        </p>
        <h2>Can a photo confirm a gemstone’s identity or value?</h2>
        <p>
          No. AI suggestions are for education and exploration. They do not replace professional
          gemological testing or a certified appraisal. A photo alone cannot establish every
          property, treatment or origin.
        </p>
        <h2>Start with a guide</h2>
        <p>
          Compare <a href="/comparisons/quartz-vs-calcite/">quartz and calcite</a>, learn{' '}
          <a href="/guides/how-to-identify-agate/">what to look for in agate</a>, or use our{' '}
          <a href="/identification-checklist/">observation sheet</a> before exploring a possible
          match.
        </p>
        <p>
          App information checked against the official App Store listing on September 29, 2026. Read
          the app’s <a href="https://identifier-privacy-policy.sh-data.site/">privacy policy</a> and{' '}
          <a href="https://identifier-terms-of-service.sh-data.site/">terms of service</a>.
        </p>
        <Download placement="footer" />
      </article>
    </Site>
  );
}
