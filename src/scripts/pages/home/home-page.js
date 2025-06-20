import '../../components/header';
import '../../components/card';
import '../../components/loader';
import '../../components/footer';
import '../../components/sidebar';
import { debounce } from '../../utils/index';
import HomePresenter from './home-presenter';

export default class HomePage {
  constructor() {
    this._presenter = new HomePresenter({ view: this });
    this._debouncedScroll = debounce(this._handleScroll.bind(this), 200);
  }

  renderPage() {
    this._setupInfiniteScroll();
    this._setupOfflineListener();
  }

  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <h1 class="page-title">
            <i class="fas fa-book-open" aria-hidden="true"></i>
            Latest Stories
          </h1>
          <div class="filter-container mb-2">
            <label for="include-location" class="filter-label">
              <input type="checkbox" id="include-location" name="include-location">
              <span class="ml-1">Show stories with location only</span>
            </label>
          </div>
          <div id="stories-list" class="stories-list"></div>
          <div id="loading-more" class="hidden">
            <div class="spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
          </div>
          <button id="load-more" class="load-more" aria-label="Load more stories">
            <i class="fas fa-arrow-down" aria-hidden="true"></i>
            Load More
          </button>
          <div id="empty-state" class="empty-state hidden">
            <i class="fas fa-inbox fa-3x"></i>
            <p>No stories found. Be the first to share your experience!</p>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `;
  }

  async afterRender() {
    this._presenter.init();
    this._setupAccessibility();
  }

  setLoadMoreCallback(callback) {
    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', callback);
    }
  }

  setLocationFilterCallback(callback) {
    const locationFilter = document.getElementById('include-location');
    if (locationFilter) {
      locationFilter.addEventListener('change', (event) => {
        callback(event.target.checked);
      });
    }
  }

  _setupInfiniteScroll() {
    window.addEventListener('scroll', this._debouncedScroll);
  }

  _handleScroll() {
    const loadMoreButton = document.getElementById('load-more');
    if (
      !loadMoreButton ||
      loadMoreButton.style.display === 'none' ||
      loadMoreButton.disabled
    ) {
      return;
    }
    const scrollY = window.scrollY;
    const visible = document.documentElement.clientHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const bottomOfPage = visible + scrollY >= pageHeight - 100;
    if (bottomOfPage) {
      loadMoreButton.click();
    }
  }

  _setupOfflineListener() {
    window.addEventListener('online', () => {
      this._presenter.init();
    });
  }

  _setupAccessibility() {
    // Fokus otomatis ke main content saat halaman dimuat
    const mainContent = document.getElementById('main-content');
    if (mainContent) setTimeout(() => mainContent.focus(), 200);

    // Skip link support (aksesibilitas)
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function (event) {
        event.preventDefault();
        if (mainContent) {
          skipLink.blur();
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  showLoading() {
    document.querySelector('app-loader')?.show('Loading stories...');
  }

  hideLoading() {
    document.querySelector('app-loader')?.hide();
  }

  showLoadingMore() {
    document.getElementById('loading-more')?.classList.remove('hidden');
  }

  hideLoadingMore() {
    document.getElementById('loading-more')?.classList.add('hidden');
  }

  clearStories() {
    const storiesList = document.getElementById('stories-list');
    if (storiesList) storiesList.innerHTML = '';
    document.getElementById('empty-state')?.classList.add('hidden');
  }

  renderStories(stories) {
    const storiesList = document.getElementById('stories-list');
    if (!storiesList) return;
    if (!stories || !Array.isArray(stories)) {
      console.error('Invalid stories data:', stories);
      return;
    }
    const validStories = stories.filter(
      (story) => story && typeof story === 'object'
    );
    validStories.forEach((story, index) => {
      try {
        const card = document.createElement('app-card');
        card.story = story;
        storiesList.appendChild(card);
        // Animasi masuk card
        if (
          window.matchMedia('(prefers-reduced-motion: no-preference)').matches
        ) {
          card.animate(
            [
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 300,
              easing: 'ease-out',
              delay: index * 50,
            }
          );
        }
      } catch (error) {
        console.error('Error rendering story card:', error, { story });
      }
    });
  }

  appendStories(stories) {
    const storiesList = document.getElementById('stories-list');
    if (!storiesList) return;
    if (!stories || !Array.isArray(stories)) {
      console.error('Invalid stories data:', stories);
      return;
    }
    const validStories = stories.filter(
      (story) => story && typeof story === 'object'
    );
    if (validStories.length === 0) {
      console.warn('No valid stories to append');
      return;
    }
    validStories.forEach((story, index) => {
      try {
        const card = document.createElement('app-card');
        card.story = story;
        storiesList.appendChild(card);
        if (
          window.matchMedia('(prefers-reduced-motion: no-preference)').matches
        ) {
          card.animate(
            [
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 300,
              easing: 'ease-out',
              delay: index * 50,
            }
          );
        }
      } catch (error) {
        console.error('Error appending story card:', error, { story });
      }
    });
  }

  updateLoadMoreButton(hasMore) {
    const loadMoreButton = document.getElementById('load-more');
    if (!loadMoreButton) return;
    if (hasMore) {
      loadMoreButton.style.display = 'flex';
      loadMoreButton.disabled = false;
    } else {
      loadMoreButton.style.display = 'none';
      loadMoreButton.disabled = true;
    }
  }

  showEmptyState() {
    document.getElementById('empty-state')?.classList.remove('hidden');
    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) loadMoreButton.style.display = 'none';
  }

  showLoginRequired() {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'You need to login to view stories',
      confirmButtonText: 'Login Now',
      confirmButtonColor: '#4361ee',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.hash = '#/login';
      }
    });
  }

  showOfflineMessage() {
    window.showToast &&
      window.showToast(
        'Anda sedang offline. Menampilkan data tersimpan.',
        'info'
      );
  }

  showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message || 'Failed to load stories',
      confirmButtonColor: '#4361ee',
    });
  }
}
