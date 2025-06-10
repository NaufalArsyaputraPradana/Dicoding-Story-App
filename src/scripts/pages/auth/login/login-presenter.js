export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      // Validasi input sebelum request
      if (!email || !password) {
        this.#view.loginFailed('Email dan password wajib diisi.');
        return;
      }

      const response = await this.#model.getLogin({ email, password });

      // Improvisasi: tangani response error dan struktur data lebih fleksibel
      if (!response || !response.ok) {
        const message = response?.message || 'Login gagal. Silakan coba lagi.';
        this.#view.loginFailed(message);
        return;
      }

      // Simpan token dan user ke localStorage (jika ada)
      if (response.data?.accessToken) {
        this.#authModel.putAccessToken(response.data.accessToken);
      }
      if (response.data?.user) {
        try {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch {}
      }

      // Trigger event global agar sidebar/header update
      window.dispatchEvent(
        new CustomEvent('user-login-state-changed', {
          detail: { isLoggedIn: true, userData: response.data.user || null },
        })
      );

      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      this.#view.loginFailed(error?.message || 'Terjadi kesalahan saat login.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
