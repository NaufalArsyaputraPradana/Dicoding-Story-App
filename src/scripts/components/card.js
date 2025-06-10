import { showFormattedDate, truncateText, getInitials } from '../utils/index';
import CONFIG from '../config';
// Tambahkan import IdbHelper
import IdbHelper from '../idb';

class AppCard extends HTMLElement {
  set story(data) {
    this._story = data;
    this.render();
  }

  render() {
    if (!this._story) return;

    try {
      const story = {
        id: this._story.id || `unknown-${Date.now()}`,
        name: this._story.name || 'Unknown User',
        description: this._story.description || 'No description provided',
        photoUrl: this._story.photoUrl || './images/placeholder.jpg',
        createdAt: this._story.createdAt || new Date().toISOString(),
        lat: this._story.lat,
        lon: this._story.lon,
      };

      const formattedDate = showFormattedDate(story.createdAt, 'id-ID');
      const titleId = `story-title-${story.id}`;
      const descId = `story-desc-${story.id}`;
      const userColor = getUserColor(story.name);

      // Check if story is saved in favorites (localStorage)
      let isSaved = false;
      try {
        const favoritesJson = localStorage.getItem('favoriteStories');
        if (favoritesJson) {
          const favorites = JSON.parse(favoritesJson);
          isSaved = Array.isArray(favorites) && favorites.includes(story.id);
        }
      } catch {
        isSaved = false;
      }

      this.innerHTML = `
        <article class="story-item" aria-labelledby="${titleId}" aria-describedby="${descId}">
          <div class="story-image-container">
            <div class="story-badge" style="background-color: ${userColor}">
              <i class="fas fa-camera" aria-hidden="true"></i>
            </div>
            <img 
              class="story-image" 
              src="${story.photoUrl}" 
              alt="Photo shared by ${story.name}" 
              loading="lazy"
              onerror="this.src='./images/placeholder.jpg'"
            >
          </div>
          <div class="story-content">
            <div class="story-header">
              <div class="story-user">
                <div class="user-avatar" aria-hidden="true" style="background-color: ${userColor}">
                  ${getInitials(story.name)}
                </div>
                <div>
                  <h3 class="story-name" id="${titleId}">${story.name}</h3>
                  <time class="story-date" datetime="${story.createdAt}">
                    <i class="far fa-calendar-alt" aria-hidden="true"></i> ${formattedDate}
                  </time>
                </div>
              </div>
              ${
                story.lat && story.lon
                  ? `<div class="story-location-badge" title="Has location data">
                      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    </div>`
                  : ''
              }
            </div>
            <p class="story-description" id="${descId}">${truncateText(story.description, 120)}</p>
            ${
              story.lat && story.lon
                ? `<div class="story-map" id="map-${story.id}" aria-label="Location of story by ${story.name}" tabindex="0"></div>`
                : ''
            }
            <div class="story-actions">
              <a href="#/stories/${story.id}" class="story-link" aria-label="Read full story by ${story.name}">
                <i class="fas fa-book-reader" aria-hidden="true"></i>
                Read Full Story
              </a>
              <button 
                class="save-story-btn${isSaved ? ' saved' : ''}" 
                aria-label="${isSaved ? 'Saved' : 'Save to favorites'}"
                title="${isSaved ? 'Saved' : 'Save to favorites'}"
              >
                <i class="fas fa-bookmark"></i>
                <span>${isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </article>
      `;

      // Save button logic
      const saveBtn = this.querySelector('.save-story-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          let favorites = [];
          try {
            const favoritesJson = localStorage.getItem('favoriteStories');
            favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
          } catch {
            favorites = [];
          }
          const alreadySaved = favorites.includes(story.id);
          if (!alreadySaved) {
            favorites.push(story.id);
            localStorage.setItem('favoriteStories', JSON.stringify(favorites));
            saveBtn.classList.add('saved');
            saveBtn.setAttribute('aria-label', 'Saved');
            saveBtn.title = 'Saved';
            saveBtn.querySelector('span').textContent = 'Saved';
            // Tambahkan ke IndexedDB
            try {
              await IdbHelper.addToFavorites(story);
            } catch (err) {
              // Optional: tampilkan error jika gagal simpan ke IndexedDB
              window.showToast?.('Gagal menyimpan ke database lokal', 'error');
            }
            window.showToast?.('Cerita disimpan ke Favorit!', 'success');
          } else {
            // Optional: allow unsave
            favorites = favorites.filter((id) => id !== story.id);
            localStorage.setItem('favoriteStories', JSON.stringify(favorites));
            saveBtn.classList.remove('saved');
            saveBtn.setAttribute('aria-label', 'Save to favorites');
            saveBtn.title = 'Save to favorites';
            saveBtn.querySelector('span').textContent = 'Save';
            // Hapus dari IndexedDB
            try {
              await IdbHelper.removeFromFavorites(story.id);
            } catch (err) {
              window.showToast?.(
                'Gagal menghapus dari database lokal',
                'error'
              );
            }
            window.showToast?.('Cerita dihapus dari Favorit', 'info');
          }
        });
      }

