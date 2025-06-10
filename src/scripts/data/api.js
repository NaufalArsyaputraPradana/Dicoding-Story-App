import CONFIG from '../config';

class DicodingStoryApi {
  // Helper: fetch with timeout and retry
  static async _fetchWithTimeout(url, options = {}, retryAttempt = 0) {
    const controller = new AbortController();
    const { signal } = controller;
    const mergedOptions = {
      ...options,
      signal,
      mode: 'cors',
      credentials: 'same-origin',
    };

    const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    try {
      // Handle upload with progress
      if (
        options.body instanceof FormData &&
        options.onProgress &&
        options.method === 'POST'
      ) {
        return await this._uploadWithProgress(url, options);
      }

      const response = await fetch(url, mergedOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;

        // User-friendly error messages
        if (response.status === 400) {
          errorMessage =
            errorData.message ||
            'Bad Request: The server could not process your request.';
          const error = new Error(errorMessage);
          error.status = response.status;
          error.data = errorData;
          throw error;
        } else if (response.status === 401) {
          errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
          setTimeout(() => (window.location.hash = '#/login'), 2000);
        } else if (response.status === 403) {
          errorMessage = 'Anda tidak memiliki izin untuk melakukan aksi ini.';
        } else if (response.status === 404) {
          errorMessage = 'Resource yang diminta tidak ditemukan.';
        } else if (response.status === 413) {
          errorMessage = 'File yang diunggah terlalu besar.';
        } else if (response.status >= 500) {
          errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        if (retryAttempt < CONFIG.API_RETRY_ATTEMPTS) {
          await new Promise((resolve) =>
            setTimeout(resolve, CONFIG.API_RETRY_DELAY)
          );
          return this._fetchWithTimeout(url, options, retryAttempt + 1);
        }
        throw new Error(
          'Request timed out. Silakan periksa koneksi internet Anda dan coba lagi.'
        );
      }

      // Network/CORS errors
      if (
        error.message === 'Failed to fetch' ||
        error.message.includes('NetworkError') ||
        error.message.includes('CORS')
      ) {
        if (url.includes('/notifications/')) {
          return { status: 'failed', error: error.message };
        }
        window.showToast?.(
          'Masalah koneksi jaringan. Silakan periksa koneksi internet Anda.',
          'warning'
        );
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Helper: upload with progress
  static async _uploadWithProgress(url, options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'POST', url);

      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          options.onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Format respons dari server tidak valid'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorData.message || `HTTP error! status: ${xhr.status}`
              )
            );
          } catch {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () =>
        reject(new Error('Terjadi kesalahan jaringan'))
      );
      xhr.addEventListener('abort', () =>
        reject(new Error('Upload dibatalkan'))
      );
      xhr.addEventListener('timeout', () =>
        reject(new Error('Upload melebihi batas waktu'))
      );
      xhr.send(options.body);
    });
  }

  // Auth
  static async register({ name, email, password }) {
    this._validateEmail(email);
    this._validatePassword(password);

    try {
      const result = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }
      );
      window.showToast?.('Registrasi berhasil! Silakan login.', 'success');
      return result;
    } catch (error) {
      if (error.message.includes('email is already taken')) {
        throw new Error('Email sudah digunakan. Silakan gunakan email lain.');
      }
      throw error;
    }
  }

  static async login({ email, password }) {
    this._validateEmail(email);

    try {
      const result = await this._fetchWithTimeout(`${CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      window.showToast?.(
        `Selamat datang kembali, ${result.loginResult.name}!`,
        'success'
      );
      return result;
    } catch (error) {
      if (
        error.message.includes('user not found') ||
        error.message.includes('password')
      ) {
        throw new Error('Email atau password salah. Silakan coba lagi.');
      }
      throw error;
    }
  }

  // Stories
  static async getAllStories({
    token,
    page = 1,
    size = CONFIG.PAGE_SIZE,
    location = 0,
  }) {
    this._validateToken(token);

    try {
      const response = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response || !response.listStory) {
        throw new Error('Format respons dari server tidak valid');
      }
      return response;
    } catch (error) {
      window.showToast?.('Gagal memuat cerita. ' + error.message, 'error');
      throw error;
    }
  }

  static async getStoryDetail({ token, id }) {
    this._validateToken(token);
    if (!id) throw new Error('ID cerita tidak valid');
    return this._fetchWithTimeout(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async addNewStory({ token, data, onProgress }) {
    this._validateToken(token);

    try {
      if (!data.has('description')) throw new Error('Deskripsi wajib diisi');
      if (!data.has('photo')) throw new Error('Foto wajib diunggah');

      const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
        onProgress,
      };

      const result = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/stories`,
        options
      );
      window.showToast?.('Cerita berhasil ditambahkan!', 'success');
      return result;
    } catch (error) {
      if (error.message.includes('photo')) {
        throw new Error(
          'Gagal mengunggah foto. Pastikan ukuran foto tidak melebihi 5MB.'
        );
      } else if (error.status === 400) {
        throw new Error(
          'Pastikan semua data yang dikirim valid (foto dan deskripsi wajib diisi).'
        );
      } else if (
        error.message.includes('Network') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Koneksi gagal. Periksa koneksi internet Anda dan coba lagi.'
        );
      }
      throw error;
    }
  }

  // Push Notification
  static async subscribeNotification({ token, subscription }) {
    this._validateToken(token);
    try {
      const result = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/notifications/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subscription),
        }
      );
      window.showToast?.('Notifikasi berhasil diaktifkan!', 'success');
      return result;
    } catch (error) {
      window.showToast?.('Gagal mengaktifkan notifikasi', 'error');
      throw error;
    }
  }

  static async unsubscribeNotification({ token, endpoint }) {
    this._validateToken(token);
    if (!endpoint) throw new Error('Endpoint notifikasi tidak valid');

    try {
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDev) {
        window.showToast?.(
          'Notifikasi berhasil dinonaktifkan (dev mode)',
          'info'
        );
        return {
          success: true,
          message: 'Unsubscribed from notifications (development mock)',
        };
      }

      const result = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/notifications/subscribe`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint }),
        }
      );
      window.showToast?.('Notifikasi berhasil dinonaktifkan', 'info');
      return result;
    } catch (error) {
      if (
        !(
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1'
        )
      ) {
        window.showToast?.('Gagal menonaktifkan notifikasi', 'error');
      }
      throw error;
    }
  }

  // Validation helpers
  static _validateToken(token) {
    if (!token)
      throw new Error('Autentikasi diperlukan. Silakan login terlebih dahulu.');
  }

  static _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email))
      throw new Error('Silakan masukkan alamat email yang valid');
  }

  static _validatePassword(password) {
    if (!password || password.length < 8)
      throw new Error('Password harus minimal 8 karakter');
  }
}

export default DicodingStoryApi;
