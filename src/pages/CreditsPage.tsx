import { Site } from '../components/Site';
import assets from '../../content/assets.json';
export function CreditsPage() {
  return (
    <Site>
      <section className="section simple-page">
        <h1>Photo credits</h1>
        <p>
          Real specimens, photographed by their credited creators. Images are resized and may be
          cropped in page layouts. Share-alike images retain their original license.
        </p>
        <div className="credit-grid">
          {assets.map((asset) => (
            <div className="credit-row" key={asset.path}>
              <img src={asset.path} alt={asset.alt} width="150" height="120" loading="lazy" />
              <div>
                <p>
                  <strong>{asset.alt}</strong>
                </p>
                <p>{asset.credit || 'Public-domain contributor; see source record'}</p>
                <p>
                  <a href={asset.sourceUrl}>Original image and attribution</a>
                </p>
                <p>
                  {asset.licenseUrl ? (
                    <a href={asset.licenseUrl}>{asset.license}</a>
                  ) : (
                    asset.license
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Site>
  );
}
