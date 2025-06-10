import '../../components/header';
import '../../components/loader';
import '../../components/footer';
import '../../components/sidebar';
import AddPresenter from './add-presenter';

export default class AddStoryPage {
  constructor() {
    this._presenter = new AddPresenter({ view: this });
  }

  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <div class="add-story-container">
            <h1 class="page-title">Share Your Story</h1>
            <div class="recent-drafts-container hidden" id="recent-drafts"></div>
            <form id="add-story-form" class="story-form" autocomplete="on" novalidate>
              <div class="form-group">
                <label for="description" class="form-label">Story Description</label>
                <textarea
                  id="description"
                  class="form-control"
                  placeholder="Share your learning experience..."
                  rows="4"
                  required
                  maxlength="280"
                  aria-describedby="description-error"
                ></textarea>
                <small id="description-error" class="error-text"></small>
                <div class="character-counter">
                  <span id="char-count">0</span> / 280 characters
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Photo</label>
                <div class="photo-upload-container">
                  <div class="photo-preview-container">
                    <div class="photo-preview" id="photo-preview">
                      <i class="fas fa-image preview-placeholder"></i>
                      <img id="preview-image" class="hidden" alt="Preview of your photo">
                    </div>
                  </div>
                  <div class="photo-actions">
                    <div class="photo-upload">
                      <label for="photo" class="custom-file-upload">
                        <i class="fas fa-upload"></i> Select Photo
                      </label>
                      <input type="file" id="photo" name="photo" accept="image/jpeg, image/png" hidden>
                    </div>
                    <div class="or-divider">or</div>
                    <button type="button" id="camera-button" class="camera-button">
                      <i class="fas fa-camera"></i> Take Photo
                    </button>
                  </div>
                </div>
                <small id="photo-error" class="error-text"></small>
              </div>
              <div class="camera-container hidden" id="camera-container">
                <div class="camera-view-container">
                  <video id="camera-view" autoplay playsinline></video>
                  <canvas id="camera-canvas" class="hidden"></canvas>
                </div>
                <div class="camera-controls">
                  <button type="button" id="take-photo" class="camera-control-button">
                    <i class="fas fa-circle"></i>
                  </button>
                  <button type="button" id="close-camera" class="camera-control-button">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <small id="camera-error" class="error-text"></small>
              </div>
              <div class="form-group">
                <div class="custom-checkbox">
                  <input type="checkbox" id="location-enabled" name="location-enabled">
                  <label for="location-enabled">
                    <i class="fas fa-map-marker-alt"></i> Include location
                  </label>
                </div>
              </div>
              <div id="map-container" class="map-container hidden">
                <div id="map" class="add-story-map"></div>
                <input type="hidden" id="lat" name="lat">
                <input type="hidden" id="lon" name="lon">
                <small id="map-error" class="error-text"></small>
                <div class="location-info" id="location-info">
                  <i class="fas fa-map-pin"></i>
                  <span id="location-text">No location selected</span>
                </div>
              </div>
              <div class="progress-container hidden" id="progress-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
              </div>
              <div class="form-actions">
                <a href="#/" class="cancel-button">Cancel</a>
                <button type="submit" class="submit-button" id="submit-button">
                  <i class="fas fa-paper-plane"></i> Share Story
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
      <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
    `;
  }

  async afterRender() {
    this._presenter.init();
    this._presenter.loadRecentDrafts();
    this._setupCharCounter();
    this._setupAccessibility();
  }

  _setupCharCounter() {
    const textarea = document.getElementById('description');
    const charCount = document.getElementById('char-count');
    if (textarea && charCount) {
      textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        charCount.textContent = count;
        if (count > 240 && count <= 270) {
          charCount.classList.add('text-warning');
          charCount.classList.remove('text-danger');
        } else if (count > 270) {
          charCount.classList.add('text-danger');
          charCount.classList.remove('text-warning');
        } else {
          charCount.classList.remove('text-warning', 'text-danger');
        }
      });
    }
  }

  _setupAccessibility() {
    // Fokus otomatis ke textarea saat halaman add story
    const textarea = document.getElementById('description');
    if (textarea) setTimeout(() => textarea.focus(), 200);

    // Skip link support
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');
    if (skipLink && mainContent) {
      skipLink.addEventListener('click', function (event) {
        event.preventDefault();
        skipLink.blur();
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  displayRecentDrafts(drafts) {
    const container = document.getElementById('recent-drafts');
    if (!container) return;
    if (!drafts || !Array.isArray(drafts) || drafts.length === 0) {
      container.classList.add('hidden');
      return;
    }
    container.classList.remove('hidden');
    let html =
      '<h2 class="recent-drafts-title">Recent Drafts</h2><div class="recent-drafts-list">';
    drafts.forEach((draft) => {
      const date = new Date(draft.timestamp);
      const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
      html += `
        <div class="recent-draft-item" data-id="${draft.id}">
          <div class="draft-content">
            <p class="draft-text">${draft.description}</p>
            <span class="draft-date">${formattedDate}</span>
          </div>
          <button class="use-draft-btn" data-id="${draft.id}">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
    document.querySelectorAll('.use-draft-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const draftId = btn.getAttribute('data-id');
        this._presenter.useDraft(draftId);
      });
    });
  }

  applyDraftToForm(description) {
    const textarea = document.getElementById('description');
    if (textarea) {
      textarea.value = description;
      textarea.dispatchEvent(new Event('input'));
      textarea.focus();
      document
        .querySelector('.story-form')
        .scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Camera methods
  setOpenCameraCallback(callback) {
    const openCameraButton = document.querySelector('#camera-button');
    if (openCameraButton) openCameraButton.addEventListener('click', callback);
  }
  setTakePhotoCallback(callback) {
    const takePhotoButton = document.querySelector('#take-photo');
    if (takePhotoButton) takePhotoButton.addEventListener('click', callback);
  }
  showCameraStream(stream) {
    const cameraContainer = document.querySelector('#camera-container');
    const videoElement = document.querySelector('#camera-view');
    if (!cameraContainer || !videoElement) return;
    cameraContainer.classList.remove('hidden');
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
      videoElement
        .play()
        .catch((error) => console.error('Error playing video:', error));
    };
  }
  capturePhoto() {
    const videoElement = document.querySelector('#camera-view');
    const canvas = document.querySelector('#camera-canvas');
    if (!videoElement || !canvas) return null;
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0)
      return null;
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  }
  showCameraFlash() {
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.style.opacity = '0.8';
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(flash);
        }, 300);
      }, 100);
    }, 10);
  }
  resetCameraUI() {
    const cameraContainer = document.querySelector('#camera-container');
    const videoElement = document.querySelector('#camera-view');
    if (cameraContainer) cameraContainer.classList.add('hidden');
    if (videoElement) videoElement.srcObject = null;
  }
  showCameraError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Camera Error',
      text: message,
      confirmButtonColor: '#4361ee',
    });
  }

  // Photo preview methods
  setPhotoInputCallback(callback) {
    const photoInput = document.querySelector('#photo');
    if (photoInput) {
      photoInput.addEventListener('change', (event) => {
        callback(event.target.files[0]);
      });
    }
  }
  showPhotoPreview(file) {
    const photoPreview = document.getElementById('photo-preview');
    if (!photoPreview) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.innerHTML = `
        <img 
          src="${e.target.result}" 
          alt="Selected photo preview" 
          style="max-width: 100%; border-radius: 8px; max-height: 300px;"
        >
      `;
    };
    reader.readAsDataURL(file);
  }
  showPhotoError(message) {
    const photoError = document.getElementById('photo-error');
    if (photoError) {
      photoError.textContent = message;
      photoError.style.display = 'block';
    }
  }
  clearPhotoError() {
    const photoError = document.getElementById('photo-error');
    if (photoError) {
      photoError.textContent = '';
      photoError.style.display = 'none';
    }
  }

  // Location methods
  setLocationCheckboxCallback(callback) {
    const locationCheckbox = document.getElementById('location-enabled');
    if (locationCheckbox) {
      locationCheckbox.addEventListener('change', () => {
        callback(locationCheckbox.checked);
      });
    }
  }
  showMapContainer() {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      mapContainer.classList.remove('hidden');
      setTimeout(() => {
        if (window.L && window.L.map) {
          const map = window.L.map._instances?.[0];
          if (map) map.invalidateSize();
        }
      }, 100);
    }
  }
  hideMapContainer() {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) mapContainer.classList.add('hidden');
  }
  setLocateMeCallback(callback) {
    const locateMeButton = document.getElementById('locate-me');
    if (locateMeButton) locateMeButton.addEventListener('click', callback);
  }
  setSearchLocationCallback(callback) {
    const searchLocationButton = document.getElementById('search-location');
    if (searchLocationButton)
      searchLocationButton.addEventListener('click', callback);
  }
  updateLocationCoordinates(lat, lng) {
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const locationText = document.getElementById('location-text');
    if (latInput && lonInput) {
      latInput.value = lat;
      lonInput.value = lng;
    }
    if (locationText) {
      locationText.textContent = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }
  showMapError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Map Error',
      text: message,
      confirmButtonColor: '#4361ee',
    });
  }

  // Form methods
  setSubmitCallback(callback) {
    const form = document.getElementById('add-story-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const description = this.getDescription();
      const photoInput = document.getElementById('photo');
      const photoFile = photoInput.files[0];
      const useLocation = document.getElementById('location-enabled').checked;
      const lat = document.getElementById('lat').value;
      const lon = document.getElementById('lon').value;
      const formData = new FormData();
      formData.append('description', description);
      if (photoFile) formData.append('photo', photoFile);
      if (useLocation && lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }
      callback(formData);
    });
  }
  getDescription() {
    const descriptionInput = document.getElementById('description');
    return descriptionInput ? descriptionInput.value.trim() : '';
  }
  setDescriptionInputCallback(callback) {
    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
      descriptionInput.addEventListener('input', () => {
        callback(descriptionInput.value.trim());
      });
    }
  }
  showDescriptionError(message) {
    const descriptionError = document.getElementById('description-error');
    if (descriptionError) {
      descriptionError.textContent = message;
      descriptionError.style.display = 'block';
      const descriptionInput = document.getElementById('description');
      if (descriptionInput) {
        descriptionInput.classList.add('error');
        descriptionInput.setAttribute('aria-invalid', 'true');
      }
    }
  }
  clearDescriptionError() {
    const descriptionError = document.getElementById('description-error');
    if (descriptionError) {
      descriptionError.textContent = '';
      descriptionError.style.display = 'none';
      const descriptionInput = document.getElementById('description');
      if (descriptionInput) {
        descriptionInput.classList.remove('error');
        descriptionInput.setAttribute('aria-invalid', 'false');
      }
    }
  }

  // UI helper methods
  showLoader(message = 'Loading...') {
    document.querySelector('app-loader')?.show(message);
  }
  hideLoader() {
    document.querySelector('app-loader')?.hide();
  }
  disableSubmitButton() {
    const submitButton = document.getElementById('submit-button');
    if (submitButton) submitButton.disabled = true;
  }
  resetForm() {
    const form = document.getElementById('add-story-form');
    const photoPreview = document.getElementById('photo-preview');
    const mapContainer = document.getElementById('map-container');
    const locationCheckbox = document.getElementById('location-enabled');
    if (form) form.reset();
    if (photoPreview) {
      photoPreview.innerHTML = `<i class="fas fa-image preview-placeholder"></i>
      <img id="preview-image" class="hidden" alt="Preview of your photo">`;
    }
    if (mapContainer) mapContainer.classList.add('hidden');
    if (locationCheckbox) locationCheckbox.checked = false;
    const charCount = document.getElementById('char-count');
    if (charCount) {
      charCount.textContent = '0';
      charCount.classList.remove('text-warning', 'text-danger');
    }
  }

  // Alerts
  async showLoginRequiredAlert() {
    return Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'You need to login first',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4361ee',
    });
  }
  async showOfflineAlert() {
    return Swal.fire({
      icon: 'error',
      title: 'Offline Mode',
      text: 'Adding stories is not available without internet connection.',
      confirmButtonColor: '#4361ee',
    });
  }
  async showSuccessAlert() {
    return Swal.fire({
      icon: 'success',
      title: 'Story added successfully!',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  async showErrorAlert(message) {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message || 'Failed to add story',
      confirmButtonColor: '#4361ee',
    });
  }
  showProgressBar() {
    document.getElementById('progress-container')?.classList.remove('hidden');
  }
  hideProgressBar() {
    document.getElementById('progress-container')?.classList.add('hidden');
  }
  updateProgressBar(percent) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${percent}%`;
  }
  showFormValidationError() {
    Swal.fire({
      icon: 'warning',
      title: 'Form Validation Error',
      text: 'Please fix the errors in the form before submitting.',
      confirmButtonColor: '#4361ee',
    });
  }
  showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.classList.add('active');
    const confettiSettings = {
      target: canvas,
      max: 150,
      size: 1.5,
      animate: true,
      props: ['circle', 'square', 'triangle', 'line'],
      colors: [
        [165, 104, 246],
        [230, 61, 135],
        [0, 199, 228],
        [253, 214, 126],
      ],
      clock: 25,
      rotate: true,
      start_from_edge: true,
      respawn: false,
    };
    const confetti = window.confetti.create(canvas, confettiSettings);
    confetti({
      particleCount: 150,
      spread: 160,
    });
    setTimeout(() => {
      canvas.classList.remove('active');
    }, 3000);
  }
  setCloseCameraCallback(callback) {
    const closeButton = document.getElementById('close-camera');
    if (closeButton) closeButton.addEventListener('click', callback);
  }
}
