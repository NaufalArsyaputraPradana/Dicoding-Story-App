import DicodingStoryApi from '../../../data/api';
import '../../../components/header';
import '../../../components/loader';
import '../../../components/footer';
import '../../../components/sidebar';
import { validateEmail, isOnline } from '../../../utils/index';

export default class RegisterPage {
  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="auth-container">
          <h1 class="auth-title">
            <i class="fas fa-user-plus"></i>
            Register
          </h1>
          <form id="register-form" class="auth-form" novalidate autocomplete="on">
            <div class="auth-form-group">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                minlength="3"
                placeholder="Enter your full name"
                aria-describedby="name-help"
                autocomplete="name"
              >
              <small id="name-help" class="text-muted">Minimum 3 characters</small>
              <div class="error-message" id="name-error"></div>
            </div>
            <div class="auth-form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="Enter your email"
                aria-describedby="email-help"
                autocomplete="username"
              >
              <small id="email-help" class="text-muted">Enter a valid email address</small>
              <div class="error-message" id="email-error"></div>
            </div>
            <div class="auth-form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                minlength="8"
                placeholder="Enter password (min 8 characters)"
                aria-describedby="password-help"
                autocomplete="new-password"
              >
              <small id="password-help" class="text-muted">Minimum 8 characters</small>
              <div class="error-message" id="password-error"></div>
            </div>
            <button type="submit" class="auth-submit-button">
              <i class="fas fa-user-plus"></i>
              Register
            </button>
          </form>
          <div class="auth-link">
            Already have an account? <a href="#/login">Login here</a>
          </div>
          ${
            !isOnline()
              ? `
            <div class="offline-notice mt-2">
              <i class="fas fa-wifi-slash"></i> You are currently offline. 
              Registration is not available without internet connection.
            </div>
          `
              : ''
          }
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
    `;
  }

  async afterRender() {
    this._setupForm();
    this._setupInputValidation();
    this._focusFirstInput();
  }

  _setupForm() {
    const form = document.querySelector('#register-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!this._validateForm()) return;
      if (!isOnline()) {
        Swal.fire({
          icon: 'error',
          title: 'Offline Mode',
          text: 'Registration is not available without internet connection.',
          confirmButtonColor: '#4361ee',
        });
        return;
      }

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const password = form.querySelector('#password').value.trim();

      const loader = document.querySelector('app-loader');
      if (loader) loader.show('Creating account...');

      try {
        await DicodingStoryApi.register({ name, email, password });

        await Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'Please login with your new account',
          confirmButtonColor: '#4361ee',
        });

        window.location.hash = '#/login';
        form.reset();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          text: error.message || 'Email may already be registered',
          confirmButtonColor: '#4361ee',
        });
      } finally {
        if (loader) loader.hide();
      }
    });
  }

  _setupInputValidation() {
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        this._validateName();
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        this._validateEmail();
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        this._validatePassword();
      });
    }
  }

  _validateForm() {
    const isNameValid = this._validateName();
    const isEmailValid = this._validateEmail();
    const isPasswordValid = this._validatePassword();
    return isNameValid && isEmailValid && isPasswordValid;
  }

  _validateName() {
    const nameInput = document.querySelector('#name');
    const errorElement = document.querySelector('#name-error');

    if (!nameInput || !errorElement) return false;

    const name = nameInput.value.trim();

    if (!name) {
      errorElement.textContent = 'Name is required';
      return false;
    }

    if (name.length < 3) {
      errorElement.textContent = 'Name must be at least 3 characters';
      return false;
    }

    errorElement.textContent = '';
    return true;
  }

  _validateEmail() {
    const emailInput = document.querySelector('#email');
    const errorElement = document.querySelector('#email-error');

    if (!emailInput || !errorElement) return false;

    const email = emailInput.value.trim();

    if (!email) {
      errorElement.textContent = 'Email is required';
      return false;
    }

    if (!validateEmail(email)) {
      errorElement.textContent = 'Please enter a valid email address';
      return false;
    }

    errorElement.textContent = '';
    return true;
  }

  _validatePassword() {
    const passwordInput = document.querySelector('#password');
    const errorElement = document.querySelector('#password-error');

    if (!passwordInput || !errorElement) return false;

    const password = passwordInput.value.trim();

    if (!password) {
      errorElement.textContent = 'Password is required';
      return false;
    }

    if (password.length < 8) {
      errorElement.textContent = 'Password must be at least 8 characters';
      return false;
    }

    errorElement.textContent = '';
    return true;
  }

  _focusFirstInput() {
    // Aksesibilitas: fokus otomatis ke input nama saat halaman register
    const nameInput = document.querySelector('#name');
    if (nameInput) setTimeout(() => nameInput.focus(), 200);
  }
}
