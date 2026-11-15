import { Site } from '../components/Site';
import { AppDownloadCard } from '../components/AppDownloadCard';
import { Download } from '../components/Download';
import { ArticleCard } from '../components/ArticleCard';
import { articles } from '../features/articles/content';

export function HomePage() {
  return (
    <Site>
      <div className="home-content">
        <section className="discovery-hero">
          <div className="discovery-copy">
            <h1>
              Know the <span>stone</span>
              <br />
              in your hand.
            </h1>
            <p>Identify your rocks with a photo. Available for iPhone and Android.</p>
            <div className="hero-actions">
              <Download placement="hero" />
              <a className="button secondary" href="#guides">
                Read the guides ↗
              </a>
            </div>
            <p className="store-name">Find us on the App Store and Google Play.</p>
          </div>
          <figure className="specimen-feature">
            <img
              src="/images/quartz.jpg"
              alt="Natural quartz crystal cluster from Minas Gerais, Brazil"
              width="1280"
              height="1090"
              fetchPriority="high"
            />
            <figcaption>
              Quartz · Natural crystal specimen <a href="/credits/">Photo credits ↗</a>
            </figcaption>
          </figure>
        </section>
        <section className="home-guides" id="guides">
          <div className="home-section-heading">
            <h2>Start with what you can see</h2>
            <a href="/guides/">All guides ↗</a>
          </div>
          <div className="prose home-app-intro">
            <h3>A rock identifier app for the stones you find</h3>
            <p>
              Use Stone Identifier on iPhone or Android to scan a rock photo and get a starting
              point for identification.
            </p>
            <p>
              Take one photo of the whole rock in indirect daylight and another close-up of an
              unpolished surface. Add something for scale and note where you found it. If the rock
              has bands, veins or visible crystals, include those in the close-up.
            </p>
            <p>
              Use the <a href="/identification-checklist/">rock identification checklist</a> to
              record what you can see and compare those clues with your scan result.
            </p>
            <a className="button" href="/go/" data-app-placement="home-guides">
              Get the rock identifier app
            </a>
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
        <AppDownloadCard placement="footer" />
        <p className="worksheet-link">
          <a href="/identification-checklist/">Get the free printable observation sheet ↗</a>
        </p>
      </div>
    </Site>
  );
}
