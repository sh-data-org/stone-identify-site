import { Site } from '../components/Site';
export function TermsPage() {
  return (
    <Site>
      <section className="section simple-page prose">
        <h1>Website terms</h1>
        <p>
          This website provides general educational information about stones, minerals and jewelry.
          You may use it to learn and explore possible identifications.
        </p>
        <h2>Identification has limits</h2>
        <p>
          Appearance alone may not establish material, origin, treatment, authenticity or value.
          Neither a guide nor an app result replaces examination by a qualified geologist,
          gemologist or appraiser when those questions matter.
        </p>
        <h2>Content and photographs</h2>
        <p>
          Article text belongs to its respective rights holder. Photographs are used under the
          licenses listed on our <a href="/credits/">photo credits page</a> and individual article
          captions. Those licenses continue to apply when images are reused.
        </p>
        <h2>The app</h2>
        <p>
          Downloads, purchases and subscriptions are governed by the applicable App Store terms and
          the app’s <a href="https://identifier-terms-of-service.sh-data.site/">terms of service</a>
          . See the current listing and in-app purchase screen for available plans and prices.
        </p>
        <h2>Corrections</h2>
        <p>
          For corrections or support, use the support information on the{' '}
          <a href="https://apps.apple.com/us/app/id6782013876">official app listing</a>.
        </p>
      </section>
    </Site>
  );
}
