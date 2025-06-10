import '../components/header';
import '../components/sidebar';
import '../components/footer';
import '../components/loader';
import '../components/card';
import routes from '../routes/routes';
import { getActiveRoute, parseActivePathname } from '../routes/url-parser';

class App {
  #content = null;
  #activePresenter = null;
  #previousRoute = null;

  constructor({ content }) {
    this.#content = content;

    // Sidebar logout event (global handler)
    document.addEventListener('user-logout', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.showToast?.('Logout berhasil', 'success');
      window.location.hash = '#/login';
      this.#updateSidebar();
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const { resource, id, isAddPage } = parseActivePathname();

    this.#cleanupPreviousPage();
    this.#setDocumentTitle(resource, id);

    // Special handling for Add Story page (with right transition)
    if (isAddPage) {
      await this.#renderWithTransition(
        async () => {
          const page = new routes['#/stories/add']();
          this.#content.innerHTML = await page.render();
          await page.afterRender?.();
          if (page._presenter) this.#activePresenter = page._presenter;
          this.#previousRoute = url;
          this.#updateSidebar();
        },
        { direction: 'right' }
      );
      return;
    }

    // Other pages (left transition)
    const PageClass = routes[url] || routes['#/404'];
    await this.#renderWithTransition(
      async () => {
        const page = new PageClass();
        this.#content.innerHTML = await page.render();
        await page.afterRender?.();
        if (page._presenter) this.#activePresenter = page._presenter;
        this.#previousRoute = url;
        this.#updateSidebar();
      },
      { direction: 'left' }
    );
  }

  async #renderWithTransition(renderFn, { direction = 'left' } = {}) {
    this.#showLoading();
    try {
      await document.startViewTransition(async () => {
        await renderFn();
        // Animate main content for better UX
        if (
          window.matchMedia('(prefers-reduced-motion: no-preference)').matches
        ) {
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.animate(
              direction === 'right'
                ? [
                    { transform: 'translateX(100%)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 },
                  ]
                : [
                    { transform: 'translateX(-50px)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 },
                  ],
              { duration: 300, easing: 'ease-out' }
            );
          }
        }
      }).finished;
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#showErrorPage();
    } finally {
      this.#hideLoading();
    }
  }

  #cleanupPreviousPage() {
    // Stop camera if leaving Add Story page
    if (
      this.#previousRoute === '#/stories/add' &&
      this.#activePresenter?.stopCamera
    ) {
      this.#activePresenter.stopCamera();
    }
    this.#activePresenter = null;
  }

  #setDocumentTitle(resource, id) {
    const titles = {
      stories: id ? 'Story Details' : 'Add Story',
      login: 'Login',
      register: 'Register',
      about: 'About',
      default: 'Home',
    };
    document.title = `Dicoding Story | ${titles[resource] || titles.default}`;
  }

  #showLoading() {
    document.querySelector('app-loader')?.show();
  }

  #hideLoading() {
    document.querySelector('app-loader')?.hide();
  }

  #showErrorPage() {
    this.#content.innerHTML = `
      <app-sidebar></app-sidebar>
      <section class="container">
        <h1 class="page-title">Error</h1>
        <p>Gagal memuat halaman. Silakan coba lagi.</p>
        <div class="flex gap-2 mt-3">
          <a href="#/" class="back-link">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
          <button onclick="window.location.reload()" class="back-link" style="background-color: var(--danger)">
            <i class="fas fa-sync-alt"></i>
            Muat Ulang
          </button>
        </div>
      </section>
    `;
  }

  #updateSidebar() {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      if (token && userData && userData !== 'undefined') {
        try {
          window.dispatchEvent(
            new CustomEvent('user-login-state-changed', {
              detail: { isLoggedIn: true, userData: JSON.parse(userData) },
            })
          );
        } catch {
          localStorage.removeItem('user');
          const defaultUserData = { name: 'User', email: '' };
          localStorage.setItem('user', JSON.stringify(defaultUserData));
          window.dispatchEvent(
            new CustomEvent('user-login-state-changed', {
              detail: { isLoggedIn: true, userData: defaultUserData },
            })
          );
        }
      } else {
        window.dispatchEvent(
          new CustomEvent('user-login-state-changed', {
            detail: { isLoggedIn: false, userData: null },
          })
        );
      }
    } catch (error) {
      console.error('Error updating sidebar:', error);
    }
  }
}

export default App;
