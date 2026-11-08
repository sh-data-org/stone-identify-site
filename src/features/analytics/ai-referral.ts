export const aiReferralKey = 'stone-ai-referral';
const maxAge = 30 * 60 * 1000;
const aiSources = [
  'chatgpt.com',
  'perplexity.ai',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'grok.com',
  'you.com',
] as const;

export type AiReferral = {
  ai_source: (typeof aiSources)[number];
  ai_landing_page: string;
  updatedAt: number;
};

function validLandingPage(path: string): boolean {
  return path.length <= 160 && /^\/(?:[a-z0-9-]+\/)*$/.test(path);
}

function isAiReferral(value: unknown): value is AiReferral {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ai_source' in value &&
    aiSources.some((source) => source === value.ai_source) &&
    'ai_landing_page' in value &&
    typeof value.ai_landing_page === 'string' &&
    validLandingPage(value.ai_landing_page) &&
    'updatedAt' in value &&
    typeof value.updatedAt === 'number' &&
    Number.isFinite(value.updatedAt) &&
    value.updatedAt >= 0
  );
}

function sourceFromHost(host: string): AiReferral['ai_source'] | null {
  const normalized = host.toLowerCase().replace(/^www\./, '');
  if (normalized === 'chat.openai.com') return 'chatgpt.com';
  return aiSources.find((source) => normalized === source) ?? null;
}

function referrerUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

export function resolveAiReferral(
  currentUrl: URL,
  referrer: string,
  stored: string | null,
  now = Date.now(),
): AiReferral | null {
  const sourceTag = currentUrl.searchParams.get('utm_source');
  const previousPage = referrerUrl(referrer);
  const source = sourceTag
    ? sourceFromHost(sourceTag.trim())
    : previousPage && sourceFromHost(previousPage.hostname);

  if (source) {
    return validLandingPage(currentUrl.pathname)
      ? { ai_source: source, ai_landing_page: currentUrl.pathname, updatedAt: now }
      : null;
  }

  // Carry attribution only through this site's navigation, never into a new external visit.
  if (sourceTag || previousPage?.origin !== currentUrl.origin || !stored) return null;
  try {
    const value: unknown = JSON.parse(stored);
    if (!isAiReferral(value) || value.updatedAt > now || now - value.updatedAt >= maxAge)
      return null;
    return {
      ai_source: value.ai_source,
      ai_landing_page: value.ai_landing_page,
      updatedAt: now,
    };
  } catch {
    // Browser storage may contain stale or malformed values from an earlier visit.
    return null;
  }
}

export function aiReferralParameters(referral: AiReferral | null) {
  return referral
    ? { ai_source: referral.ai_source, ai_landing_page: referral.ai_landing_page }
    : {};
}

export function aiCampaignParameters(currentUrl: URL, referrer: string) {
  const referral = resolveAiReferral(currentUrl, referrer, null);
  // Only the entry page sets campaign fields; internal navigation must not start a campaign.
  return referral ? { campaign_source: referral.ai_source, campaign_medium: 'referral' } : {};
}
