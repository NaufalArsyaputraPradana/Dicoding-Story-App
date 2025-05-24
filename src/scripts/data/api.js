import CONFIG from '../config';

class DicodingStoryApi {
  static async _fetchWithTimeout(url, options = {}, retryAttempt = 0) {
    const controller = new AbortController();
    const { signal } = controller;
    const mergedOptions = {
      ...options,
      signal,
      // Add mode 'cors' explicitly to handle CORS properly
      mode: 'cors',
      // Add credentials if needed for cross-origin requests
      credentials: 'same-origin',
    };

    const timeout = setTimeout(() => {
      controller.abort();
    }, CONFIG.API_TIMEOUT);

    try {
      // Add progress tracking for uploads if body is FormData
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

        // Provide more user-friendly messages for common HTTP errors
        if (response.status === 400) {
          errorMessage =
            errorData.message ||
            'Bad Request: The server could not process your request.';

          // Create a custom error object with status code and message
          const error = new Error(errorMessage);
          error.status = response.status;
          error.data = errorData;
          throw error;
        } else if (response.status === 401) {
          errorMessage = 'Your session has expired. Please login again.';
          // Redirect to login if unauthorized
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 2000);
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (response.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (response.status === 413) {
          errorMessage = 'The file you are trying to upload is too large.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        throw new Error(errorMessage);
      }

      // Transform response to JSON
      const result = await response.json();
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(`Request timed out: ${url}`);
        if (retryAttempt < CONFIG.API_RETRY_ATTEMPTS) {
          console.log(
            `Retrying request (${retryAttempt + 1}/${CONFIG.API_RETRY_ATTEMPTS})...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, CONFIG.API_RETRY_DELAY)
          );
          return this._fetchWithTimeout(url, options, retryAttempt + 1);
        }
        throw new Error(
          'Request timed out. Please check your internet connection and try again.'
        );
      }

      // Network errors or CORS errors
      if (
        error.message === 'Failed to fetch' ||
        error.message.includes('NetworkError') ||
        error.message.includes('CORS')
      ) {
        console.error('Network or CORS error:', error);

        // For notification endpoints specifically, handle silently without showing error UI
        if (url.includes('/notifications/')) {
          console.warn(
            'Notification API request failed - this is expected in development environment'
          );
          return { status: 'failed', error: error.message };
        }

        if (window.showToast) {
          window.showToast(
            'Network connection issue. Please check your internet connection.',
            'warning'
          );
        }
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  static async _uploadWithProgress(url, options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'POST', url);

      // Set headers
      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }

      // Handle progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          options.onProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error('Invalid response format from server'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorData.message || `HTTP error! status: ${xhr.status}`
              )
            );
          } catch (e) {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });

      // Send the request
      xhr.send(options.body);
    });
  }

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

      if (window.showToast) {
        window.showToast('Registrasi berhasil! Silakan login.', 'success');
      }

      return result;
    } catch (error) {
      // Registration-specific error handling
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

      if (window.showToast) {
        window.showToast(
          `Selamat datang kembali, ${result.loginResult.name}!`,
          'success'
        );
      }

      return result;
    } catch (error) {
      // Login-specific error handling
      if (
        error.message.includes('user not found') ||
        error.message.includes('password')
      ) {
        throw new Error('Email atau password salah. Silakan coba lagi.');
      }
      throw error;
    }
  }

  static async getAllStories({
    token,
    page = 1,
    size = CONFIG.PAGE_SIZE,
    location = 0,
  }) {
    this._validateToken(token);

    try {
      console.log(
        `Fetching stories data: page=${page}, size=${size}, location=${location}`
      );
      const response = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Pastikan data valid dan berformat yang diharapkan
      if (!response || !response.listStory) {
        console.error('Invalid response format from API:', response);
        throw new Error('Format respons dari server tidak valid');
      }

      console.log(`Successfully fetched ${response.listStory.length} stories`);
      return response;
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Bila terjadi kesalahan, tampilkan toast pesan error
      if (window.showToast) {
        window.showToast('Gagal memuat cerita. ' + error.message, 'error');
      }
      throw error;
    }
  }

  static async getStoryDetail({ token, id }) {
    this._validateToken(token);

    if (!id) {
      throw new Error('ID cerita tidak valid');
    }

    return this._fetchWithTimeout(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async addNewStory({ token, data, onProgress }) {
    this._validateToken(token);

    try {
      // Validate that data contains required fields
      if (!data.has('description')) {
        throw new Error('Description is required');
      }

      if (!data.has('photo')) {
        throw new Error('Photo is required');
      }

      // Create options with progress tracking
      const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
        onProgress: onProgress, // Pass the progress callback
      };

      const result = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/stories`,
        options
      );

      if (window.showToast) {
        window.showToast('Cerita berhasil ditambahkan!', 'success');
      }

      return result;
    } catch (error) {
      console.error('Error adding story:', error);

      // Handle common errors with more user-friendly messages
      if (error.message.includes('photo')) {
        throw new Error(
          'Gagal mengunggah foto. Pastikan ukuran foto tidak melebihi 5MB.'
        );
      } else if (error.status === 400) {
        throw new Error(
          'Bad request: Pastikan semua data yang dikirim valid (foto dan deskripsi wajib diisi).'
        );
      } else if (
        error.message.includes('Network') ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Koneksi gagal. Periksa koneksi internet Anda dan coba lagi.'
        );
      }

      // If it's another error, rethrow it
      throw error;
    }
  }

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

      if (window.showToast) {
        window.showToast('Notifikasi berhasil diaktifkan!', 'success');
      }

      return result;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      window.showToast &&
        window.showToast('Gagal mengaktifkan notifikasi', 'error');
      throw error;
    }
  }

  static async unsubscribeNotification({ token, endpoint }) {
    this._validateToken(token);

    if (!endpoint) {
      throw new Error('Endpoint notifikasi tidak valid');
    }

    try {
      // Check if we're in development environment
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      // In development, return mock success response to avoid CORS issues
      if (isDev) {
        console.log(
          'Development environment detected - skipping actual notification unsubscribe request'
        );

        if (window.showToast) {
          window.showToast(
            'Notifikasi berhasil dinonaktifkan (dev mode)',
            'info'
          );
        }

        return {
          success: true,
          message: 'Unsubscribed from notifications (development mock)',
        };
      }

      // In production, make the actual request
      const result = await this._fetchWithTimeout(
        `${CONFIG.BASE_URL}/notifications/unsubscribe`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint }),
        }
      );

      if (window.showToast) {
        window.showToast('Notifikasi berhasil dinonaktifkan', 'info');
      }

      return result;
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);

      // In development environment, don't show error toast for expected CORS issues
      if (
        !(
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1'
        )
      ) {
        window.showToast &&
          window.showToast('Gagal menonaktifkan notifikasi', 'error');
      }

      throw error;
    }
  }

  static _validateToken(token) {
    if (!token) {
      throw new Error('Autentikasi diperlukan. Silakan login terlebih dahulu.');
    }
  }

  static _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      throw new Error('Silakan masukkan alamat email yang valid');
    }
  }

  static _validatePassword(password) {
    if (password.length < 8) {
      throw new Error('Password harus minimal 8 karakter');
    }
  }
}

export default DicodingStoryApi;
