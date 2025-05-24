import DicodingStoryApi from '../data/api';
import { isOnline } from '../utils/index';

class StoryDetailPresenter {
  constructor({ view, id }) {
    this._view = view;
    this._id = id;
    this._map = null;
    this._story = null;
    this._mapInitialized = false;
  }

  async init() {
    this._view.renderPage();
    await this._loadStoryDetail();
    this._setupOnlineListener();
    this._setupActions();
  }

  async _loadStoryDetail() {
    try {
      this._view.showLoading();

      const token = localStorage.getItem('token');
      if (!token) {
        this._view.showLoginRequired();
        return;
      }

      // Coba mendapatkan data dari cache terlebih dahulu
      const cachedStory = this._getCachedStory();

      // Selalu coba untuk mendapatkan data dari server terlebih dahulu
      // tanpa memperdulikan status koneksi
      try {
        const response = await DicodingStoryApi.getStoryDetail({
          token,
          id: this._id,
        });

        if (response.error) {
          throw new Error(response.message || 'Gagal memuat cerita');
        }

        this._story = response.story;
        this._cacheStory(response.story);
        this._view.renderStoryDetail(response.story);
        this._view.hideOfflineMessage();

        if (this._story.lat && this._story.lon) {
          this._initMapWithDelay(300);
        }
      } catch (apiError) {
        console.error('API error:', apiError);

        // Jika ada data cache, tampilkan data cache
        if (cachedStory) {
          console.log('Loading from cache instead');
          this._story = cachedStory;
          this._view.renderStoryDetail(cachedStory);
          this._view.showOfflineMessage();

          if (cachedStory.lat && cachedStory.lon && !this._mapInitialized) {
            this._initMapWithDelay(300);
          }
        } else {
          // Jika tidak ada data cache, tampilkan pesan error
          this._view.showError(apiError.message);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);

      // Coba ambil dari cache sebagai fallback
      const cachedStory = this._getCachedStory();
      if (cachedStory) {
        this._story = cachedStory;
        this._view.renderStoryDetail(cachedStory);
        this._view.showOfflineMessage();

        if (cachedStory.lat && cachedStory.lon && !this._mapInitialized) {
          this._initMapWithDelay(300);
        }
      } else {
        this._view.showError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      this._view.hideLoading();
    }
  }

  _setupOnlineListener() {
    window.addEventListener('online', () => {
      if (!this._story) {
        this._loadStoryDetail();
      } else {
        this._view.hideOfflineMessage();
      }
    });

    window.addEventListener('offline', () => {
      if (this._story) {
        this._view.showOfflineMessage();
      }
    });
  }

  _initMapWithDelay(delay = 100) {
    if (!window.L) {
      console.error('Leaflet library not available');
      return;
    }

    setTimeout(() => {
      this._initMap();
    }, delay);
  }

  _initMap() {
    if (this._mapInitialized) return;

    // Make sure story exists and has valid coordinates
    if (!this._story) {
      console.error('Cannot initialize map: story is undefined');
      return;
    }

    // Check if coordinates are valid numbers
    const lat = parseFloat(this._story.lat);
    const lon = parseFloat(this._story.lon);

    if (isNaN(lat) || isNaN(lon)) {
      console.error('Cannot initialize map: invalid coordinates', {
        lat: this._story.lat,
        lon: this._story.lon,
      });
      return;
    }

    const mapContainer = this._view.getMapContainer();
    if (!mapContainer) {
      console.error('Cannot initialize map: container not found');
      return;
    }

    try {
      console.log('Initializing map with coordinates:', lat, lon);

      // Create map instance
      this._map = L.map(mapContainer).setView([lat, lon], 13);

      // Add tile layers
      const baseMaps = this._createBaseMaps();

      // Add default layer
      baseMaps['Street'].addTo(this._map);

      // Add layer control
      L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(this._map);

      // Add marker
      this._addStoryMarker();

      // Add locate control
      this._addLocateControl();

      // Update map size after container is fully visible
      this._updateMapSize();

      this._mapInitialized = true;
      console.log('Map initialization complete');
    } catch (error) {
      console.error('Error initializing map:', error);
      this._view.showMapError();
    }
  }

  _createBaseMaps() {
    const baseMaps = {};

    // Basic OpenStreetMap
    baseMaps['Street'] = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    );

    // Satellite view
    baseMaps['Satellite'] = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      }
    );

