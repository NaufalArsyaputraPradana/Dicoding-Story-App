import '../../components/header';
import '../../components/loader';
import '../../components/footer';
import '../../components/sidebar';
import { showFormattedDate } from '../../utils/index';
import StoryDetailPresenter from './story-detail-presenter';
import IdbHelper from '../../idb';

export default class StoryDetailPage {
  constructor() {
    const { id } = this._getUrlParams();
    this._id = id;
    this._presenter = new StoryDetailPresenter({
      view: this,
      id: this._id,
    });
    this._mapContainer = null;
    this._favoriteCallback = null;
    this._story = null;
  }

  renderPage() {
    if (!this._id) {
      this.showInvalidIdError();
      return;
    }
  }

  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <div id="story-content">
            <div class="loading-placeholder">
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-picture"></div>
                  <div class="ph-row">
                    <div class="ph-col-4"></div>
                    <div class="ph-col-8 empty"></div>
                    <div class="ph-col-6"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12"></div>
                    <div class="ph-col-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="offline-notice" class="offline-notice mt-2 hidden">
            <i class="fas fa-wifi-slash"></i> You are currently offline. Some features may be limited.
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `;
  }

  async afterRender() {
    this._presenter.init();

    // Save to favorites (fallback if presenter doesn't handle)
    const saveBtn = document.getElementById('save-story-button');
    if (saveBtn && this._story) {
      saveBtn.addEventListener('click', async () => {
        await IdbHelper.addToFavorites(this._story);
        window.showToast &&
          window.showToast('Cerita disimpan ke halaman Favorit!', 'success');
      });
    }
  }

  renderStoryDetail(story) {
    this._story = story;
    const storyContent = document.querySelector('#story-content');
    if (!story || !storyContent) return;

    const storyName = story.name || 'Unknown User';
    const storyDescription = story.description || 'No description provided';
    const storyPhoto = story.photoUrl || './images/placeholder.jpg';
    const storyCreatedAt = story.createdAt || new Date().toISOString();

    const formattedDate = showFormattedDate(storyCreatedAt, 'id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const userColor = this._getUserColor(storyName);
    const storyTitleId = `story-title-${story.id}`;
    const storyDescId = `story-desc-${story.id}`;
    const isFavorite = this._isInFavorites(story.id);

    storyContent.innerHTML = `
      <article class="story-detail-item" id="story-article" aria-labelledby="${storyTitleId}">
        <div class="story-image-wrapper">
          <img 
            class="story-detail-image" 
            src="${storyPhoto}" 
            alt="Photo shared by ${storyName}" 
            loading="lazy"
            onerror="this.src='./images/placeholder.jpg'"
          >
          <div class="story-image-overlay">
            <div class="story-image-badge" style="background-color: ${userColor}">
              <i class="fas fa-camera-retro" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="story-detail-content">
          <div class="story-header">
            <div class="story-user">
              <div class="user-avatar" aria-hidden="true" style="background-color: ${userColor}">
                ${this._getInitials(storyName)}
              </div>
              <div>
                <h1 class="story-name" id="${storyTitleId}">${storyName}</h1>
                <time class="story-date" datetime="${storyCreatedAt}">
                  <i class="far fa-calendar-alt" aria-hidden="true"></i> ${formattedDate}
                </time>
              </div>
            </div>
            <div class="story-actions-top">
              <button id="share-button" class="icon-button hidden" aria-label="Share this story">
                <i class="fas fa-share-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="story-body">
            <p class="story-description" id="${storyDescId}">${storyDescription}</p>
          </div>
          ${
            story.lat && story.lon
              ? `
                <div class="story-location">
                  <h2 class="section-title">
                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    Location
                  </h2>
                  <div class="story-map-container">
                    <div class="story-map-large" id="detail-map" tabindex="0" aria-label="Map showing the location of ${storyName}'s story"></div>
                  </div>
                  <p class="map-instructions">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    You can switch between different map styles using the layer control in the top right.
                  </p>
                </div>
              `
              : ''
          }
          <div class="story-actions mt-3">
            <a href="#/" class="back-link" aria-label="Back to stories list">
              <i class="fas fa-arrow-left" aria-hidden="true"></i>
              Back to Stories
            </a>
            <a href="#/stories/add" class="action-button" aria-label="Share your own story">
              <i class="fas fa-plus-circle"></i>
              Share Your Story
            </a>
          </div>
        </div>
      </article>
    `;

    if (story.lat && story.lon) {
      this._mapContainer = document.getElementById('detail-map');
    }

    this._setupFavoriteButton(isFavorite);

    // Tampilkan tombol share jika Web Share API tersedia
    if (navigator.share) {
      this.showShareButton();
      this.setShareButtonCallback(async () => {
        try {
          await navigator.share({
            title: `Cerita dari ${storyName}`,
            text: storyDescription,
            url: window.location.href,
          });
          window.showToast &&
            window.showToast('Cerita berhasil dibagikan!', 'success');
        } catch (error) {
          if (error.name !== 'AbortError') {
            window.showToast &&
              window.showToast('Gagal membagikan cerita', 'error');
          }
        }
      });
    }
  }

  getMapContainer() {
    return this._mapContainer;
  }

  showLoading() {
    document.querySelector('app-loader')?.show('Loading story...');
  }

  hideLoading() {
    document.querySelector('app-loader')?.hide();
  }

  showOfflineMessage() {
    document.getElementById('offline-notice')?.classList.remove('hidden');
  }

  hideOfflineMessage() {
    document.getElementById('offline-notice')?.classList.add('hidden');
  }

  showOfflineNoDataMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Offline',
      text: 'This story is not available offline. Please connect to the internet and try again.',
      confirmButtonColor: '#4361ee',
    }).then(() => {
      window.location.hash = '#/';
    });
  }

  showLoginRequired() {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login to view story details',
      confirmButtonText: 'Login Now',
      confirmButtonColor: '#4361ee',
    }).then(() => {
      window.location.hash = '#/login';
    });
  }

  showInvalidIdError() {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Story ID',
      text: 'The story ID is missing or invalid',
      confirmButtonColor: '#4361ee',
    }).then(() => {
      window.location.hash = '#/';
    });
  }

  showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message || 'Failed to load story',
      confirmButtonColor: '#4361ee',
    }).then(() => {
      window.location.hash = '#/';
    });
  }

  showTimeoutError() {
    const offlineNotice = document.getElementById('offline-notice');
    if (offlineNotice) {
      offlineNotice.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i> 
        Server response is slow. Showing cached data if available.
      `;
      offlineNotice.classList.remove('hidden');
      offlineNotice.style.backgroundColor = '#f8961e';
    }
    Swal.fire({
      icon: 'warning',
      title: 'Connection Issue',
      text: "The server is taking too long to respond. We'll try to show cached data if available.",
      confirmButtonColor: '#4361ee',
      showCancelButton: true,
      cancelButtonText: 'Back to Home',
      confirmButtonText: 'Continue with Cache',
    }).then((result) => {
      if (!result.isConfirmed) {
        window.location.hash = '#/';
      }
    });
  }

  showMapError() {
    const mapContainer = document.querySelector('.story-map-container');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-error-container">
          <div class="map-error-message">
            <i class="fas fa-map-marked-alt"></i>
            <p>Failed to load map. Please try refreshing the page.</p>
          </div>
        </div>
      `;
    }
  }

  _getUrlParams() {
    const hash = window.location.hash;
    const match = hash.match(/#\/stories\/([^/]+)$/);
    return { id: match ? match[1] : null };
  }

  _getInitials(name) {
    if (!name || typeof name !== 'string') return 'U';
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  _getUserColor(name) {
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
    const hash = name
      .split('')
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return colors[Math.abs(hash) % colors.length];
  }

  _isInFavorites(storyId) {
    try {
      const favoritesJson = localStorage.getItem('favoriteStories');
      if (!favoritesJson) return false;
      const favorites = JSON.parse(favoritesJson);
      return Array.isArray(favorites) && favorites.includes(storyId);
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  }

  _setupFavoriteButton(initialState) {
    const favoriteButton = document.getElementById('favorite-button');
    if (!favoriteButton) return;
    favoriteButton.addEventListener('click', () => {
      const currentState = favoriteButton.classList.contains('active');
      const newState = !currentState;
      if (newState) {
        favoriteButton.classList.add('active');
        favoriteButton.setAttribute('aria-label', 'Remove from favorites');
      } else {
        favoriteButton.classList.remove('active');
        favoriteButton.setAttribute('aria-label', 'Add to favorites');
      }
      if (this._favoriteCallback) {
        this._favoriteCallback(newState);
      }
      // Simpan ke localStorage
      try {
        const favoritesJson = localStorage.getItem('favoriteStories');
        let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
        if (newState) {
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
        console.error('Error updating favorites:', error);
      }
    });
  }

  setFavoriteButtonCallback(callback) {
    this._favoriteCallback = callback;
  }

  showShareButton() {
    document.getElementById('share-button')?.classList.remove('hidden');
  }

  setShareButtonCallback(callback) {
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
      shareButton.addEventListener('click', callback);
    }
  }

  animateRemoval(callback) {
    const article = document.getElementById('story-article');
    if (!article) {
      if (callback) callback();
      return;
    }
    article.style.transition = 'all 0.5s ease-out';
    article.style.opacity = '0';
    article.style.transform = 'scale(0.9)';
    setTimeout(() => {
      if (callback) callback();
    }, 500);
  }

  cancelRemovalAnimation() {
    const article = document.getElementById('story-article');
    if (!article) return;
    article.style.opacity = '1';
    article.style.transform = 'scale(1)';
  }
}
