import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './src/manifest.json';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const repoName = 'Dicoding-Story-App';
  const base = command === 'build' ? `/${repoName}/` : '/';
  return {
    base,
    root: 'src',
    publicDir: resolve(__dirname, 'src', 'public'),
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
      strictPort: false,
      headers: {
        'Service-Worker-Allowed': '/',
      },
      fs: {
        allow: ['..'],
      },
      hmr: {
        port: 5175,
        host: 'localhost',
      },
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.png',
          'offline.html',
          'images/logo.png',
          'images/*',
        ],
        manifest,
        injectRegister: 'auto',
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
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
              urlPattern: /\/$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
              },
            },
          ],
          navigateFallback: '/offline.html',
          globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,webp,json}'],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
  };
});
