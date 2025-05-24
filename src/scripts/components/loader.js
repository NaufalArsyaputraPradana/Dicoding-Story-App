class AppLoader extends HTMLElement {
  constructor() {
    super();
    this.message = 'Loading...';
  }

  static get observedAttributes() {
    return ['message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'message' && oldValue !== newValue) {
      this.message = newValue;
      this.renderMessage();
    }
  }

  connectedCallback() {
    this.render();
    this.hide();
  }

  show(message = '') {
    if (message) {
      this.message = message;
      this.renderMessage();
    }
    this.style.display = 'flex';
  }

  hide() {
    this.style.display = 'none';
  }

  render() {
    this.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-message">${this.message}</p>
      </div>
    `;
  }

  renderMessage() {
    const messageElement = this.querySelector('.loading-message');
    if (messageElement) {
      messageElement.textContent = this.message;
    }
  }
}

customElements.define('app-loader', AppLoader);
