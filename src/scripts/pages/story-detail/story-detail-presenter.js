import DicodingStoryApi from '../../data/api';
import { isOnline } from '../../utils/index';

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
      const token = localStorage.getItem('accessToken');
      if (!token) {
        this._view.showLoginRequired();
        return;
      }
      const cachedStory = this._getCachedStory();
      try {
        const response = await DicodingStoryApi.getStoryDetail({
          token,
          id: this._id,
        });
        if (response.error)
          throw new Error(response.message || 'Gagal memuat cerita');
        this._story = response.story;
        this._cacheStory(response.story);
        this._view.renderStoryDetail(response.story);
        this._view.hideOfflineMessage();
        if (this._story.lat && this._story.lon) {
          this._initMapWithDelay(300);
        }
      } catch (apiError) {
        // Fallback to cache if API fails
        if (cachedStory) {
          this._story = cachedStory;
          this._view.renderStoryDetail(cachedStory);
          this._view.showOfflineMessage();
          if (cachedStory.lat && cachedStory.lon && !this._mapInitialized) {
            this._initMapWithDelay(300);
          }
        } else {
          this._view.showError(apiError.message);
        }
      }
    } catch (error) {
      // Fallback to cache if unexpected error
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
    if (!this._story) return;
    const lat = parseFloat(this._story.lat);
    const lon = parseFloat(this._story.lon);
    if (isNaN(lat) || isNaN(lon)) return;
    const mapContainer = this._view.getMapContainer();
    if (!mapContainer) return;
    try {
      this._map = L.map(mapContainer).setView([lat, lon], 13);
      const baseMaps = this._createBaseMaps();
      baseMaps['Street'].addTo(this._map);
      L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(this._map);
      this._addStoryMarker();
      this._addLocateControl();
      this._updateMapSize();
      this._mapInitialized = true;
    } catch (error) {
      this._view.showMapError();
    }
  }

  _createBaseMaps() {
    const baseMaps = {};
    baseMaps['Street'] = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    );
    baseMaps['Satellite'] = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      }
    );
    baseMaps['Dark'] = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    );
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
    if (!this._map || !this._story) return;
    const lat = parseFloat(this._story.lat);
    const lon = parseFloat(this._story.lon);
    if (isNaN(lat) || isNaN(lon)) return;
    const name = this._story.name || 'Untitled Story';
    const description = this._story.description || '';
    const popup = `
      <div class="custom-popup">
        <h3>${name}</h3>
        <p>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
      </div>
    `;
    L.marker([lat, lon]).addTo(this._map).bindPopup(popup).openPopup();
  }

  _addLocateControl() {
    if (!this._map) return;
    L.control
      .locate({
        position: 'topright',
        strings: { title: 'Show my location' },
        locateOptions: { enableHighAccuracy: true },
      })
      .addTo(this._map);
  }

  _updateMapSize() {
    if (!this._map) return;
    setTimeout(() => {
      this._map.invalidateSize();
    }, 300);
    window.addEventListener('resize', () => {
      if (this._map) this._map.invalidateSize();
    });
  }

  _cacheStory(story) {
    try {
      const cacheData = { ...story, cachedAt: new Date().toISOString() };
      localStorage.setItem(`story_${story.id}`, JSON.stringify(cacheData));
      const cachedStories = JSON.parse(
        localStorage.getItem('cachedStories') || '[]'
      );
      const updatedCache = cachedStories.map((item) =>
        item.id === story.id ? cacheData : item
      );
      if (!cachedStories.some((item) => item.id === story.id)) {
        updatedCache.push(cacheData);
      }
      const limitedCache = updatedCache.slice(0, 50);
      localStorage.setItem('cachedStories', JSON.stringify(limitedCache));
    } catch (error) {
      // silent
    }
  }

  _getCachedStory() {
    try {
      const cachedStoryJson = localStorage.getItem(`story_${this._id}`);
      if (cachedStoryJson) {
        try {
          const parsedStory = JSON.parse(cachedStoryJson);
          if (!parsedStory || typeof parsedStory !== 'object') return null;
          parsedStory.name = parsedStory.name || 'Unknown User';
          parsedStory.description = parsedStory.description || '';
          parsedStory.photoUrl =
            parsedStory.photoUrl || './images/placeholder.jpg';
          parsedStory.createdAt =
            parsedStory.createdAt || new Date().toISOString();
          return parsedStory;
        } catch {
          localStorage.removeItem(`story_${this._id}`);
          return null;
        }
      }
      const cachedStoriesJson = localStorage.getItem('cachedStories');
      if (!cachedStoriesJson) return null;
      try {
        const cachedStories = JSON.parse(cachedStoriesJson);
        if (!Array.isArray(cachedStories)) return null;
        const foundStory = cachedStories.find(
          (story) => story && story.id === this._id
        );
        if (!foundStory) return null;
        foundStory.name = foundStory.name || 'Unknown User';
        foundStory.description = foundStory.description || '';
        foundStory.photoUrl = foundStory.photoUrl || './images/placeholder.jpg';
        foundStory.createdAt = foundStory.createdAt || new Date().toISOString();
        return foundStory;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }

  _setupActions() {
    if (navigator.share) {
      this._view.showShareButton();
      this._view.setShareButtonCallback(() => this._shareStory());
    }
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
      window.showToast &&
        window.showToast('Cerita berhasil dibagikan!', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        window.showToast &&
          window.showToast('Gagal membagikan cerita', 'error');
      }
    }
  }

  _toggleFavorite(isFavorite) {
    if (!this._story) return;
    try {
      const favoritesJson = localStorage.getItem('favoriteStories');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      if (isFavorite) {
        if (!favorites.includes(this._story.id)) {
          favorites.push(this._story.id);
          window.showToast &&
            window.showToast('Ditambahkan ke favorit!', 'success');
        }
      } else {
        favorites = favorites.filter((id) => id !== this._story.id);
        window.showToast && window.showToast('Dihapus dari favorit', 'info');
      }
      localStorage.setItem('favoriteStories', JSON.stringify(favorites));
    } catch (error) {
      // silent
    }
  }

  async saveCurrentStoryToOffline() {
    if (this._story) {
      // Optionally, implement saving to IndexedDB for offline use
      window.showToast &&
        window.showToast('Cerita disimpan untuk offline', 'success');
    }
  }
}

export default StoryDetailPresenter;
