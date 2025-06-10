import { map, tileLayer, Icon, icon, marker, popup, latLng } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import CONFIG from '../config';

export default class Map {
  #zoom = 5;
  #map = null;

  /**
   * Reverse geocoding: dapatkan nama tempat dari koordinat
   * Fallback ke koordinat jika gagal.
   */
  static async getPlaceNameByCoordinate(latitude, longitude) {
    try {
      // Gunakan MapTiler jika API key tersedia, fallback ke Nominatim jika tidak
      if (CONFIG.MAP_SERVICE_API_KEY) {
        const url = new URL(
          `https://api.maptiler.com/geocoding/${longitude},${latitude}.json`
        );
        url.searchParams.set('key', CONFIG.MAP_SERVICE_API_KEY);
        url.searchParams.set('language', 'id');
        url.searchParams.set('limit', '1');
        const response = await fetch(url);
        const json = await response.json();
        const place = json.features[0]?.place_name?.split(', ');
        return place
          ? [place.at(-2), place.at(-1)].join(', ')
          : `${latitude}, ${longitude}`;
      } else {
        // Fallback: Nominatim (tanpa API key, rate limit rendah)
        const url = new URL('https://nominatim.openstreetmap.org/reverse');
        url.searchParams.set('format', 'json');
        url.searchParams.set('lat', latitude);
        url.searchParams.set('lon', longitude);
        url.searchParams.set('accept-language', 'id');
        url.searchParams.set('zoom', '10');
        const response = await fetch(url, {
          headers: { 'User-Agent': 'DicodingStoryApp/1.0' },
        });
        const json = await response.json();
        return json.display_name || `${latitude}, ${longitude}`;
      }
    } catch (error) {
      console.error('getPlaceNameByCoordinate: error:', error);
      return `${latitude}, ${longitude}`;
    }
  }

  static isGeolocationAvailable() {
    return 'geolocation' in navigator;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvailable()) {
        reject('Geolocation API unsupported');
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  /**
   * Factory builder: auto-locate or use default center
   */
  static async build(selector, options = {}) {
    const jakartaCoordinate = [-6.2, 106.816666];
    if ('center' in options && options.center) {
      return new Map(selector, options);
    }
    if ('locate' in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        return new Map(selector, { ...options, center: coordinate });
      } catch (error) {
        console.error('build: error:', error);
        return new Map(selector, { ...options, center: jakartaCoordinate });
      }
    }
    return new Map(selector, { ...options, center: jakartaCoordinate });
  }

  /**
   * Inisialisasi peta dengan tile OSM (default) dan opsi custom
   */
  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;
    // Pilih tile layer dari config jika tersedia
    const tileLayerUrl =
      options.tileLayerUrl ||
      CONFIG.MAP_TILE_LAYERS?.osm?.url ||
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayerAttribution =
      options.tileLayerAttribution ||
      CONFIG.MAP_TILE_LAYERS?.osm?.attribution ||
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';

    const tileOsm = tileLayer(tileLayerUrl, {
      attribution: tileLayerAttribution,
    });

    this.#map = map(
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector,
      {
        zoom: this.#zoom,
        scrollWheelZoom: false,
        layers: [tileOsm],
        ...options,
      }
    );
  }

  /**
   * Ganti tampilan kamera (center & zoom)
   */
  changeCamera(coordinate, zoomLevel = null) {
    this.#map.setView(latLng(coordinate), zoomLevel ?? this.#zoom);
  }

  /**
   * Dapatkan posisi tengah peta
   */
  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return { latitude: lat, longitude: lng };
  }

  /**
   * Buat icon marker custom (bisa override)
   */
  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }

  /**
   * Tambahkan marker ke peta
   * @param {Array} coordinates [lat, lng]
   * @param {Object} markerOptions
   * @param {Object|null} popupOptions
   */
  addMarker(coordinates, markerOptions = {}, popupOptions = null) {
    if (typeof markerOptions !== 'object')
      throw new Error('markerOptions must be an object');
    const newMarker = marker(coordinates, {
      icon: this.createIcon(markerOptions.iconOptions),
      alt: markerOptions.alt || 'Marker',
      ...markerOptions,
    });
    if (popupOptions) {
      if (typeof popupOptions !== 'object')
        throw new Error('popupOptions must be an object');
      const newPopup = popup(popupOptions);
      newPopup.setLatLng(coordinates);
      newPopup.setContent(popupOptions.content || newMarker.options.alt);
      newMarker.bindPopup(newPopup);
    }
    newMarker.addTo(this.#map);
    return newMarker;
  }

  /**
   * Tambahkan event listener ke peta
   */
  addMapEventListener(eventName, callback) {
    this.#map.addEventListener(eventName, callback);
  }

  /**
   * Improvisasi: Mendapatkan instance Leaflet map (untuk advanced usage)
   */
  getLeafletInstance() {
    return this.#map;
  }

  /**
   * Improvisasi: Resize map jika container berubah
   */
  invalidateSize() {
    this.#map.invalidateSize();
  }
}
