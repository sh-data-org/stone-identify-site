export function AppScreenshots() {
  return (
    <section aria-labelledby="app-screenshots-title">
      <h2 id="app-screenshots-title">Explore a result. Keep your finds.</h2>
      <div className="app-screenshots">
        <figure>
          <img
            src="/images/app-result-android.png"
            alt="Android result screen showing an amethyst example and tabs for its identity, comparisons and value."
            width="1080"
            height="1920"
            loading="lazy"
          />
          <figcaption>Read a suggested stone profile and explore its details.</figcaption>
        </figure>
        <figure>
          <img
            src="/images/app-library-android.png"
            alt="Android library screen with saved amethyst and fluorite examples."
            width="1080"
            height="1920"
            loading="lazy"
          />
          <figcaption>Keep saved stones together in your collection.</figcaption>
        </figure>
      </div>
      <p className="app-screenshots-note">
        Android screens shown with sample data and artwork. Results and available details vary;
        displayed confidence scores are not a guarantee of identification accuracy.
      </p>
    </section>
  );
}
