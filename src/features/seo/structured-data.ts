import { acquisition } from '../analytics/acquisition';

export type StructuredData = Record<string, unknown>;
const siteUrl = `${acquisition.siteUrl}/`;
export const publisherId = `${siteUrl}#publisher`;
export const websiteId = `${siteUrl}#website`;
export const applicationId = `${siteUrl}app/#application`;
export const applicationName = 'Rock Scan: Jewelry Identifier';
export const applicationDescription =
  'A photo identification app for exploring possible matches for rocks, crystals, minerals and gemstones. Published by Yoav Tzori for educational use.';

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
    ],
  };
}
