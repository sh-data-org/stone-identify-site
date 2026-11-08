import { acquisition } from '../analytics/acquisition';

export type StructuredData = Record<string, unknown>;
const siteUrl = `${acquisition.siteUrl}/`;
export const publisherId = `${siteUrl}#publisher`;
export const websiteId = `${siteUrl}#website`;
export const applicationId = `${siteUrl}app/#application`;
export const applicationName = 'Rock Identifier & Stone Scan';
export const applicationDescription =
  'Use a photo to explore possible rock, crystal, mineral and gemstone matches. Compare lookalikes and save your finds in a personal collection.';

export const applicationSchema: StructuredData = {
  '@type': 'MobileApplication',
  '@id': applicationId,
  name: applicationName,
  alternateName: 'Stone Identify',
  description: applicationDescription,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'iOS 18.0 or later',
  url: `${siteUrl}app/`,
  installUrl: `https://apps.apple.com/us/app/id${acquisition.appId}`,
  sameAs: `https://apps.apple.com/us/app/id${acquisition.appId}`,
  image: `${siteUrl}images/app-icon.jpg`,
  author: { '@id': publisherId },
  featureList: [
    'Photo-based rock, crystal, mineral and gemstone suggestions',
    'Stone profiles and comparisons',
    'Saved stone collection',
    'Optional Pro subscription',
  ],
};

const androidApplicationSchema: StructuredData = {
  '@type': 'MobileApplication',
  '@id': `${siteUrl}app/#android-application`,
  name: 'Crystal & Stone Identifier',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Android',
  url: `${siteUrl}app/`,
  installUrl: `https://play.google.com/store/apps/details?id=${acquisition.androidPackage}`,
  sameAs: `https://play.google.com/store/apps/details?id=${acquisition.androidPackage}`,
  screenshot: [
    `${siteUrl}images/app-result-android.png`,
    `${siteUrl}images/app-library-android.png`,
  ],
  author: { '@type': 'Organization', name: 'Stocker Group' },
};

export function pageStructuredData(page: {
  path: string;
  title: string;
  description: string;
  schema?: StructuredData;
}): StructuredData {
  const url = new URL(page.path, siteUrl).href;
  const mainEntity = page.schema ? { '@id': page.schema['@id'] ?? `${url}#article` } : undefined;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': publisherId, name: 'Yoav Tzori', url: `${siteUrl}about/` },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Stone Identifier',
        url: siteUrl,
        inLanguage: 'en-US',
        publisher: { '@id': publisherId },
      },
      {
        '@type': page.path === '/about/' ? 'AboutPage' : 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': websiteId },
        publisher: { '@id': publisherId },
        mainEntity,
      },
      ...(page.schema ? [{ ...page.schema, '@id': mainEntity?.['@id'] }] : []),
      ...(page.path === '/app/' ? [androidApplicationSchema] : []),
    ],
  };
}
