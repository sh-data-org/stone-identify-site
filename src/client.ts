import './styles/site.css';
import './styles/public.css';
import './styles/simplified.css';
import { setupGoogleAnalytics } from './features/analytics/google-client';

const analytics = document.getElementById('google-analytics');
if (analytics) setupGoogleAnalytics(analytics);
document.getElementById('print-sheet')?.addEventListener('click', () => window.print());