    // Dark mode
    baseMaps['Dark'] = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    );

    // Topographic map
    baseMaps['Topographic'] = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17,
      }
    );

    return baseMaps;
  }

  _addStoryMarker() {
    if (!this._map) {
      console.error('Cannot add marker: map is not initialized');
      return;
    }

    if (!this._story) {
      console.error('Cannot add marker: story is undefined');
      return;
    }

    try {
      // Check if coordinates are valid numbers
      const lat = parseFloat(this._story.lat);
      const lon = parseFloat(this._story.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.error('Cannot add marker: invalid coordinates', {
          lat: this._story.lat,
          lon: this._story.lon,
        });
        return;
      }

      // Safely handle missing data
      const name = this._story.name || 'Untitled Story';
      const description = this._story.description || '';

      const popup = `
        <div class="custom-popup">
          <h3>${name}</h3>
          <p>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
        </div>
      `;

      L.marker([lat, lon]).addTo(this._map).bindPopup(popup).openPopup();

      console.log('Marker added successfully');
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  }

  _addLocateControl() {
    if (!this._map) return;

    L.control
      .locate({
        position: 'topright',
        strings: {
          title: 'Show my location',
        },
        locateOptions: {
          enableHighAccuracy: true,
        },
      })
      .addTo(this._map);
  }

  _updateMapSize() {
    if (!this._map) return;

    // Resize map after a delay to ensure the container is fully rendered
    setTimeout(() => {
      this._map.invalidateSize();
    }, 300);

    // Also resize map on window resize
    window.addEventListener('resize', () => {
      if (this._map) {
        this._map.invalidateSize();
      }
    });
  }

  _cacheStory(story) {
    try {
      // Cache the individual story with timestamp
      const cacheData = {
        ...story,
        cachedAt: new Date().toISOString(),
      };

      localStorage.setItem(`story_${story.id}`, JSON.stringify(cacheData));

      // Also update the story in the stories cache if it exists
      const cachedStories = JSON.parse(
        localStorage.getItem('cachedStories') || '[]'
      );

      const updatedCache = cachedStories.map((item) =>
        item.id === story.id ? cacheData : item
      );

      // If story wasn't in the cache, add it
      if (!cachedStories.some((item) => item.id === story.id)) {
        updatedCache.push(cacheData);
      }

      // Limit cache size to prevent storage issues
      const limitedCache = updatedCache.slice(0, 50);
      localStorage.setItem('cachedStories', JSON.stringify(limitedCache));
    } catch (error) {
      console.error('Error caching story:', error);
    }
  }

  _getCachedStory() {
    try {
      // Try to get the individual cached story first
      const cachedStoryJson = localStorage.getItem(`story_${this._id}`);
      if (cachedStoryJson) {
        try {
          const parsedStory = JSON.parse(cachedStoryJson);

          // Validate that we have required fields
          if (!parsedStory || typeof parsedStory !== 'object') {
            console.error('Invalid cached story format:', parsedStory);
            return null;
          }

          // Ensure required properties exist
          parsedStory.name = parsedStory.name || 'Unknown User';
          parsedStory.description = parsedStory.description || '';
          parsedStory.photoUrl =
            parsedStory.photoUrl || './images/placeholder.jpg';
          parsedStory.createdAt =
            parsedStory.createdAt || new Date().toISOString();

          return parsedStory;
        } catch (parseError) {
          console.error('Error parsing cached story:', parseError);
          // Remove invalid cache entry
          localStorage.removeItem(`story_${this._id}`);
          return null;
        }
      }

      // If not found, check in the stories cache
      const cachedStoriesJson = localStorage.getItem('cachedStories');
      if (!cachedStoriesJson) return null;

      try {
        const cachedStories = JSON.parse(cachedStoriesJson);
        if (!Array.isArray(cachedStories)) {
          console.error('Cached stories is not an array:', cachedStories);
          return null;
        }

        const foundStory = cachedStories.find(
          (story) => story && story.id === this._id
        );
        if (!foundStory) return null;

        // Ensure required properties exist
        foundStory.name = foundStory.name || 'Unknown User';
        foundStory.description = foundStory.description || '';
        foundStory.photoUrl = foundStory.photoUrl || './images/placeholder.jpg';
        foundStory.createdAt = foundStory.createdAt || new Date().toISOString();

        return foundStory;
      } catch (parseError) {
        console.error('Error parsing cached stories:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error reading cached story:', error);
      return null;
    }
  }

  _setupActions() {
    // Setup share button if supported
    if (navigator.share) {
      this._view.showShareButton();
      this._view.setShareButtonCallback(() => this._shareStory());
    }

    // Setup favorite button callback
    this._view.setFavoriteButtonCallback((isFavorite) => {
      this._toggleFavorite(isFavorite);
    });
  }

  async _shareStory() {
    if (!this._story) return;

    try {
      const shareData = {
        title: `Cerita dari ${this._story.name}`,
        text: this._story.description,
        url: window.location.href,
      };

      await navigator.share(shareData);
      if (window.showToast) {
        window.showToast('Cerita berhasil dibagikan!', 'success');
      }
    } catch (error) {
      console.error('Error sharing story:', error);
      // Don't show error for user cancellation
      if (error.name !== 'AbortError') {
        window.showToast &&
          window.showToast('Gagal membagikan cerita', 'error');
      }
    }
  }

  _toggleFavorite(isFavorite) {
    if (!this._story) return;

    try {
      // Get current favorites from localStorage
      const favoritesJson = localStorage.getItem('favoriteStories');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (isFavorite) {
        // Add to favorites if not already there
        if (!favorites.includes(this._story.id)) {
          favorites.push(this._story.id);
          window.showToast &&
            window.showToast('Ditambahkan ke favorit!', 'success');
        }
      } else {
        // Remove from favorites
        favorites = favorites.filter((id) => id !== this._story.id);
        window.showToast && window.showToast('Dihapus dari favorit', 'info');
      }

      // Save updated favorites
      localStorage.setItem('favoriteStories', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }
}

export default StoryDetailPresenter;
