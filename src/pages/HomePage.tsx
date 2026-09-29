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
            <p>
              Practical rock identification guides. Compare the clues, then explore possible matches
              with our iPhone app.
            </p>
            <div className="hero-actions">
              <Download placement="hero" />
              <a className="button secondary" href="#guides">
                Explore the guides ↗
              </a>
            </div>
            <p className="store-name">Rock Scan: Jewelry Identifier on the App Store.</p>
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