      // Render map if location exists
      if (story.lat && story.lon) {
        requestAnimationFrame(() => this.renderMap());
      }
    } catch (error) {
      this.innerHTML = `
        <article class="story-item">
          <div class="story-content">
            <div class="story-header">
              <div class="story-user">
                <div class="user-avatar" style="background-color: #4361ee">U</div>
                <div>
                  <h3 class="story-name">Story data error</h3>
                  <time class="story-date">Unknown date</time>
                </div>
              </div>
            </div>
            <p class="story-description">There was an error rendering this story. Please try refreshing the page.</p>
            <div class="story-actions">
              <a href="#/" class="story-link">
                <i class="fas fa-home" aria-hidden="true"></i>
                Back to Home
              </a>
            </div>
          </div>
        </article>
      `;
    }
  }

  renderMap() {
    try {
      if (!this._story) return;
      const lat = parseFloat(this._story.lat);
      const lon = parseFloat(this._story.lon);
      if (isNaN(lat) || isNaN(lon)) return;

      const storyId = this._story.id || `unknown-${Date.now()}`;
      const storyName = this._story.name || 'Unknown User';
      const storyDescription = this._story.description || '';
      const mapElement = this.querySelector(`#map-${storyId}`);
      if (!mapElement || !window.L) return;

      const map = L.map(mapElement, {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      }).setView([lat, lon], 13);

      L.tileLayer(CONFIG.MAP_TILE_LAYERS.osm.url, { maxZoom: 19 }).addTo(map);

      const userColor = getUserColor(storyName);
      const customIcon = L.divIcon({
        html: `<div style="background-color: ${userColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-map-marker-alt"></i>
              </div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div class="map-popup">
            <b>${storyName}</b>
            <p>${truncateText(storyDescription, 50)}...</p>
            <a href="#/stories/${storyId}" class="popup-link">View Details</a>
          </div>`,
          { className: 'custom-popup', closeButton: false }
        )
        .openPopup();

      map.on('click', () => {
        window.location.hash = `#/stories/${storyId}`;
      });

      mapElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          window.location.hash = `#/stories/${storyId}`;
        }
      });
    } catch (error) {
      // Silent fail for map
    }
  }

  connectedCallback() {
    try {
      if (
        'IntersectionObserver' in window &&
        window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      ) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.classList.add('visible');
                observer.unobserve(this);
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(this);
      } else {
        this.classList.add('visible');
      }
    } catch {
      this.classList.add('visible');
    }
  }
}

customElements.define('app-card', AppCard);

// Helper functions
function getUserColor(name) {
  const colors = [
    '#4361ee',
    '#3f37c9',
    '#4895ef',
    '#4cc9f0',
    '#f72585',
    '#7209b7',
    '#3a0ca3',
    '#f8961e',
    '#fb5607',
    '#80b918',
  ];
  if (!name || typeof name !== 'string') return colors[0];
  const hash = name
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  return colors[Math.abs(hash) % colors.length];
}
