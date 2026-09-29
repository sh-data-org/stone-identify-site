import type { ReactNode } from 'react';
import { AppPage } from './pages/AppPage';
import {
  applicationSchema,
  applicationName,
  applicationDescription,
  publisherId,
  websiteId,
  type StructuredData,
} from './features/seo/structured-data';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CreditsPage } from './pages/CreditsPage';
import { IdentificationChecklistPage } from './pages/IdentificationChecklistPage';
import { ArticlePage } from './pages/ArticlePage';
import { CollectionPage } from './pages/CollectionPage';
import { UtilityPage } from './pages/UtilityPage';
import { articles } from './features/articles/content';
import { acquisition } from './features/analytics/acquisition';

export interface Route {
  path: string;
  title: string;
  description: string;
  element: ReactNode;
  noindex?: boolean;
  image?: string;
  schema?: StructuredData;
}

const pages: Route[] = [
  {
    path: '/app',
    title: applicationName,
    description: applicationDescription,
    image: '/images/app-icon.jpg',
    element: <AppPage />,
    schema: applicationSchema,
  },
  {
    path: '/',
    title: 'Rock identification guides and app',
    description:
      'Learn to identify rocks and minerals with practical guides, compare similar stones, and explore possible matches with Rock Scan for iPhone.',
    element: <HomePage />,
  },
  {
    path: '/guides',
    title: 'Rock and mineral identification guides',
    description:
      'Start with visible clues, record your observations and learn what to compare before identifying the rock or mineral you found.',
    element: <CollectionPage category="guides" />,
  },
  {
    path: '/comparisons',
    title: 'Compare similar stones and minerals',
    description:
      'Compare lookalike stones using visible features and reference properties. Learn what a photograph can show and what needs closer examination.',
    element: <CollectionPage category="comparisons" />,
  },
  {
    path: '/about',
    title: 'About Stone Identifier',
    description:
      'Learn about Stone Identifier, our educational rock and mineral guides, and Rock Scan: Jewelry Identifier for iPhone.',
    element: <AboutPage />,
  },
  {
    path: '/privacy',
    title: 'Website privacy',
    description:
      'How Stone Identifier handles website visits, optional Google Analytics cookies and App Store campaign links.',
    element: <PrivacyPage />,
  },
  {
    path: '/terms',
    title: 'Website terms',
    description:
      'Read the terms for Stone Identifier educational guides, photographs and links to the Rock Scan iPhone app.',
    element: <TermsPage />,
  },
  {
    path: '/credits',
    title: 'Photo credits',
    description:
      'Image creators, original source links and licenses for the mineral and jewelry photographs used by Stone Identifier.',
    element: <CreditsPage />,
  },
  {
    path: '/identification-checklist',
    title: 'Stone and jewelry observation sheet',
    description:
      'Print a free observation sheet for rocks, minerals and jewelry. Record photos, size, markings and questions before seeking an identification.',
    element: <IdentificationChecklistPage />,
  },
  ...articles.map((article) => ({
    path: `/${article.category}/${article.slug}`,
    title: article.title,
    description: article.description,
    image: article.image.path,
    element: <ArticlePage article={article} />,
    schema: {
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      dateModified: article.updated,
      publisher: { '@id': publisherId },
      isPartOf: { '@id': websiteId },
      inLanguage: 'en-US',
      citation: article.sources.map((source) => source.url),
      image: new URL(article.image.path, acquisition.siteUrl).href,
      author: {
        '@type': 'Organization',
        name: 'Stone Identifier editorial team',
        url: `${acquisition.siteUrl}/about/`,
      },
      mainEntityOfPage: `${acquisition.siteUrl}/${article.category}/${article.slug}/`,
    },
  })),
  ...['jewelry', 'apps'].map((category) => ({
    path: `/${category}`,
    title: 'Explore our stone guides',
    description: 'Browse our current rock identification guides and stone comparisons.',
    noindex: true,
    element: <UtilityPage title="Explore our stone guides" />,
  })),
  {
    path: '/404',
    title: 'Page not found',
    description: 'This page is not available. Explore the current Stone Identifier guides.',
    noindex: true,
    element: <UtilityPage title="Page not found" />,
  },
];

export const routes = pages.map((page) => ({
  ...page,
  path: page.path === '/' || page.path === '/404' ? page.path : `${page.path}/`,
}));
