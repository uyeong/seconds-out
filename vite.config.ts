import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages의 레포지토리 이름을 사용하는 경우 (예: username.github.io/repo-name/)
// base 옵션 설정이 필요합니다. 레포지토리 이름을 정확히 설정해주세요.
const BASE = process.env.NODE_ENV === 'production' ? '/seconds-out/' : '/';

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo.svg',
        'icons/ios/*.png',
        'icons/android/*.png',
        'bells/*.wav',
      ],
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wav}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|wav)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-sounds-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-network-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Seconds Out',
        short_name: 'Seconds Out',
        description: 'Seconds Out PWA Application',
        theme_color: '#ffffff',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '32x32',
          },
          {
            src: 'icons/android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/ios/192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        start_url: BASE,
        display: 'standalone',
        background_color: '#ffffff',
        scope: BASE,
      },
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
