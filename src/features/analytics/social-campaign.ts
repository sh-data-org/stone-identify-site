const socialSources = ['facebook', 'instagram', 'linkedin', 'x', 'youtube'] as const;
const campaignToken = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function socialCampaignParameters(url: URL) {
  const source = url.searchParams.get('utm_source');
  const medium = url.searchParams.get('utm_medium');
  const campaign = url.searchParams.get('utm_campaign');
  const content = url.searchParams.get('utm_content');

  if (
    !socialSources.some((platform) => platform === source) ||
    medium !== 'social' ||
    !campaign ||
    !campaignToken.test(campaign)
  ) {
    return {};
  }

  return {
    campaign_source: source,
    campaign_medium: medium,
    campaign_name: campaign,
    ...(content && campaignToken.test(content) ? { campaign_content: content } : {}),
  };
}
