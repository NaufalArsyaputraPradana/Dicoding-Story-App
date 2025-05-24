const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
  DEFAULT_LANGUAGE: 'id-ID',
  CACHE_NAME: 'DicodingStory-V5',
  DATABASE_NAME: 'dicoding-story-database',
  DATABASE_VERSION: 1,
  OBJECT_STORE_NAME: 'stories',
  DEFAULT_MAP_CENTER: [-6.1754, 106.8272], // Jakarta coordinates
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
};

export default CONFIG;
