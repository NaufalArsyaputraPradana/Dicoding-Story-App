import DicodingStoryApi from '../data/api';
import CONFIG from '../config';

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.checkNotificationPermission();
  }

  render() {
    const isLoggedIn = localStorage.getItem('token') !== null;
    let user = null;

    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        user = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      // Remove invalid data
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
                  <i class="fas fa-home" aria-hidden="true"></i>
                  Home
                </a>
              </li>
              <li>
                <a href="#/about" class="${window.location.hash === '#/about' ? 'active' : ''}" aria-current="${window.location.hash === '#/about' ? 'page' : 'false'}">
                  <i class="fas fa-info-circle" aria-hidden="true"></i>
                  About
                </a>
              </li>
              ${
                isLoggedIn
                  ? `
                    <li>
                      <a href="#/stories/add" class="${window.location.hash === '#/stories/add' ? 'active' : ''}" aria-current="${window.location.hash === '#/stories/add' ? 'page' : 'false'}">
                        <i class="fas fa-plus-circle" aria-hidden="true"></i>
                        Add Story
                      </a>
                    </li>
                    <li>
                      <a href="#/stories/saved" class="${window.location.hash === '#/saved' ? 'active' : ''}" aria-current="${window.location.hash === '#/stories/saved' ? 'page' : 'false'}">
                        <i class="fas fa-database" aria-hidden="true"></i>
                        Saved Stories
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
                          <button id="theme-toggle" class="dropdown-button" role="menuitem">
                            <i class="fas fa-moon" aria-hidden="true"></i>
                            <span>Dark Mode</span>
                          </button>
                        </li>
                        <li role="none" class="dropdown-divider"></li>
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
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="#/register" class="${window.location.hash === '#/register' ? 'active' : ''}" aria-current="${window.location.hash === '#/register' ? 'page' : 'false'}">
                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                        Register
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
    this._setupThemeToggle();
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

  _setupThemeToggle() {
    const themeToggle = this.querySelector('#theme-toggle');
    if (!themeToggle) return;

    // Check current theme
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');

    if (isDark) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      themeText.textContent = 'Light Mode';
    }

    themeToggle.addEventListener('click', () => {
      const isDarkMode =
        document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDarkMode ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Update icon and text
      const icon = themeToggle.querySelector('i');
      const text = themeToggle.querySelector('span');

      if (newTheme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
        text.textContent = 'Light Mode';
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        text.textContent = 'Dark Mode';
      }

      // Show toast notification
      if (window.showToast) {
        window.showToast(
          `${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`,
          'info'
        );
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
          // Unsubscribe from notifications when logging out to clean up
          this._cleanupNotifications();

          localStorage.removeItem('token');
          localStorage.removeItem('user');

          if (window.showToast) {
            window.showToast('Logout successful', 'success');
          }

          window.location.hash = '#/login';
        }
      });
    });
  }

  async _cleanupNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        console.log('Cleaned up push subscription on logout');
      }
    } catch (error) {
      console.error('Error cleaning up notifications on logout:', error);
    }
  }

  async checkNotificationPermission() {
    const notificationToggle = this.querySelector('#notification-toggle');
    const notificationStatus = this.querySelector('#notification-status');
    const statusIndicator = this.querySelector('.status-indicator');

    if (!notificationToggle || !notificationStatus || !statusIndicator) return;

    if (Notification.permission === 'granted') {
      // Check if we actually have an active subscription
      const hasSubscription = await this._checkActiveSubscription();

      if (hasSubscription) {
        notificationStatus.textContent = 'Disable Notifications';
        statusIndicator.classList.add('active');
        notificationToggle.classList.add('enabled');
      } else {
        notificationStatus.textContent = 'Enable Notifications';
        statusIndicator.classList.remove('active');
        notificationToggle.classList.remove('enabled');
      }
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
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
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

      // Add loading state
      notificationToggle.disabled = true;
      notificationToggle.classList.add('loading');
      const originalText = notificationStatus.textContent;
      notificationStatus.textContent = 'Processing...';

      try {
        const hasSubscription = await this._checkActiveSubscription();

        if (hasSubscription) {
          // User has an active subscription, unsubscribe them
          await this._unsubscribeFromNotifications();
          notificationStatus.textContent = 'Enable Notifications';
          statusIndicator.classList.remove('active');
          notificationToggle.classList.remove('enabled');
        } else {
          // User doesn't have an active subscription
          if (Notification.permission === 'granted') {
            // Already has permission, just subscribe
            await this._subscribeToNotifications();
            notificationStatus.textContent = 'Disable Notifications';
            statusIndicator.classList.add('active');
            notificationToggle.classList.add('enabled');
          } else {
            // Needs to request permission
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

              if (window.showToast) {
                window.showToast(
                  'Notification permission denied by browser',
                  'warning'
                );
              }
            }
          }
        }
      } catch (error) {
        console.error('Error toggling notifications:', error);
        notificationStatus.textContent = originalText;

        if (window.showToast) {
          window.showToast('Failed to toggle notifications', 'error');
        }
      } finally {
        // Remove loading state
        notificationToggle.disabled = false;
        notificationToggle.classList.remove('loading');
      }
    });
  }

  async _subscribeToNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications are not supported');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const registration = await navigator.serviceWorker.ready;

      // First, unsubscribe from any existing subscriptions
      // This ensures we start with a clean slate and fixes potential issues
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      // Create a new subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: CONFIG.VAPID_PUBLIC_KEY,
      });

      const subscriptionData = subscription.toJSON();

      // Create a new object without expirationTime to avoid Bad Request error
      const { endpoint, keys } = subscriptionData;
      const cleanSubscriptionData = {
        endpoint,
        keys,
      };

      await DicodingStoryApi.subscribeNotification({
        token,
        subscription: cleanSubscriptionData,
      });

      console.log('Successfully subscribed to notifications');
      if (window.showToast) {
        window.showToast('Notifications enabled successfully', 'success');
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      if (window.showToast) {
        window.showToast('Failed to enable notifications', 'error');
      }
      return false;
    }
  }

  async _unsubscribeFromNotifications() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Try to unsubscribe from the API
        try {
          await DicodingStoryApi.unsubscribeNotification({
            token,
            endpoint: subscription.endpoint,
          });
        } catch (apiError) {
          // Log but don't rethrow API errors - these are common in development environments due to CORS
          console.warn(
            'API unsubscribe notification failed (expected in development):',
            apiError
          );
        }

        // Always unsubscribe from the subscription regardless of API result
        const result = await subscription.unsubscribe();
        console.log('Successfully unsubscribed from push notification service');

        if (window.showToast) {
          window.showToast('Notifications disabled successfully', 'info');
        }

        return result;
      }
      return true; // Already no subscription
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      // In development, suppress toast error for expected CORS failures
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      if (!isDev && window.showToast) {
        window.showToast('Failed to disable notifications', 'error');
      }
      return false;
    }
  }
}

customElements.define('app-header', AppHeader);

// Helper function
function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}
