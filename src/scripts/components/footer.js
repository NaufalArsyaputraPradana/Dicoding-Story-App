class AppFooter extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const currentYear = new Date().getFullYear();
    this.innerHTML = `
      <footer class="app-footer" role="contentinfo">
        <div class="container footer-content">
          <div class="social-links" aria-label="Social media links">
            <a href="https://github.com/NaufalArsyaputraPradana/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/naufalarsyaputrapradana/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://www.instagram.com/arsya.pradana_/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
          <p class="footer-year" tabindex="0" style="cursor:pointer;">
            &copy; ${currentYear} Dicoding Story. All rights reserved.
          </p>
          <p class="copyright">
            Made with <i class="fas fa-code" style="color: var(--danger)" aria-hidden="true"></i>
            by <a href="https://github.com/NaufalArsyaputraPradana/" target="_blank" rel="noopener noreferrer">Naufal Arsyaputra Pradana</a>
            for Dicoding Submission
          </p>
        </div>
      </footer>
    `;
  }

  setupEventListeners() {
    // Scroll to top on year click or Enter/Space key
    const yearElement = this.querySelector('.footer-year');
    if (yearElement) {
      yearElement.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      yearElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }
}

customElements.define('app-footer', AppFooter);
