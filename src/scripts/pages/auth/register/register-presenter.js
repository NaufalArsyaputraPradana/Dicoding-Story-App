export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      // Validasi sederhana sebelum request
      if (!name || !email || !password) {
        this.#view.registeredFailed('Semua field wajib diisi.');
        return;
      }
      if (name.length < 3) {
        this.#view.registeredFailed('Nama minimal 3 karakter.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.#view.registeredFailed('Format email tidak valid.');
        return;
      }
      if (password.length < 8) {
        this.#view.registeredFailed('Password minimal 8 karakter.');
        return;
      }

      const response = await this.#model.getRegistered({
        name,
        email,
        password,
      });

      // Improvisasi: tangani error response dan struktur data lebih fleksibel
      if (!response || !response.ok) {
        const message =
          response?.message || 'Registrasi gagal. Silakan coba lagi.';
        this.#view.registeredFailed(message);
        return;
      }

      // Sukses: bisa tambahkan event atau logika lain jika perlu
      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      this.#view.registeredFailed(
        error?.message || 'Terjadi kesalahan saat registrasi.'
      );
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
