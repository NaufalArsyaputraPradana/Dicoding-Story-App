import '../components/sidebar';
import '../components/header';
import '../components/footer';

export default class NotFoundPage {
  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container not-found">
          <h1 class="page-title">404 - Halaman Tidak Ditemukan</h1>
          <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
          <a href="#/" class="btn btn-primary">
            <i class="fas fa-home" aria-hidden="true"></i>
            Kembali ke Beranda
          </a>
        </section>
      </main>
      <app-footer></app-footer>
    `;
  }

  async afterRender() {
    // No additional logic
  }
}
