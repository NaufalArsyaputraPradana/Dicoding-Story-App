import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './src/manifest.json';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const repoName = 'Dicoding-Story-App';
  const base = command === 'build' ? `/${repoName}/` : '/';
  return {
    base: base,
    root: 'src',
    publicDir: resolve(__dirname, 'src', 'public'), // Ensure public assets are served
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5175,
      host: true,
      open: true,
      strictPort: false, // Allow fallback to another port if 5175 is in use
      headers: {
        'Service-Worker-Allowed': '/',
      },
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
      hmr: {
        // Ensure WebSocket connection uses the same port as the server
        port: 5175,
        host: 'localhost',
      },
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'offline.html', 'images/*'],
        manifest,
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
              handler: 'NetworkFirst',
              options: { cacheName: 'api-cache', networkTimeoutSeconds: 10 },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /\//,
              handler: 'NetworkFirst',
              options: { cacheName: 'html-cache' },
            },
          ],
        },
      }),
    ],
  };
});
