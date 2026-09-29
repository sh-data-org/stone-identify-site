import { Site } from '../components/Site';

export function UtilityPage({ title }: { title: string }) {
  return (
    <Site noindex>
      <section className="section simple-page">
        <h1>{title}</h1>
        <p>
          Explore our <a href="/guides/">identification guides</a> or{' '}
          <a href="/comparisons/">compare stones</a>.
        </p>
      </section>
    </Site>
  );
}
