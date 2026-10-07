import fs from 'fs';

let content = fs.readFileSync('vite.config.ts', 'utf8');

if (!content.includes('VitePWA')) {
  content = content.replace(
    "import {defineConfig} from 'vite';",
    "import {defineConfig} from 'vite';\nimport { VitePWA } from 'vite-plugin-pwa';"
  );
  
  content = content.replace(
    'plugins: [react(), tailwindcss()],',
    `plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'assets/letters/*.png', 'assets/*.png'],
        manifest: {
          name: 'Tamil Buddy',
          short_name: 'TamilBuddy',
          description: 'Adaptive AI-powered Tamil Learning Platform',
          theme_color: '#6D28D9',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'app-favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\\/\\/api\\.sarvam\\.ai\\/text-to-speech/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'sarvam-audio-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],`
  );
  fs.writeFileSync('vite.config.ts', content);
}
