import { Site } from '../components/Site';
export function IdentificationChecklistPage() {
  return (
    <Site>
      <article className="section collection worksheet">
        <span className="eyebrow">Free printable resource</span>
        <h1>Stone & jewelry observation sheet</h1>
        <p className="intro">
          Keep what you observed separate from what you suspect. Print this page for a mineral club
          visit, a jewelry appointment or your collection notebook.
        </p>
        <button className="button secondary" id="print-sheet">
          Print this worksheet
        </button>
        <div className="prose">
          <h2>1. Record the object</h2>
          <p>Date: ____________________ &nbsp; Object / specimen number: ____________________</p>
          <p>Found, inherited or purchased? Where? _______________________________________</p>
          <p>Dimensions: ____________________ &nbsp; Loose or mounted? ____________________</p>
          <h2>2. Take useful photographs</h2>
          <ul>
            <li>Whole object on a plain background.</li>
            <li>Another angle, including the reverse if accessible.</li>
            <li>Close-up of visible natural surfaces, patterns or marks.</li>
            <li>A separate view with a ruler for scale.</li>
          </ul>
          <h2>3. Write only what you can observe</h2>
          <p>Color in daylight: __________________________________________________________</p>
          <p>Shape / visible grains / bands: ______________________________________________</p>
          <p>Natural, worn or polished surfaces: __________________________________________</p>
          <p>Jewelry marks, exactly as visible: ____________________________________________</p>
          <h2>4. Keep candidates provisional</h2>
          <p>Possible identity: ____________________ Suggested by: ________________________</p>
          <p>Observations supporting it: __________________________________________________</p>
          <p>Alternative to compare: ______________________________________________________</p>
          <p>Unanswered question: ________________________________________________________</p>
          <h2>5. Choose a next step</h2>
          <p>
            Use the <a href="/guides/">mineral guides</a>,{' '}
            <a href="/comparisons/">stone comparisons</a> to narrow your question. An app suggestion
            is a candidate, not an independent confirmation. Ask a qualified examiner when identity,
            treatment, authenticity or value matters.
          </p>
          <p>
            Do not scratch, acid-test, heat or break jewelry or a valued specimen to fill in this
            sheet. Record an unknown property as unknown.
          </p>
          <h2>For clubs and educators</h2>
          <p>
            You may print and share this original worksheet with attribution to Stone Identifier.
            Link to this page so readers can find the current version. This worksheet organizes
            observations; it is not a diagnostic test.
          </p>
        </div>
      </article>
    </Site>
  );
}
