import '../../components/header';
import '../../components/footer';
import '../../components/loader';
import '../../components/sidebar';

export default class AboutPage {
  async render() {
    document.title = 'About - Dicoding Story';
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <h1 class="page-title">
            <i class="fas fa-info-circle"></i>
            About the App
          </h1>
          <div class="about-content">
            <div class="about-card" id="about-app">
              <h2><i class="fas fa-book-open"></i> Dicoding Story</h2>
              <p>
                <strong>Dicoding Story</strong> is a platform for sharing programming and technology 
                learning experiences. This app was created as a submission project 
                for Dicoding's <em>Menjadi Front-End Web Developer Expert</em> class.
              </p>
              <p class="mt-2">
                The application allows users to share their learning journey with others,
                add location to their stories, and explore stories from other learners.
              </p>
            </div>
            <div class="about-card" id="about-features">
              <h2><i class="fas fa-feather-alt"></i> Features</h2>
              <ul class="feature-list">
                <li><i class="fas fa-check-circle"></i> Share stories with images</li>
                <li><i class="fas fa-check-circle"></i> Add location to stories with interactive maps</li>
                <li><i class="fas fa-check-circle"></i> View stories from other users</li>
                <li><i class="fas fa-check-circle"></i> Responsive design for all devices</li>
                <li><i class="fas fa-check-circle"></i> Offline capability with cached data</li>
                <li><i class="fas fa-check-circle"></i> Push notifications for new features</li>
                <li><i class="fas fa-check-circle"></i> PWA: Installable & works offline</li>
                <li><i class="fas fa-check-circle"></i> Accessibility & dark mode support</li>
                <li><i class="fas fa-check-circle"></i> Modern UI/UX with animations</li>
                <li><i class="fas fa-check-circle"></i> Favorite & save stories for offline</li>
              </ul>
            </div>
            <div class="about-card" id="about-tech">
              <h2><i class="fas fa-code"></i> Technology Stack</h2>
              <div class="tech-stack">
                <div class="tech-item"><i class="fab fa-html5"></i><span>HTML5</span></div>
                <div class="tech-item"><i class="fab fa-css3-alt"></i><span>CSS3</span></div>
                <div class="tech-item"><i class="fab fa-js"></i><span>JavaScript</span></div>
                <div class="tech-item"><i class="fas fa-map-marked-alt"></i><span>Leaflet.js</span></div>
                <div class="tech-item"><i class="fas fa-mobile-alt"></i><span>PWA</span></div>
                <div class="tech-item"><i class="fas fa-server"></i><span>REST API</span></div>
                <div class="tech-item"><i class="fas fa-database"></i><span>IndexedDB</span></div>
                <div class="tech-item"><i class="fas fa-bolt"></i><span>Service Worker</span></div>
                <div class="tech-item"><i class="fas fa-bell"></i><span>Push Notification</span></div>
                <div class="tech-item"><i class="fas fa-paint-brush"></i><span>Animate.css</span></div>
                <div class="tech-item"><i class="fas fa-universal-access"></i><span>A11y</span></div>
              </div>
            </div>
            <div class="about-card" id="about-developer">
              <h2><i class="fas fa-user-tie"></i> About Developer</h2>
              <p>
                This application was developed by <strong>Naufal Arsyaputra Pradana</strong> 
                as part of the submission for Dicoding's Front-End Web Developer Expert class.
              </p>
              <div class="tech-stack mt-2">
                <div class="tech-item">
                  <a href="https://github.com/NaufalArsyaputraPradana/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
                  </a>
                </div>
                <div class="tech-item">
                  <a href="https://www.linkedin.com/in/naufalarsyaputrapradana/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                  </a>
                </div>
                <div class="tech-item">
                  <a href="https://www.instagram.com/arsya.pradana_/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
              <div class="mt-2">
                <a href="mailto:support@dicodingstory.app" class="btn btn-secondary" aria-label="Contact Support">
                  <i class="fas fa-envelope"></i> Contact Support
                </a>
                <a href="https://github.com/naufalarsyaputrapradana/Dicoding-Story-App/issues" target="_blank" rel="noopener noreferrer" class="btn btn-primary ml-2" aria-label="Feedback & Issues">
                  <i class="fas fa-comment-dots"></i> Feedback & Issues
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    `;
  }

  async afterRender() {
    // Animate about cards (aksesibilitas & UX)
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      const cards = [
        document.getElementById('about-app'),
        document.getElementById('about-features'),
        document.getElementById('about-tech'),
        document.getElementById('about-developer'),
      ];
      cards.forEach((card, index) => {
        if (card) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          setTimeout(
            () => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            },
            index * 100 + 300
          );
        }
      });
    }

    // Fokus otomatis ke main content untuk aksesibilitas
    const mainContent = document.getElementById('main-content');
    if (mainContent) setTimeout(() => mainContent.focus(), 200);
  }
}
