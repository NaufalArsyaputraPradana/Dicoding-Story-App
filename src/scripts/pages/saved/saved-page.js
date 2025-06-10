import IdbHelper from '../../idb';
import { getAccessToken } from '../../utils/auth.js';

export default class SavedPage {
  constructor() {
    this._title = 'Cerita Favorit - DicoStory';
  }

  async render() {
    document.title = this._title;
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="favorites-page page-transition">
          <div class="coordinator-layout">
            <div class="coordinator-header">
              <div>
                <h2 class="coordinator-title text-gradient">
                  <i class="fas fa-heart"></i> Cerita Favorit
                </h2>
                <p class="subtitle">Kumpulan cerita yang Anda tandai sebagai favorit</p>
              </div>
              <a href="#/" class="btn btn-secondary animated-underline">
                <i class="fas fa-arrow-left"></i> Kembali ke Beranda
              </a>
            </div>
            <div id="favorites-container" class="coordinator-grid fade-in-up">
              <div class="loader" id="favorites-loader"></div>
            </div>
            <div id="error-container" class="error-container hidden"></div>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `;
  }

  async afterRender() {
    // Aksesibilitas: fokus otomatis ke main content
    const mainContent = document.getElementById('main-content');
    if (mainContent) setTimeout(() => mainContent.focus(), 200);

    // Cek login
    if (!getAccessToken()) {
      window.location.hash = '#/login';
      return;
    }
    this.showLoading();
    try {
      const favorites = await IdbHelper.getFavorites();
      this.renderFavorites(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.showError(
        'Gagal memuat cerita favorit: ' + (error.message || 'Unknown error')
      );
    }
  }

  showLoading() {
    document.getElementById('favorites-loader')?.classList.remove('hidden');
    document.getElementById('error-container')?.classList.add('hidden');
  }

  hideLoading() {
    document.getElementById('favorites-loader')?.classList.add('hidden');
  }

  async renderFavorites(favorites) {
    this.hideLoading();
    const favoritesContainer = document.getElementById('favorites-container');
    if (!favoritesContainer) return;

    if (!favorites || favorites.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="empty-state text-center fade-in-up">
          <img src="./images/empty-favorite.svg" alt="Tidak ada favorit" style="max-width:120px; margin-bottom:1rem;opacity:.85;">
          <h3 class="mb-1">Belum ada cerita favorit</h3>
          <p class="mb-2">Tandai cerita yang Anda sukai agar mudah ditemukan di sini.</p>
          <a href="#/" class="btn btn-primary gradient-border">
            <i class="fas fa-compass"></i> Jelajahi Cerita
          </a>
        </div>
      `;
      return;
    }

    favoritesContainer.innerHTML = '';
    favorites.forEach((story, idx) => {
      // Gunakan app-card agar konsisten dengan home
      const card = document.createElement('app-card');
      card.story = story;
      card.classList.add('glass', 'fade-in-up');
      card.style.animationDelay = `${idx * 60}ms`;

      // Tambahkan badge "Favorit" di pojok atas card
      card.addEventListener('DOMSubtreeModified', function injectBadge() {
        const header = card.querySelector('.story-header');
        if (header && !card.querySelector('.badge-favorite')) {
          const badge = document.createElement('span');
          badge.className = 'badge badge-favorite';
          badge.innerHTML = `<i class="fas fa-heart"></i> Favorit`;
          badge.style.marginLeft = '0.5em';
          header.appendChild(badge);
          card.removeEventListener('DOMSubtreeModified', injectBadge);
        }
      });

      // Tambahkan tombol hapus favorit di dalam card (kanan bawah)
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-favorite-btn gradient-border';
      removeBtn.innerHTML = `<i class="fas fa-trash"></i> Hapus`;
      removeBtn.setAttribute('aria-label', 'Hapus dari favorit');
      removeBtn.title = 'Hapus dari favorit';
      removeBtn.style.marginLeft = 'auto';

      // Event hapus
      removeBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await IdbHelper.removeFromFavorites(story.id);

        // Sinkronkan localStorage
        try {
          const favoritesJson = localStorage.getItem('favoriteStories');
          let favoritesArr = favoritesJson ? JSON.parse(favoritesJson) : [];
          favoritesArr = favoritesArr.filter((id) => id !== story.id);
          localStorage.setItem('favoriteStories', JSON.stringify(favoritesArr));
        } catch {}

        // Animasi hapus
        card.style.transition = 'all 0.4s cubic-bezier(.4,0,.2,1)';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97) translateY(20px)';
        setTimeout(() => card.remove(), 400);

        const remainingFavorites = await IdbHelper.getFavorites();
        if (remainingFavorites.length === 0) this.renderFavorites([]);
        window.showToast?.('Cerita dihapus dari Favorit', 'info');
      });

      // Sisipkan tombol hapus ke dalam .story-actions di card
      card.addEventListener('DOMSubtreeModified', function injectRemoveBtn() {
        const actions = card.querySelector('.story-actions');
        if (actions && !actions.querySelector('.remove-favorite-btn')) {
          actions.appendChild(removeBtn);
          card.removeEventListener('DOMSubtreeModified', injectRemoveBtn);
        }
      });

      favoritesContainer.appendChild(card);
    });
  }

  showError(message) {
    this.hideLoading();
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) return;
    errorContainer.classList.remove('hidden');
    errorContainer.innerHTML = `
      <div class="error-content text-center fade-in-up">
        <i class="fas fa-exclamation-triangle fa-3x mb-2"></i>
        <h3>Gagal memuat cerita favorit</h3>
        <p>${message}</p>
        <button id="retry-button" class="btn btn-primary mt-2 gradient-border">Coba Lagi</button>
      </div>
    `;
    document
      .getElementById('retry-button')
      ?.addEventListener('click', async () => {
        this.showLoading();
        try {
          const favorites = await IdbHelper.getFavorites();
          this.renderFavorites(favorites);
        } catch (error) {
          this.showError(
            'Gagal memuat cerita favorit: ' + (error.message || 'Unknown error')
          );
        }
      });
  }

  _truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  _formatDate(dateString) {
    if (!dateString) return '-';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }
}
