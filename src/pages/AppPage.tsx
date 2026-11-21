import { Site } from '../components/Site';
import { Download } from '../components/Download';
import { AppScreenshots } from '../features/app/AppScreenshots';

export function AppPage() {
  return (
    <Site>
      <article className="section simple-page prose app-page">
        <h1>Stone identifier app for iPhone and Android</h1>
        <p className="intro">
          Take a picture of a rock, mineral or crystal and compare the suggested match with the
          stone in your hand. You can start with a photo already on your phone.
        </p>
        <Download placement="hero" />
        <p>
          On iPhone, the app is free to download and includes limited free scanning.{' '}
          <a href="#free-scans">See what’s included</a>.
        </p>
        <h2>Identify a rock with your phone</h2>
        <p>
          Take a photo or choose one from your library to explore a likely rock, crystal, mineral or
          gemstone match. Read about its visible features, compare similar stones and save
          interesting finds to your collection. Identification requires an internet connection.
        </p>
        <p>
          Made for curious collectors and beginners who want a starting point for learning about a
          find. Results are AI suggestions and can be incorrect.
        </p>
        <AppScreenshots />
        <h2>How does photo identification work?</h2>
        <ol>
          <li>
            <strong>Photograph one stone clearly.</strong> Use good light, a plain background and a
            sharp close-up. Keep the whole specimen visible.
          </li>
          <li>
            <strong>Explore the suggested match.</strong> Review the profile and compare its color,
            texture, shape and shine with the stone in your hand.
          </li>
          <li>
            <strong>Check the lookalikes.</strong> Use comparison details and our guides to
            investigate features a photo cannot settle. Save the find to return to it later.
          </li>
        </ol>
        <h2>What does a stone identification result look like?</h2>
        <p>
          We scanned a glossy black specimen. The app suggested obsidian and pointed out the curved
          breaks across its surface. See the original photo and the clues in our{' '}
          <a href="/guides/black-shiny-rock-identification/">black shiny rock scan example</a>.
        </p>
        <h2 id="free-scans">Is the stone identifier app free?</h2>
        <p>
          The iOS app is free to download with optional in-app purchases. Free scanning is limited;
          check the allowance shown in the app. Pro includes unlimited scans, additional AI
          insights, deeper comparisons, value estimates and full scan history. Available details
          depend on the photo, result and subscription status.
        </p>
        <p>
          Check your device’s store listing and the in-app purchase screen for current prices, plans
          and trial eligibility. Features and offers can differ by platform. Manage or cancel a
          subscription in your Apple ID or Google Play subscription settings.
        </p>
        <p>
          Prefer to start in your browser? Use our{' '}
          <a href="/guides/identify-a-rock-online-for-free/">free rock identification key</a> to
          compare your find with labeled specimens.
        </p>
        <h2>Which app should I download?</h2>
        <p>Stone Identifier is this website. Our apps have different names in the two stores:</p>
        <ul>
          <li>
            <strong>iPhone and iPad:</strong> Rock Identifier &amp; Stone Scan by Yoav Tzori.
            Requires iOS or iPadOS 18.0 or later.
          </li>
          <li>
            <strong>Android:</strong> Crystal &amp; Stone Identifier by Stocker Group. Check Google
            Play for your device’s compatibility.
          </li>
        </ul>
        <Download placement="article" />
        <h2>How accurate is a rock identification app?</h2>
        <p>
          A clear photo can help suggest a match, but similar-looking stones, poor lighting,
          coatings and polished surfaces can make identification uncertain. A confidence score on
          one result is not a measured accuracy rate for the app. Check the physical specimen
          against reliable references rather than relying on the suggested name alone.
        </p>
        <h2>Can a photo confirm a gemstone’s identity or value?</h2>
        <p>
          No. AI suggestions are for education and exploration. They do not replace professional
          gemological testing or a certified appraisal. A photo alone cannot establish every
          property, treatment or origin.
        </p>
        <h2>Start with a guide</h2>
        <p>
          Learn <a href="/guides/identify-stones-and-crystals-by-picture/">how to read a crystal picture</a>,{' '}
          <a href="/guides/photograph-a-rock-for-identification/">how to photograph your stone</a>{' '}
          or <a href="/guides/why-rock-scans-disagree/">why two scans can disagree</a>. Compare{' '}
          <a href="/comparisons/quartz-vs-calcite/">quartz and calcite</a>, learn{' '}
          <a href="/guides/how-to-identify-agate/">what to look for in agate</a>, or use our{' '}
          <a href="/identification-checklist/">observation sheet</a> before exploring a possible
          match.
        </p>
        <p>
          Product information checked against the{' '}
          <a href="https://apps.apple.com/us/app/id6782013876">App Store</a> and{' '}
          <a href="https://play.google.com/store/apps/details?id=com.stocker.stoneidentify">
            Google Play
          </a>{' '}
          listings on November 8, 2026. Read the app’s{' '}
          <a href="https://identifier-privacy-policy.sh-data.site/">privacy policy</a> and{' '}
          <a href="https://identifier-terms-of-service.sh-data.site/">terms of service</a>.
        </p>
        <Download placement="footer" />
      </article>
    </Site>
  );
}
