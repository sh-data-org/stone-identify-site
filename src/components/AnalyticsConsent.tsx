import { acquisition } from '../features/analytics/acquisition';

export function AnalyticsConsent() {
  return (
    <div id="google-analytics" data-measurement-id={acquisition.measurementId}>
      <button className="analytics-settings" data-analytics-settings>
        Analytics preferences
      </button>
      <section
        className="analytics-consent"
        data-analytics-panel
        aria-label="Analytics preferences"
        hidden
      >
        <h2>Help us improve these guides</h2>
        <p>
          Allow Google Analytics cookies to measure visits and app-link clicks? You can keep reading
          either way. <a href="/privacy/">Privacy details</a>
        </p>
        <div>
          <button className="button secondary" data-analytics-reject>
            No thanks
          </button>
          <button className="button" data-analytics-accept>
            Allow analytics
          </button>
        </div>
      </section>
      <p className="small" role="status" />
    </div>
  );
}
