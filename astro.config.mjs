import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // To mówi Astro, żeby generowało kod na serwer (Cloudflare), a nie tylko pliki HTML
  output: 'server', 
  adapter: cloudflare(),
  integrations: [tailwind()],
});