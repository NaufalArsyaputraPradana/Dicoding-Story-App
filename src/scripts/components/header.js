import DicodingStoryApi from '../data/api';
import CONFIG from '../config';
import { getInitials } from '../utils/index';

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.checkNotificationPermission();
  }

  render() {
    const isLoggedIn = !!localStorage.getItem('accessToken');
    let user = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') user = JSON.parse(userData);
    } catch {
      localStorage.removeItem('user');
    }

    this.innerHTML = `
      <header>
        <div class="container main-header">
          <a class="brand-name" href="#/" aria-label="Home">
            <img src="/images/logo.png" alt="Dicoding Story Logo" width="32" height="32">
            Dicoding Story
          </a>
          <nav id="navigation-drawer" class="navigation-drawer" aria-label="Main navigation">
            <ul id="nav-list" class="nav-list">
              <li>
                <a href="#/" class="${window.location.hash === '#/' ? 'active' : ''}" aria-current="${window.location.hash === '#/' ? 'page' : 'false'}">
                  <i class="fas fa-home" aria-hidden="true"></i> Home
                </a>
              </li>
              <li>
                <a href="#/about" class="${window.location.hash === '#/about' ? 'active' : ''}" aria-current="${window.location.hash === '#/about' ? 'page' : 'false'}">
                  <i class="fas fa-info-circle" aria-hidden="true"></i> About
                </a>
              </li>
              ${
                isLoggedIn
                  ? `
                    <li>
                      <a href="#/stories/add" class="${window.location.hash === '#/stories/add' ? 'active' : ''}" aria-current="${window.location.hash === '#/stories/add' ? 'page' : 'false'}">
                        <i class="fas fa-plus-circle" aria-hidden="true"></i> Add Story
                      </a>
                    </li>
                    <li>
                      <a href="#/saved" class="${window.location.hash === '#/saved' ? 'active' : ''}" aria-current="${window.location.hash === '#/saved' ? 'page' : 'false'}">
                        <i class="fas fa-database" aria-hidden="true"></i> Saved Stories
                      </a>
                    </li>
                    <li class="user-menu">
                      <div class="user-info" tabindex="0" aria-haspopup="true" aria-expanded="false">
                        <div class="user-avatar" aria-hidden="true">${getInitials(user?.name)}</div>
                        <span>${user?.name || 'User'}</span>
                        <i class="fas fa-chevron-down ml-1" aria-hidden="true"></i>
                      </div>
                      <ul class="user-dropdown" role="menu" style="display: none;">
                        <li role="none">
                          <button id="notification-toggle" class="dropdown-button notification-toggle" role="menuitem">
                            <i class="fas fa-bell" aria-hidden="true"></i>
                            <span id="notification-status">Enable Notifications</span>
                            <span class="status-indicator"></span>
                          </button>
                        </li>
                        <li role="none">
                          <button id="logout-button" class="dropdown-button logout-button" role="menuitem">
                            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  `
                  : `
                    <li>
                      <a href="#/login" class="${window.location.hash === '#/login' ? 'active' : ''}" aria-current="${window.location.hash === '#/login' ? 'page' : 'false'}">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login
                      </a>
                    </li>
                    <li>
                      <a href="#/register" class="${window.location.hash === '#/register' ? 'active' : ''}" aria-current="${window.location.hash === '#/register' ? 'page' : 'false'}">
                        <i class="fas fa-user-plus" aria-hidden="true"></i> Register
                      </a>
                    </li>
                  `
              }
            </ul>
          </nav>
          <button id="drawer-button" class="drawer-button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navigation-drawer">
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>
        </div>
      </header>
    `;
  }

  setupEventListeners() {
    this._setupDrawerToggle();
    this._setupUserMenu();
    this._setupLogoutButton();
    this._setupNotificationToggle();
  }

  _setupDrawerToggle() {
    const drawerButton = this.querySelector('#drawer-button');
    const navigationDrawer = this.querySelector('#navigation-drawer');
    if (!drawerButton || !navigationDrawer) return;

    drawerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navigationDrawer.classList.toggle('open');
      drawerButton.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        const firstNavItem = navigationDrawer.querySelector('a');
        if (firstNavItem) firstNavItem.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!navigationDrawer.contains(event.target)) {
        navigationDrawer.classList.remove('open');
        drawerButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navigationDrawer.classList.remove('open');
        drawerButton.setAttribute('aria-expanded', 'false');
        drawerButton.focus();
      }
    });
  }

  _setupUserMenu() {
    const userMenu = this.querySelector('.user-menu');
    if (!userMenu) return;
    const userInfo = userMenu.querySelector('.user-info');
    const dropdown = userMenu.querySelector('.user-dropdown');

    userInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = userInfo.getAttribute('aria-expanded') === 'true';
      userInfo.setAttribute('aria-expanded', !isExpanded);
      dropdown.style.display = isExpanded ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      userInfo.setAttribute('aria-expanded', 'false');
      dropdown.style.display = 'none';
    });

    userInfo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = userInfo.getAttribute('aria-expanded') === 'true';
        userInfo.setAttribute('aria-expanded', !isExpanded);
        dropdown.style.display = isExpanded ? 'none' : 'block';
        if (!isExpanded) {
          const firstItem = dropdown.querySelector('button');
          if (firstItem) firstItem.focus();
        }
      }
    });
  }

  _setupLogoutButton() {
    const logoutButton = this.querySelector('#logout-button');
    if (!logoutButton) return;
    logoutButton.addEventListener('click', () => {
      Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4361ee',
        cancelButtonColor: '#f72585',
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel',
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this._cleanupNotifications();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.showToast && window.showToast('Logout berhasil', 'success');
          window.location.hash = '#/login';
        }
      });
    });
  }

  async _cleanupNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();
    } catch {}
  }

  async checkNotificationPermission() {
    const notificationToggle = this.querySelector('#notification-toggle');
    const notificationStatus = this.querySelector('#notification-status');
    const statusIndicator = this.querySelector('.status-indicator');
    if (!notificationToggle || !notificationStatus || !statusIndicator) return;

    if (Notification.permission === 'granted') {
      const hasSubscription = await this._checkActiveSubscription();
      notificationStatus.textContent = hasSubscription
        ? 'Disable Notifications'
        : 'Enable Notifications';
      statusIndicator.classList.toggle('active', hasSubscription);
      notificationToggle.classList.toggle('enabled', hasSubscription);
    } else if (Notification.permission === 'denied') {
      notificationStatus.textContent = 'Notifications Blocked';
      notificationToggle.disabled = true;
      notificationToggle.classList.add('blocked');
      statusIndicator.classList.add('blocked');
    } else {
      notificationStatus.textContent = 'Enable Notifications';
      statusIndicator.classList.remove('active');
      notificationToggle.classList.remove('enabled');
    }
  }

  async _checkActiveSubscription() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window))
      return false;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch {
      return false;
    }
  }

  _setupNotificationToggle() {
    const notificationToggle = this.querySelector('#notification-toggle');
    const notificationStatus = this.querySelector('#notification-status');
    const statusIndicator = this.querySelector('.status-indicator');
    if (!notificationToggle || !notificationStatus || !statusIndicator) return;

    notificationToggle.addEventListener('click', async () => {
      if (notificationToggle.disabled) return;
      notificationToggle.disabled = true;
      notificationToggle.classList.add('loading');
      const originalText = notificationStatus.textContent;
      notificationStatus.textContent = 'Processing...';

      try {
        const hasSubscription = await this._checkActiveSubscription();
        if (hasSubscription) {
          await this._unsubscribeFromNotifications();
          notificationStatus.textContent = 'Enable Notifications';
          statusIndicator.classList.remove('active');
          notificationToggle.classList.remove('enabled');
        } else {
          if (Notification.permission === 'granted') {
            await this._subscribeToNotifications();
            notificationStatus.textContent = 'Disable Notifications';
            statusIndicator.classList.add('active');
            notificationToggle.classList.add('enabled');
          } else {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              await this._subscribeToNotifications();
              notificationStatus.textContent = 'Disable Notifications';
              statusIndicator.classList.add('active');
              notificationToggle.classList.add('enabled');
            } else if (permission === 'denied') {
              notificationStatus.textContent = 'Notifications Blocked';
              notificationToggle.disabled = true;
              notificationToggle.classList.add('blocked');
              statusIndicator.classList.add('blocked');
              window.showToast &&
                window.showToast(
                  'Izin notifikasi ditolak oleh browser',
                  'warning'
                );
            }
          }
        }
      } catch {
        notificationStatus.textContent = originalText;
        window.showToast &&
          window.showToast('Gagal mengubah status notifikasi', 'error');
      } finally {
        notificationToggle.disabled = false;
        notificationToggle.classList.remove('loading');
      }
    });
  }

  async _subscribeToNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) await existingSubscription.unsubscribe();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: CONFIG.VAPID_PUBLIC_KEY,
      });
      const { endpoint, keys } = subscription.toJSON();
      await DicodingStoryApi.subscribeNotification({
        token,
        subscription: { endpoint, keys },
      });
      window.showToast &&
        window.showToast('Notifikasi berhasil diaktifkan', 'success');
      return true;
    } catch {
      window.showToast &&
        window.showToast('Gagal mengaktifkan notifikasi', 'error');
      return false;
    }
  }

  async _unsubscribeFromNotifications() {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        try {
          await DicodingStoryApi.unsubscribeNotification({
            token,
            endpoint: subscription.endpoint,
          });
        } catch {}
        await subscription.unsubscribe();
        window.showToast &&
          window.showToast('Notifikasi berhasil dinonaktifkan', 'info');
        return true;
      }
      return true;
    } catch {
      window.showToast &&
        window.showToast('Gagal menonaktifkan notifikasi', 'error');
      return false;
    }
  }
}

customElements.define('app-header', AppHeader);
