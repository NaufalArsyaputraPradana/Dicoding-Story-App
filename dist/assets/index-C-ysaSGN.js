import '../styles/styles.css';
import App from './pages/app';
import CONFIG from './config';
import { subscribeUserToPush } from './utils/notification-helper';
import './components/header';
import './components/sidebar';
import './components/footer';
import './components/loader';
import './components/card';

// Splash screen
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
    if (document.body.contains(splashScreen)) {
      document.body.removeChild(splashScreen);
    }
  }, 600);
}

// View Transition API polyfill
const supportsViewTransitions = () =>
  'startViewTransition' in document &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// Theme initialization
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}
initTheme();

// Main app initialization
async function initializeApp() {
  const splashScreen = showSplashScreen();

  setTimeout(async () => {
    const appElement = document.querySelector('#app');
    if (!appElement) {
      console.error('App element not found');
      hideSplashScreen(splashScreen);
      return;
    }

    const app = new App({ content: appElement });

    try {
      await app.renderPage();
      hideSplashScreen(splashScreen);
      setupHeaderScrollEffect();
      setupThemeModeToggle();
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
      window.showToast &&
        window.showToast('Gagal memuat halaman, silakan coba lagi', 'error');
    }

    // Page transition on hashchange
    window.addEventListener('hashchange', async () => {
      try {
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

        await app.renderPage();
        setupScrollAnimations();
        document.body.removeChild(loadingSpinner);
      } catch (error) {
        console.error('Error loading page:', error);
        window.showToast && window.showToast('Gagal memuat halaman', 'error');
      }
    });

    // Skip link accessibility
    const skipLinkHandler = () => {
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', function (event) {
          event.preventDefault();
          const mainContent = document.querySelector('#main-content');
          if (mainContent) {
            skipLink.blur();
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    };
    skipLinkHandler();
    window.addEventListener('hashchange', () =>
      setTimeout(skipLinkHandler, 100)
    );

    // Custom install prompt (improvisasi UX)
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
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => {
        installContainer.classList.add('show');
      }, 3000);

      document.getElementById('install-button').onclick = () => {
        installContainer.classList.remove('show');
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            window.showToast &&
              window.showToast('Aplikasi sedang diinstall!', 'success');
          }
          deferredPrompt = null;
        });
      };

      document.getElementById('dismiss-button').onclick = () => {
        installContainer.classList.remove('show');
      };
    });

    // Welcome toast
    window.showToast &&
      setTimeout(() => {
        window.showToast('Selamat datang di Dicoding Story!', 'info');
      }, 1000);
  }, 1800);
}

// Header scroll effect
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
  scrollHandler();
  window.addEventListener('scroll', scrollHandler);
}

// Theme toggle
function setupThemeModeToggle() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  const navList = document.querySelector('.nav-list');
  if (navList && !document.getElementById('theme-toggle-item')) {
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
    const secondItem = navList.children[1];
    if (secondItem) {
      navList.insertBefore(themeToggleItem, secondItem.nextSibling);
    } else {
      navList.appendChild(themeToggleItem);
    }
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    if (icon)
      icon.className = `fas ${newTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    if (text)
      text.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
  window.showToast &&
    window.showToast(
      `Switched to ${newTheme === 'dark' ? 'dark' : 'light'} mode`,
      'info'
    );
}

// Scroll-triggered animations
function setupScrollAnimations() {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      '.story-item, .page-title, .story-form, .auth-container'
    );
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isInViewport =
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) *
            0.85 && rect.bottom >= 0;
      if (isInViewport) {
        element.classList.add('visible');
        if (element.classList.contains('story-item')) {
          element.classList.add('animate__animated', 'animate__fadeInUp');
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
  setTimeout(animateOnScroll, 100);
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(animateOnScroll, 20);
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);
