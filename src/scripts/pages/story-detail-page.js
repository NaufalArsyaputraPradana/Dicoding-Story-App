import '../components/header';
import '../components/loader';
import '../components/footer';
import '../components/sidebar';
import { showFormattedDate } from '../utils/index';
import StoryDetailPresenter from '../presenter/story-detail-presenter';
import { isOnline } from '../utils/index';

export default class StoryDetailPage {
  constructor() {
    const { id } = this._getUrlParams();
    this._id = id;
    this._presenter = new StoryDetailPresenter({
      view: this,
      id: this._id,
    });
    this._mapContainer = null;
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
              <i class="fas fa-wifi-slash"></i> You are currently offline. 
              Some features may be limited.
            </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `;
  }

  async afterRender() {
    this._presenter.init();
  }

  renderStoryDetail(story) {
    const storyContent = document.querySelector('#story-content');
    if (!story || !storyContent) return;

    // Ensure story properties exist or use defaults
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

    // Generate consistent color from story name
    const userColor = this._getUserColor(storyName);
    const storyTitleId = `story-title-${story.id}`;
    const storyDescId = `story-desc-${story.id}`;

    // Check if the story is in favorites
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
              <button id="favorite-button" class="icon-button ${isFavorite ? 'active' : ''}" aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}" aria-hidden="true"></i>
              </button>
              
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
                    <div class="story-map-large" id="detail-map" tabindex="0" 
                         aria-label="Map showing the location of ${storyName}'s story"></div>
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
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              Share Your Story
            </a>
          </div>
        </div>
      </article>
    `;

    if (story.lat && story.lon) {
      this._mapContainer = document.getElementById('detail-map');
    }

    // Setup favorite button
    this._setupFavoriteButton(isFavorite);
  }

  getMapContainer() {
    return this._mapContainer;
  }

  showLoading() {
    const loader = document.querySelector('app-loader');
    if (loader) loader.show('Loading story...');
  }

  hideLoading() {
    const loader = document.querySelector('app-loader');
    if (loader) loader.hide();
  }

  showOfflineMessage() {
    const offlineNotice = document.getElementById('offline-notice');
    if (offlineNotice) {
      offlineNotice.classList.remove('hidden');
    }
  }

  hideOfflineMessage() {
    const offlineNotice = document.getElementById('offline-notice');
    if (offlineNotice) {
      offlineNotice.classList.add('hidden');
    }
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
      offlineNotice.style.backgroundColor = '#f8961e'; // warning color
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
    // Gunakan regex untuk mengekstrak ID dari URL
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
      .substring(0, 2); // Limit to 2 characters
  }

  _getUserColor(name) {
    // Generate consistent color based on user name
    const colors = [
      '#4361ee', // primary
      '#3f37c9', // secondary
      '#4895ef', // accent
      '#4cc9f0', // success
      '#f72585', // danger
      '#7209b7', // purple
      '#3a0ca3', // indigo
      '#4cc9f0', // blue
      '#f72585', // pink
      '#f8961e', // orange
    ];

    // Simple hash function to get consistent color for same name
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

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
      // Toggle state
      const currentState = favoriteButton.classList.contains('active');
      const newState = !currentState;

      // Update UI
      if (newState) {
        favoriteButton.classList.add('active');
        favoriteButton.setAttribute('aria-label', 'Remove from favorites');
      } else {
        favoriteButton.classList.remove('active');
        favoriteButton.setAttribute('aria-label', 'Add to favorites');
      }

      // Notify presenter
      if (this._favoriteCallback) {
        this._favoriteCallback(newState);
      }
    });
  }

  setFavoriteButtonCallback(callback) {
    this._favoriteCallback = callback;
  }

  showShareButton() {
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
      shareButton.classList.remove('hidden');
    }
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

    // Add animation
    article.style.transition = 'all 0.5s ease-out';
    article.style.opacity = '0';
    article.style.transform = 'scale(0.9)';

    // Call callback after animation completes
    setTimeout(() => {
      if (callback) callback();
    }, 500);
  }

  cancelRemovalAnimation() {
    const article = document.getElementById('story-article');
    if (!article) return;

    // Restore visibility
    article.style.opacity = '1';
    article.style.transform = 'scale(1)';
  }
}
