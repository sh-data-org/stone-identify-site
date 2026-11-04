import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  acquisition,
  appClickPlacement,
  appStoreUrl,
  appPlatform,
  googlePlayUrl,
  deviceStoreUrl,
} from '../src/features/analytics/acquisition';
import { analyticsReferrer, googleMeasurementId } from '../src/features/analytics/google';

test('App Store buttons carry the verified shared website campaign', () => {
  const url = new URL(appStoreUrl());
  assert.equal(url.hostname, 'apps.apple.com');
  assert.equal(url.pathname, '/us/app/id6782013876');
  assert.equal(url.searchParams.get('pt'), '125042532');
  assert.equal(url.searchParams.get('ct'), 'stone-web');
  assert.equal(url.searchParams.has('ppid'), false);
  assert.throws(() => appStoreUrl('invalid'));
});

test('only our App Store destinations are counted', () => {
  assert.equal(appClickPlacement(new URL(appStoreUrl()), 'hero'), 'hero');
  assert.equal(appClickPlacement(new URL('https://apps.apple.com/app/id123')), null);
  assert.equal(appClickPlacement(new URL('https://example.com/go')), null);
  assert.equal(appClickPlacement(new URL(appStoreUrl()), 'arbitrary'), 'article');
});

test('analytics excludes preview origins, admins and disabled launches', () => {
  const env = {
    SITE_URL: acquisition.siteUrl,
    GA_MEASUREMENT_ID: acquisition.measurementId,
    LAUNCH_READY: 'true',
  };
  assert.equal(
    googleMeasurementId(env, new URL(acquisition.siteUrl), false),
    acquisition.measurementId,
  );
  assert.equal(googleMeasurementId(env, new URL('http://localhost:4345'), false), null);
  assert.equal(googleMeasurementId(env, new URL('https://preview.example.com'), false), null);
  assert.equal(googleMeasurementId(env, new URL(acquisition.siteUrl), true), null);
  assert.equal(
    googleMeasurementId({ ...env, LAUNCH_READY: 'false' }, new URL(acquisition.siteUrl), false),
    null,
  );
});

test('private referrer paths and parameters are not sent', () => {
  assert.equal(
    analyticsReferrer('https://example.com/private?email=a@example.com#secret'),
    'https://example.com',
  );
  assert.equal(analyticsReferrer(''), '');
});

test('Google Play referrer preserves the shared campaign and counts only our Android listing', () => {
  const url = new URL(googlePlayUrl());
  assert.equal(url.searchParams.get('id'), 'com.stocker.stoneidentify');
  const referrer = new URLSearchParams(url.searchParams.get('referrer') ?? '');
  assert.equal(referrer.get('utm_campaign'), 'stone-web');
  assert.equal(referrer.get('utm_source'), 'stoneidentify.app');
  assert.equal(appPlatform(url), 'android');
  assert.equal(appClickPlacement(url, 'sidebar'), 'sidebar');
  url.searchParams.set('id', 'another.app');
  assert.equal(appPlatform(url), null);
  assert.equal(
    appPlatform(
      new URL('https://play.google.com.evil.test/store/apps/details?id=com.stocker.stoneidentify'),
    ),
    null,
  );
  assert.equal(appClickPlacement(new URL('https://stoneidentify.app/go/')), null);
});

test('shared download link routes phones and iPadOS while leaving desktops a choice', () => {
  assert.equal(
    deviceStoreUrl('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'),
    appStoreUrl(),
  );
  assert.equal(deviceStoreUrl('Mozilla/5.0 (Linux; Android 15; Pixel 9)'), googlePlayUrl());
  assert.equal(deviceStoreUrl('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 5), appStoreUrl());
  assert.equal(deviceStoreUrl('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 0), null);
  assert.equal(deviceStoreUrl('Mozilla/5.0 (Windows NT 10.0)'), null);
  assert.equal(deviceStoreUrl(''), null);
});
