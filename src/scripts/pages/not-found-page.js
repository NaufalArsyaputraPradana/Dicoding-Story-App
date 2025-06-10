import '../components/sidebar';
import '../components/header';
import '../components/footer';

export default class NotFoundPage {
  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container not-found text-center" aria-labelledby="not-found-title">
          <h1 class="page-title" id="not-found-title">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            404 - Halaman Tidak Ditemukan
          </h1>
          <p class="mb-2">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
          <a href="#/" class="btn btn-primary back-link" aria-label="Kembali ke Beranda">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
          <div class="mt-2">
            <button class="btn btn-secondary" id="reload-btn" aria-label="Muat ulang halaman">
              <i class="fas fa-sync-alt"></i> Muat Ulang
            </button>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `;
  }

  async afterRender() {
    // Fokus otomatis ke main content untuk aksesibilitas
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      setTimeout(() => mainContent.focus(), 200);
    }

    // Tombol reload
    const reloadBtn = document.getElementById('reload-btn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => window.location.reload());
    }
  }
}
