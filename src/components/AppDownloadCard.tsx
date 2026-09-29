import { Download } from './Download';

type Props = {
  placement: 'article' | 'sidebar' | 'footer';
  compact?: boolean;
};

export function AppDownloadCard({ placement, compact = false }: Props) {
  return (
    <section className={`app-download-card${compact ? ' app-download-card--compact' : ''}`}>
      <div className="app-download-identity">
        <img
          className="app-icon"
          src="/images/app-icon.jpg"
          alt=""
          width="64"
          height="64"
          loading="lazy"
        />
        <span>ROCK SCAN</span>
      </div>
      <h2>{compact ? 'What did you find?' : 'Put a name to your find.'}</h2>
      <p>Snap a photo. Explore possible matches.</p>
      <Download placement={placement} />
      <p className="app-download-note">iOS 18+ · In-app purchases</p>
    </section>
  );
}
