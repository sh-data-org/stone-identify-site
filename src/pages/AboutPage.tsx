import { Site } from '../components/Site';
import { Download } from '../components/Download';
export function AboutPage() {
  return (
    <Site>
      <section className="section simple-page">
        <span className="eyebrow">Stay curious</span>
        <h1>About Stone Identifier</h1>
        <p className="intro">
          A stone on a trail. A crystal on a shelf. A ring you inherited. There is always something
          more to notice.
        </p>
        <div className="prose">
          <p>
            Stone Identifier helps curious people explore rocks, minerals and jewelry through
            practical guides and photo identification apps for iPhone and Android. The iOS app is
            published by Yoav Tzori; the Android app is published by Stocker Group.
          </p>
          <h2>How we make our guides</h2>
          <p>
            Our editorial process uses AI-assisted research and drafting, linked geological and
            gemological references, and editorial checks. We distinguish observable clues from
            conclusions that require instruments or an expert. Our guides are educational; they are
            not laboratory identification reports or valuations.
          </p>
          <p>
            Photographs are credited to their creators. Real app examples, where included, are
            labeled as demonstrations. We do not treat an app suggestion as proof of a specimen’s
            identity.
          </p>
          <h2>About the app</h2>
          <p>
            <a href="/app/">Explore our photo identification apps</a>, their store listings and
            supported platforms.
          </p>
          <h2>Explore your own find</h2>
          <p>
            Use the app to explore possible matches, then compare the suggested properties with what
            you can observe. Consult a qualified professional when authenticity, treatment or value
            matters.
          </p>
          <Download />
        </div>
      </section>
    </Site>
  );
}
