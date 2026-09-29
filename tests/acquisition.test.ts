import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acquisition, appClickPlacement, appStoreUrl } from '../src/features/analytics/acquisition';
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
  assert.equal(appClickPlacement(new URL(appStoreUrl()), acquisition.siteUrl, 'hero'), 'hero');
  assert.equal(
    appClickPlacement(new URL('https://apps.apple.com/app/id123'), acquisition.siteUrl),
    null,
  );
  assert.equal(appClickPlacement(new URL('https://example.com/go'), acquisition.siteUrl), null);
  assert.equal(
    appClickPlacement(new URL(appStoreUrl()), acquisition.siteUrl, 'arbitrary'),
    'article',
  );
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
