import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({
  site: 'https://stoneidentify.app',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
});
