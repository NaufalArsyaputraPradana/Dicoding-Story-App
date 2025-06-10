import DicodingStoryApi from '../../../data/api';
import '../../../components/header';
import '../../../components/loader';
import '../../../components/footer';
import '../../../components/sidebar';
import { validateEmail, isOnline } from '../../../utils/index';

export default class LoginPage {
  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="auth-container">
          <h1 class="auth-title">
            <i class="fas fa-sign-in-alt"></i>
            Login
          </h1>
          <form id="login-form" class="auth-form" novalidate autocomplete="on">
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
                placeholder="Enter your password"
                aria-describedby="password-help"
                autocomplete="current-password"
              >
              <small id="password-help" class="text-muted">Minimum 8 characters</small>
              <div class="error-message" id="password-error"></div>
            </div>
            <button type="submit" class="auth-submit-button">
              <i class="fas fa-sign-in-alt"></i>
              Login
            </button>
            <div class="flex items-center mt-2">
              <input type="checkbox" id="remember-me" name="remember-me">
              <label for="remember-me" class="ml-2">Remember me</label>
            </div>
          </form>
          <div class="auth-link">
            Don't have an account? <a href="#/register">Register here</a>
          </div>
          ${
            !isOnline()
              ? `
            <div class="offline-notice mt-2">
              <i class="fas fa-wifi-slash"></i> You are currently offline. 
              Login is not available without internet connection.
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
    this._checkRememberedUser();
    this._focusFirstInput();
  }

  _setupForm() {
    const form = document.querySelector('#login-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!this._validateForm()) return;
      if (!isOnline()) {
        Swal.fire({
          icon: 'error',
          title: 'Offline Mode',
          text: 'Login is not available without internet connection.',
          confirmButtonColor: '#4361ee',
        });
        return;
      }

      const email = form.querySelector('#email').value.trim();
      const password = form.querySelector('#password').value.trim();
      const rememberMe = form.querySelector('#remember-me').checked;

      const loader = document.querySelector('app-loader');
      if (loader) loader.show('Authenticating...');

      try {
        const response = await DicodingStoryApi.login({ email, password });

        localStorage.setItem('accessToken', response.loginResult.token);
        localStorage.setItem('user', JSON.stringify(response.loginResult.user));

        // Trigger sidebar and header update
        window.dispatchEvent(
          new CustomEvent('user-login-state-changed', {
            detail: { isLoggedIn: true, userData: response.loginResult.user },
          })
        );

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        await Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          showConfirmButton: false,
          timer: 1500,
        });

        window.location.hash = '#/';
      } catch (error) {
        console.error('Login failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: error.message || 'Invalid email or password',
          confirmButtonColor: '#4361ee',
        });
      } finally {
        if (loader) loader.hide();
      }
    });
  }

  _setupInputValidation() {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

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
    const isEmailValid = this._validateEmail();
    const isPasswordValid = this._validatePassword();
    return isEmailValid && isPasswordValid;
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

  _checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const emailInput = document.querySelector('#email');
    const rememberCheckbox = document.querySelector('#remember-me');

    if (rememberedEmail && emailInput) {
      emailInput.value = rememberedEmail;
      if (rememberCheckbox) {
        rememberCheckbox.checked = true;
      }
      document.querySelector('#password').focus();
    }
  }

  _focusFirstInput() {
    // Aksesibilitas: fokus otomatis ke input email saat halaman login
    const emailInput = document.querySelector('#email');
    if (emailInput) setTimeout(() => emailInput.focus(), 200);
  }
}
