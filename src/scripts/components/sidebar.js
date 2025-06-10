class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this._isInitialized = false;
    this._isLoggedIn = false;
    this._userData = null;
    this._checkLoginStatus();
  }

  connectedCallback() {
    this._render();
    this._isInitialized = true;
    this._bindEvents();
    window.addEventListener('hashchange', () => this._render());
    window.addEventListener('user-login-state-changed', (event) => {
      this._isLoggedIn = event.detail.isLoggedIn;
      this._userData = event.detail.userData;
      this._render();
    });
  }

  disconnectedCallback() {
    // Clean up event listeners
    window.removeEventListener('hashchange', this._render);
    window.removeEventListener('user-login-state-changed', this._render);
  }

  _checkLoginStatus() {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      if (token && userData && userData !== 'undefined') {
        try {
          this._isLoggedIn = true;
          this._userData = JSON.parse(userData);
        } catch {
          localStorage.removeItem('user');
          this._isLoggedIn = !!token;
          this._userData = null;
        }
      } else {
        this._isLoggedIn = false;
        this._userData = null;
      }
    } catch {
      this._isLoggedIn = false;
      this._userData = null;
    }
  }

  _render() {
    this.innerHTML = `
      <div class="sidebar-container">
        <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Open sidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div id="sidebar" class="sidebar position-fixed" tabindex="-1" aria-label="Sidebar navigation">
          <div class="sidebar-header">
            <img src="./images/logo.png" alt="Dicoding Story Logo" class="sidebar-logo">
            <h2 class="sidebar-title">Dicoding Story</h2>
            <button id="sidebar-close" class="sidebar-close" aria-label="Close sidebar">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <div class="sidebar-content">
            ${this._renderUserSection()}
            <nav class="sidebar-nav" aria-label="Sidebar main navigation">
              <ul>
                <li>
                  <a href="#/" class="sidebar-link ${this._isActiveRoute('#/') ? 'active' : ''}">
                    <i class="fas fa-home" aria-hidden="true"></i>
                    <span>Home</span>
                  </a>
                </li>
                ${
                  this._isLoggedIn
                    ? `
                <li>
                  <a href="#/stories/add" class="sidebar-link ${this._isActiveRoute('#/stories/add') ? 'active' : ''}">
                    <i class="fas fa-plus-circle" aria-hidden="true"></i>
                    <span>Add Story</span>
                  </a>
                </li>
                `
                    : ''
                }
                <li>
                  <a href="#/about" class="sidebar-link ${this._isActiveRoute('#/about') ? 'active' : ''}">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    <span>About</span>
                  </a>
                </li>
                <li>
                  <a href="#/saved" class="sidebar-link ${this._isActiveRoute('#/saved') ? 'active' : ''}" id="sidebar-saved-link">
                    <i class="fas fa-database" aria-hidden="true"></i>
                    <span>Saved Stories</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="sidebar-footer">
            ${
              this._isLoggedIn
                ? `
              <button id="logout-button" class="sidebar-logout-button">
                <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                <span>Log Out</span>
              </button>
            `
                : `
              <div class="sidebar-auth-buttons">
                <a href="#/login" class="sidebar-auth-button login">
                  <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                  <span>Login</span>
                </a>
                <a href="#/register" class="sidebar-auth-button register">
                  <i class="fas fa-user-plus" aria-hidden="true"></i>
                  <span>Register</span>
                </a>
              </div>
            `
            }
          </div>
        </div>
        <div id="sidebar-overlay" class="sidebar-overlay"></div>
      </div>
    `;
  }

  _renderUserSection() {
    if (!this._isLoggedIn || !this._userData) {
      return `
        <div class="sidebar-guest">
          <i class="fas fa-user-circle sidebar-guest-icon" aria-hidden="true"></i>
          <p>Welcome, Guest!</p>
          <small>Login to share your story</small>
        </div>
      `;
    }
    const userInitials = this._getInitials(this._userData.name);
    const avatarColor = this._getAvatarColor(this._userData.name);
    return `
      <div class="sidebar-user">
        <div class="sidebar-user-avatar" style="background-color: ${avatarColor}">
          ${
            this._userData.photoUrl
              ? `<img src="${this._userData.photoUrl}" alt="${this._userData.name}'s avatar">`
              : `<span class="avatar-initials">${userInitials}</span>`
          }
        </div>
        <div class="sidebar-user-info">
          <h3 class="sidebar-user-name">${this._userData.name}</h3>
          <p class="sidebar-user-email">${this._userData.email}</p>
        </div>
      </div>
    `;
  }

  _getInitials(name) {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  _getAvatarColor(name) {
    if (!name) return '#4361ee';
    const colors = [
      '#4361ee',
      '#3a0ca3',
      '#f72585',
      '#4cc9f0',
      '#4895ef',
      '#560bad',
      '#f8961e',
      '#fb5607',
      '#80b918',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  _bindEvents() {
    const toggleButton = this.querySelector('#sidebar-toggle');
    const sidebar = this.querySelector('#sidebar');
    const overlay = this.querySelector('#sidebar-overlay');
    const closeButton = this.querySelector('#sidebar-close');

    if (toggleButton)
      toggleButton.addEventListener('click', () => this._toggleSidebar());
    if (closeButton)
      closeButton.addEventListener('click', () => this._closeSidebar());
    if (overlay) overlay.addEventListener('click', () => this._closeSidebar());

    // Logout event: dispatch custom event for global handler
    const logoutButton = this.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('user-logout', { bubbles: true, composed: true })
        );
        this._closeSidebar();
      });
    }

    // Sidebar links: close sidebar on navigation
    const sidebarLinks = this.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', () => this._closeSidebar());
    });

    // Saved Stories link: always go to #/saved, never redirect to login
    const savedLink = this.querySelector('#sidebar-saved-link');
    if (savedLink) {
      savedLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#/saved';
        this._closeSidebar();
      });
    }

    // Keyboard accessibility for sidebar
    sidebar &&
      sidebar.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._closeSidebar();
      });
  }

  _toggleSidebar() {
    const sidebar = this.querySelector('#sidebar');
    const overlay = this.querySelector('#sidebar-overlay');
    if (!sidebar || !overlay) return;
    if (sidebar.classList.contains('open')) {
      this._closeSidebar();
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('visible');
      document.body.classList.add('sidebar-open');
      sidebar.focus();
    }
  }

  _closeSidebar() {
    const sidebar = this.querySelector('#sidebar');
    const overlay = this.querySelector('#sidebar-overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('sidebar-open');
  }

  _isActiveRoute(route) {
    const currentRoute = window.location.hash || '#/';
    if (currentRoute === route) return true;
    if (route === '#/stories/add' && currentRoute.includes('#/stories/add'))
      return true;
    if (
      route === '#/stories' &&
      currentRoute.includes('#/stories/') &&
      !currentRoute.includes('#/stories/add')
    )
      return true;
    if (
      route === '#/saved' &&
      (currentRoute === '#/favorites' || currentRoute === '#/saved')
    )
      return true;
    return false;
  }
}

customElements.define('app-sidebar', AppSidebar);
export default AppSidebar;
