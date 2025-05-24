class AppFooter extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const currentYear = new Date().getFullYear();

    this.innerHTML = `
      <footer class="app-footer">
        <div class="container footer-content">
          <div class="social-links">
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
          <p>&copy; ${currentYear} Dicoding Story. All rights reserved.</p>
          <p class="copyright">
            Made with Naufal Arsyaputra Pradana <i class="fas fa-code" style="color: var(--danger)"></i> for Dicoding Submission
          </p>
        </div>
      </footer>
    `;
  }

  setupEventListeners() {
    const yearElement = this.querySelector('p:first-of-type');
    if (yearElement) {
      yearElement.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    }
  }
}

customElements.define('app-footer', AppFooter);
