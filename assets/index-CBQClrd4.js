import '../styles/styles.css';
import App from './pages/app';
import CONFIG from './config';
import { subscribeUserToPush } from './utils/notification-helper';

// Create and show splash screen
function showSplashScreen() {
  const splashScreen = document.createElement('div');
  splashScreen.className = 'splash-screen';

  const logo = document.createElement('img');
  logo.src = '/images/logo.png';
  logo.alt = 'Dicoding Story Logo';
  logo.className = 'splash-logo';

  const title = document.createElement('div');
  title.className = 'splash-title';
  title.textContent = 'Dicoding Story';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'splash-dots';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'splash-dot';
    dotsContainer.appendChild(dot);
  }

  splashScreen.appendChild(logo);
  splashScreen.appendChild(title);
  splashScreen.appendChild(dotsContainer);

  document.body.appendChild(splashScreen);

  return splashScreen;
}

function hideSplashScreen(splashScreen) {
  splashScreen.style.opacity = '0';

  setTimeout(() => {
    splashScreen.style.visibility = 'hidden';
    document.body.removeChild(splashScreen);
  }, 600);
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  // Handle Add to Home Screen prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    let deferredPrompt = e;
    const installBtn = document.createElement('button');
    installBtn.id = 'install-button';
    installBtn.textContent = 'Install App';
    installBtn.className = 'install-button';
    document.body.appendChild(installBtn);
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
    });
  });

  window.addEventListener('load', () => {
    // Register service worker in all environments (including development)
    navigator.serviceWorker
      .register(CONFIG.SERVICE_WORKER_PATH)
      .then((registration) => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );
        window.showToast && window.showToast('Aplikasi siap digunakan secara offline', 'success');
        // Subscribe to push notifications
        subscribeUserToPush(registration);
      })
      .catch((err) => {
        console.error('ServiceWorker registration failed: ', err);
        window.showToast && window.showToast('Gagal mendaftarkan service worker', 'error');
      });
  });
}

// Feature detection for View Transition API
const supportsViewTransitions = () => {
  return (
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
};

// Polyfill for View Transition API
if (!supportsViewTransitions()) {
  document.startViewTransition = (callback) => {
    try {
      const updateCallbackDone = Promise.resolve(callback());

      return {
        ready: Promise.resolve(),
        updateCallbackDone,
        finished: updateCallbackDone,
      };
    } catch (error) {
      console.error('Error in startViewTransition callback:', error);
      return {
        ready: Promise.reject(error),
        updateCallbackDone: Promise.reject(error),
        finished: Promise.reject(error),
      };
    }
  };
}

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    // If no saved preference, use system preference
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Call theme initialization immediately (before DOM is fully loaded)
initTheme();

// Initialize the app
async function initializeApp() {
  // Show splash screen first
  const splashScreen = showSplashScreen();

  // Delay app initialization to show splash screen
  setTimeout(async () => {
    const appElement = document.querySelector('#app');
    if (!appElement) {
      console.error('App element not found');
      hideSplashScreen(splashScreen);
      return;
    }

    const app = new App({
      content: appElement,
    });

    try {
      await app.renderPage();
      // Hide splash screen after initial render is complete
      hideSplashScreen(splashScreen);

      // Setup scroll handler for header
      setupHeaderScrollEffect();

      // Setup theme mode toggle
      setupThemeModeToggle();

      // Setup animations for elements when they enter viewport
      setupScrollAnimations();
    } catch (error) {
      console.error('Error loading initial page:', error);
      hideSplashScreen(splashScreen);

      appElement.innerHTML = `
        <section class="container">
          <h1 class="page-title">Error</h1>
          <p>Gagal memuat halaman. Silakan coba lagi.</p>
          <a href="#/" class="back-link">
            <i class="fas fa-home"></i>
            Kembali ke Beranda
          </a>
        </section>
      `;

      window.showToast && window.showToast('Gagal memuat halaman, silakan coba lagi', 'error');
    }

    window.addEventListener('hashchange', async () => {
      try {
        // Show loading spinner for page transitions
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = `
          <div class="spinner-container">
            <div class="spinner-pulse"></div>
            <div class="spinner"></div>
          </div>
          <div class="spinner-text">Loading...</div>
        `;
        document.body.appendChild(loadingSpinner);

        // Render the new page
        await app.renderPage();

        // Setup animations again after page change
        setupScrollAnimations();

        // Remove loading spinner
        document.body.removeChild(loadingSpinner);
      } catch (error) {
        console.error('Error loading page:', error);
        window.showToast && window.showToast('Gagal memuat halaman', 'error');
      }
    });

    // Skip to content implementation
    const skipLinkHandler = () => {
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', function (event) {
          event.preventDefault(); // Prevent default behavior that would refresh the page

          const mainContent = document.querySelector('#main-content');
          if (mainContent) {
            skipLink.blur(); // Remove focus from the skip link
            mainContent.focus(); // Set focus to the main content
            mainContent.scrollIntoView({ behavior: 'smooth' }); // Scroll to main content
          }
        });
      }
    };

    // Initialize skip link handler on page load
    skipLinkHandler();

    // Re-initialize skip link handler after each page change
    window.addEventListener('hashchange', () => {
      // Short delay to ensure DOM is updated after route change
      setTimeout(skipLinkHandler, 100);
    });

    // Check for PWA install prompt
    let deferredPrompt;
    const installContainer = document.createElement('div');
    installContainer.id = 'install-container';
    installContainer.classList.add('install-prompt');
    installContainer.innerHTML = `
      <div class="install-content">
        <img src="/images/logo.png" alt="App icon" width="48" height="48">
        <div class="install-text">
          <h3>Install Dicoding Story</h3>
          <p>Install aplikasi ini untuk pengalaman offline yang lebih baik!</p>
        </div>
        <div class="install-actions">
          <button id="install-button" class="primary-button">Install</button>
          <button id="dismiss-button" class="secondary-button">Nanti</button>
        </div>
      </div>
    `;
    document.body.appendChild(installContainer);

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      // Show the install prompt after a delay
      setTimeout(() => {
        installContainer.classList.add('show');
      }, 3000);

      document
        .getElementById('install-button')
        .addEventListener('click', () => {
          installContainer.classList.remove('show');
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
              window.showToast && window.showToast('Aplikasi sedang diinstall!', 'success');
            } else {
              console.log('User dismissed the install prompt');
            }
            // Clear the saved prompt since it can't be used again
            deferredPrompt = null;
          });
        });

      document
        .getElementById('dismiss-button')
        .addEventListener('click', () => {
          installContainer.classList.remove('show');
        });
    });

    // Show welcome toast
    window.showToast &&
      setTimeout(() => {
        window.showToast('Selamat datang di Dicoding Story!', 'info');
      }, 1000);
  }, 1800); // Give more time to show the splash screen
}

function setupHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;

  const scrollHandler = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial check
  scrollHandler();

  // Add scroll event listener
  window.addEventListener('scroll', scrollHandler);
}

function setupThemeModeToggle() {
  // Check if we have a theme preference stored
  const savedTheme = localStorage.getItem('theme');

  // Apply saved theme if it exists
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Add theme toggle button to nav if it doesn't exist yet
  const navList = document.querySelector('.nav-list');
  if (navList) {
    // Check if theme toggle already exists
    if (!document.getElementById('theme-toggle-item')) {
      const themeToggleItem = document.createElement('li');
      themeToggleItem.id = 'theme-toggle-item';

      const currentTheme =
        savedTheme ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light');

      themeToggleItem.innerHTML = `
        <button id="theme-toggle" aria-label="Toggle dark/light mode">
          <i class="fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>
          <span>${currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      `;

      // Add after the second item
      const secondItem = navList.children[1];
      if (secondItem) {
        navList.insertBefore(themeToggleItem, secondItem.nextSibling);
      } else {
        navList.appendChild(themeToggleItem);
      }

      // Add event listener
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }
    }
  }
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');

  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Update the document attribute
  document.documentElement.setAttribute('data-theme', newTheme);

  // Save to localStorage
  localStorage.setItem('theme', newTheme);

  // Update button icon and text
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');

    if (icon) {
      icon.className = `fas ${newTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    }

    if (text) {
      text.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  }

  // Show toast notification
  window.showToast &&
    window.showToast(
      `Switched to ${newTheme === 'dark' ? 'dark' : 'light'} mode`,
      'info'
    );
}

function setupScrollAnimations() {
  // Set up animations for elements that enter the viewport
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      '.story-item, .page-title, .story-form, .auth-container'
    );

    elements.forEach((element) => {
      // Check if element is in viewport
      const rect = element.getBoundingClientRect();
      const isInViewport =
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) *
            0.85 && rect.bottom >= 0;

      if (isInViewport) {
        element.classList.add('visible');

        // Add the proper animation class based on element type
        if (element.classList.contains('story-item')) {
          element.classList.add('animate__animated', 'animate__fadeInUp');
          // Stagger the animations slightly
          const index = Array.from(element.parentNode.children).indexOf(
            element
          );
          element.style.animationDelay = `${index * 0.1}s`;
        } else if (element.classList.contains('page-title')) {
          element.classList.add('animate__animated', 'animate__fadeInDown');
        } else {
          element.classList.add('animate__animated', 'animate__fadeIn');
        }
      }
    });
  };

  // Run once on page load
  setTimeout(animateOnScroll, 100);

  // Add scroll event listener with debounce
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(animateOnScroll, 20);
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);
