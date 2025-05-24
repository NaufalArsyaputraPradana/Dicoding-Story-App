import '../components/header';
import '../components/loader';
import '../components/footer';
import '../components/sidebar';
import AddStoryPresenter from '../presenter/add-story-presenter';

export default class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter({ view: this });
  }

  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container">
          <div class="add-story-container">
            <h1 class="page-title">Share Your Story</h1>
            
            <div class="recent-drafts-container" id="recent-drafts">
              <!-- Recent drafts will be loaded here if available -->
            </div>
            
            <form id="add-story-form" class="story-form">
              <div class="form-group">
                <label for="description" class="form-label">Story Description</label>
                <textarea
                  id="description"
                  class="form-control"
                  placeholder="Share your learning experience..."
                  rows="4"
                  required
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
              
              <!-- Progress bar container -->
              <div class="progress-container hidden" id="progress-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
              </div>
              
              <div class="form-actions">
                <a href="#/" class="cancel-button">Cancel</a>
                <button type="submit" class="submit-button">
                  <i class="fas fa-paper-plane"></i> Share Story
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
      <app-loader></app-loader>
      
      <!-- Confetti canvas for success animation -->
      <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
    `;
  }

  async afterRender() {
    this._presenter.init();
    this._presenter.loadRecentDrafts();
    this._setupCharCounter();
  }

  _setupCharCounter() {
    const textarea = document.getElementById('description');
    const charCount = document.getElementById('char-count');

    if (textarea && charCount) {
      textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        charCount.textContent = count;

        // Add visual indicator when approaching limit
        if (count > 240) {
          charCount.classList.add('text-warning');
        } else if (count > 270) {
          charCount.classList.remove('text-warning');
          charCount.classList.add('text-danger');
        } else {
          charCount.classList.remove('text-warning', 'text-danger');
        }
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

    // Show recent drafts section
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

    // Add event listeners
    document.querySelectorAll('.use-draft-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const draftId = btn.getAttribute('data-id');
        this._presenter.useDraft(draftId);
      });
    });
  }

  applyDraftToForm(description) {
    // Update the textarea
    const textarea = document.getElementById('description');
    if (textarea) {
      textarea.value = description;
      // Trigger input event to update character counter
      textarea.dispatchEvent(new Event('input'));
      // Focus and scroll to form
      textarea.focus();
      document
        .querySelector('.story-form')
        .scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Camera methods
  setOpenCameraCallback(callback) {
    const openCameraButton = document.querySelector('#camera-button');
    if (openCameraButton) {
      openCameraButton.addEventListener('click', callback);
    }
  }

  setTakePhotoCallback(callback) {
    const takePhotoButton = document.querySelector('#take-photo');
    if (takePhotoButton) {
      takePhotoButton.addEventListener('click', callback);
    }
  }

  showCameraStream(stream) {
    const cameraContainer = document.querySelector('#camera-container');
    const videoElement = document.querySelector('#camera-view');

    if (!cameraContainer || !videoElement) {
      console.error('Camera container or video element not found');
      return;
    }

    try {
      cameraContainer.classList.remove('hidden');
      videoElement.srcObject = stream;

      // Start playing the video when it's loaded
      videoElement.onloadedmetadata = () => {
        videoElement.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      };
    } catch (error) {
      console.error('Error showing camera stream:', error);
    }
  }

  capturePhoto() {
    const videoElement = document.querySelector('#camera-view');
    const canvas = document.querySelector('#camera-canvas');

    if (!videoElement || !canvas) {
      console.error('Video element or canvas not found');
      return null;
    }

    try {
      // Ensure video is playing and has dimensions
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        console.error('Video dimensions are zero, cannot capture photo');
        return null;
      }

      // Set canvas dimensions to match video
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw the video frame to the canvas
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      return null;
    }
  }

  showCameraFlash() {
    // Create camera flash effect
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    document.body.appendChild(flash);

    // Trigger the flash effect
    setTimeout(() => {
      flash.style.opacity = '0.8';

      // Remove the flash after animation
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

    if (cameraContainer) {
      cameraContainer.classList.add('hidden');
    }

    if (videoElement) {
      videoElement.srcObject = null;
    }
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
    const photoPreview = document.querySelector('#photo-preview');
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
    const photoError = document.querySelector('#photo-error');
    if (photoError) {
      photoError.textContent = message;
      photoError.style.display = 'block';
    }
  }

  clearPhotoError() {
    const photoError = document.querySelector('#photo-error');
    if (photoError) {
      photoError.textContent = '';
      photoError.style.display = 'none';
    }
  }

  // Location methods
  setLocationCheckboxCallback(callback) {
    const locationCheckbox = document.querySelector('#location-enabled');
    if (locationCheckbox) {
      locationCheckbox.addEventListener('change', () => {
        callback(locationCheckbox.checked);
      });
    }
  }

  showMapContainer() {
    const mapContainer = document.querySelector('#map-container');
    if (mapContainer) {
      mapContainer.classList.remove('hidden');
      // Fix map rendering
      setTimeout(() => {
        if (window.L && window.L.map) {
          const map = window.L.map._instances?.[0];
          if (map) {
            map.invalidateSize();
          }
        }
      }, 100);
    }
  }

  hideMapContainer() {
    const mapContainer = document.querySelector('#map-container');
    if (mapContainer) {
      mapContainer.classList.add('hidden');
    }
  }

  setLocateMeCallback(callback) {
    const locateMeButton = document.querySelector('#locate-me');
    if (locateMeButton) {
      locateMeButton.addEventListener('click', callback);
    }
  }

  setSearchLocationCallback(callback) {
    const searchLocationButton = document.querySelector('#search-location');
    if (searchLocationButton) {
      searchLocationButton.addEventListener('click', callback);
    }
  }

  updateLocationCoordinates(lat, lng) {
    const latInput = document.querySelector('#lat');
    const lonInput = document.querySelector('#lon');
    const locationText = document.querySelector('#location-text');

    if (latInput && lonInput) {
      latInput.value = lat;
      lonInput.value = lng;
    }

    // Update location text if available
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
    const form = document.querySelector('#add-story-form');
    if (!form) {
      console.error('Form not found: #add-story-form');
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const description = this.getDescription();
      const photoInput = document.querySelector('#photo');
      const photoFile = photoInput.files[0];
      const useLocation = document.querySelector('#location-enabled').checked;
      const lat = document.querySelector('#lat').value;
      const lon = document.querySelector('#lon').value;

      const formData = new FormData();
      formData.append('description', description);

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      if (useLocation && lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      callback(formData);
    });
  }

  getDescription() {
    const descriptionInput = document.querySelector('#description');
    return descriptionInput ? descriptionInput.value.trim() : '';
  }

  setDescriptionInputCallback(callback) {
    const descriptionInput = document.querySelector('#description');
    if (descriptionInput) {
      descriptionInput.addEventListener('input', () => {
        // Ensure the input value is properly trimmed
        const trimmedValue = descriptionInput.value.trim();
        callback(trimmedValue);
      });
    }
  }

  showDescriptionError(message) {
    const descriptionError = document.querySelector('#description-error');
    if (descriptionError) {
      descriptionError.textContent = message;
      descriptionError.style.display = 'block';

      // Highlight the description field
      const descriptionInput = document.querySelector('#description');
      if (descriptionInput) {
        descriptionInput.classList.add('error');
        descriptionInput.setAttribute('aria-invalid', 'true');
      }
    }
  }

  clearDescriptionError() {
    const descriptionError = document.querySelector('#description-error');
    if (descriptionError) {
      descriptionError.textContent = '';
      descriptionError.style.display = 'none';

      // Remove highlight from the description field
      const descriptionInput = document.querySelector('#description');
      if (descriptionInput) {
        descriptionInput.classList.remove('error');
        descriptionInput.setAttribute('aria-invalid', 'false');
      }
    }
  }

  // UI helper methods
  showLoader(message = 'Loading...') {
    const loader = document.querySelector('app-loader');
    if (loader) loader.show(message);
  }

  hideLoader() {
    const loader = document.querySelector('app-loader');
    if (loader) loader.hide();
  }

  disableSubmitButton() {
    const submitButton = document.querySelector('#submit-button');
    if (submitButton) submitButton.disabled = true;
  }

  resetForm() {
    const form = document.querySelector('#add-story-form');
    const photoPreview = document.querySelector('#photo-preview');
    const mapContainer = document.querySelector('#map-container');
    const locationCheckbox = document.querySelector('#location-enabled');

    if (form) form.reset();

    if (photoPreview) {
      photoPreview.innerHTML = `<i class="fas fa-image preview-placeholder"></i>
      <img id="preview-image" class="hidden" alt="Preview of your photo">`;
    }

    if (mapContainer) {
      mapContainer.classList.add('hidden');
    }

    if (locationCheckbox) {
      locationCheckbox.checked = false;
    }

    // Reset character counter
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
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.classList.remove('hidden');
    }
  }

  hideProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.classList.add('hidden');
    }
  }

  updateProgressBar(percent) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
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

    // Make canvas visible
    canvas.classList.add('active');

    // Configure confetti
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

    // Start confetti animation
    const confetti = window.confetti.create(canvas, confettiSettings);
    confetti({
      particleCount: 150,
      spread: 160,
    });

    // Remove canvas after animation completes
    setTimeout(() => {
      canvas.classList.remove('active');
    }, 3000);
  }

  // Set close camera button event
  setCloseCameraCallback(callback) {
    const closeButton = document.querySelector('#close-camera');
    if (closeButton) {
      closeButton.addEventListener('click', callback);
    }
  }
}
