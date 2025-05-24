import routes from './routes/routes';
import { getActiveRoute, parseActivePathname } from './routes/url-parser';
import CONFIG from './config';

class App {
  #content = null;
  #activePresenter = null;
  #previousRoute = null;

  constructor({ content }) {
    this.#content = content;

    // Add event listener for sidebar logout
    document.addEventListener('user-logout', () => {
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Show toast message
      window.showToast('Logout berhasil', 'success');

      // Redirect to login page
      window.location.hash = '#/login';
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const { resource, id, isAddPage } = parseActivePathname();

    // Clean up resources of previous page
    this.#cleanupPreviousPage();

    // Handle "Add Story" page separately
    if (isAddPage) {
      const page = new routes['#/stories/add']();
      this.#setDocumentTitle(resource, id);
      this.#showLoading();

      try {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();

          // Store the active presenter
          if (page._presenter) {
            this.#activePresenter = page._presenter;
          }

          this.#previousRoute = url;

          // Update sidebar state
          this.#updateSidebar();

          // Custom animation for add story page
          if (
            window.matchMedia('(prefers-reduced-motion: no-preference)').matches
          ) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
              mainContent.animate(
                [
                  { transform: 'translateX(100%)', opacity: 0 },
                  { transform: 'translateX(0)', opacity: 1 },
                ],
                {
                  duration: 300,
                  easing: 'ease-out',
                }
              );
            }
          }
        }).finished;
      } catch (error) {
        console.error('Error rendering Add Story page:', error);
        this.#showErrorPage();
      } finally {
        this.#hideLoading();
      }
      return;
    }

    // Handle other pages
    const PageClass = routes[url] || routes['#/404'];
    const page = new PageClass();

    this.#setDocumentTitle(resource, id);
    this.#showLoading();

    try {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();

        // Store the active presenter
        if (page._presenter) {
          this.#activePresenter = page._presenter;
        }

        this.#previousRoute = url;

        // Update sidebar state
        this.#updateSidebar();

        // Custom animation for other pages
        if (
          window.matchMedia('(prefers-reduced-motion: no-preference)').matches
        ) {
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.animate(
              [
                { transform: 'translateX(-50px)', opacity: 0 },
                { transform: 'translateX(0)', opacity: 1 },
              ],
              {
                duration: 300,
                easing: 'ease-out',
              }
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
    // If previous page was Add Story, stop the camera
    const wasAddStoryPage = this.#previousRoute === '#/stories/add';
    if (wasAddStoryPage && this.#activePresenter) {
      if (typeof this.#activePresenter.stopCamera === 'function') {
        this.#activePresenter.stopCamera();
      }
    }

    // Reset active presenter
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

    const title = titles[resource] || titles.default;
    document.title = `Dicoding Story | ${title}`;
  }

  #showLoading() {
    const loader = document.querySelector('app-loader');
    if (loader) loader.show();
  }

  #hideLoading() {
    const loader = document.querySelector('app-loader');
    if (loader) loader.hide();
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
    // Check if user data changed and notify sidebar
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData && userData !== 'undefined') {
        try {
          // Validate user data to ensure it's proper JSON
          const parsedUserData = JSON.parse(userData);

          // User is logged in
          window.dispatchEvent(
            new CustomEvent('user-login-state-changed', {
              detail: {
                isLoggedIn: true,
                userData: parsedUserData,
              },
            })
          );
        } catch (jsonError) {
          console.error('Invalid user data in localStorage:', jsonError);
          // Clear invalid data
          localStorage.removeItem('user');

          // Create default user data structure with minimal info to prevent errors
          const defaultUserData = { name: 'User', email: '' };
          localStorage.setItem('user', JSON.stringify(defaultUserData));

          window.dispatchEvent(
            new CustomEvent('user-login-state-changed', {
              detail: {
                isLoggedIn: true, // Still logged in because token exists
                userData: defaultUserData,
              },
            })
          );
        }
      } else {
        // User is not logged in
        window.dispatchEvent(
          new CustomEvent('user-login-state-changed', {
            detail: {
              isLoggedIn: false,
              userData: null,
            },
          })
        );
      }
    } catch (error) {
      console.error('Error updating sidebar:', error);
    }
  }
}

export default App;
