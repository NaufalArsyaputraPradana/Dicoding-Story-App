const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
  DEFAULT_LANGUAGE: 'id-ID',
  CACHE_NAME: 'DicodingStory-V7', // Update version if cache structure changes
  DATABASE_NAME: 'dicoding-story-db',
  DATABASE_VERSION: 1,
  OBJECT_STORE_NAME: 'stories',
  FAVORITES_STORE: 'favorites',
  DEFAULT_MAP_CENTER: [-6.1754, 106.8272], // Jakarta
  DEFAULT_MAP_ZOOM: 13,
  PAGE_SIZE: 10,
  API_TIMEOUT: 30000,
  API_RETRY_ATTEMPTS: 2,
  API_RETRY_DELAY: 1000,
  MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
  MAP_TILE_LAYERS: {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'OpenStreetMap',
    },
    satellite: {
      url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=WlHVW3GmIbcYKHpoc75N',
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      name: 'Satellite',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      name: 'Dark Mode',
    },
  },
  VAPID_PUBLIC_KEY:
    'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
  SERVICE_WORKER_PATH: './sw.js',
  OFFLINE_PAGE: './offline.html',
  ACCESS_TOKEN_KEY: 'accessToken',
  // Improvisasi: Tambahkan pengaturan baru untuk pengembangan dan fitur masa depan
  ENABLE_LOGGING: process.env.NODE_ENV !== 'production',
  SUPPORT_CONTACT: 'support@dicodingstory.app',
  APP_VERSION: '1.0.0',
  FEEDBACK_URL:
    'https://github.com/naufalarsyaputrapradana/Dicoding-Story-App/issues',
};

export default CONFIG;
