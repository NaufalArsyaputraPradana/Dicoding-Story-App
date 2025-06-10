import DicodingStoryApi from '../../data/api';
import CONFIG from '../../config';
import { formatFileSize } from '../../utils/index';

export default class AddPresenter {
  #view;
  _photoFile = null;
  _map = null;
  _marker = null;
  _cameraStream = null;
  _mapInitialized = false;

  constructor({ view }) {
    this.#view = view;
    window.addEventListener('hashchange', () => this.stopCamera());
    window.addEventListener('beforeunload', () => this.stopCamera());
  }

  init() {
    this._setupForm();
    this._setupPhotoPreview();
    this._setupCamera();
    this._setupLocationCheckbox();
    this._setupInputValidation();
    this._setupAutoSaveDraft();
    this._checkMediaPermissions();
  }

  // Drafts
  loadRecentDrafts() {
    try {
      const recentsJson = localStorage.getItem('recentDrafts');
      if (!recentsJson) {
        this.#view.displayRecentDrafts([]);
        return;
      }
      const recents = JSON.parse(recentsJson);
      this.#view.displayRecentDrafts(recents);
    } catch (error) {
      console.error('Error loading recent drafts:', error);
      this.#view.displayRecentDrafts([]);
    }
  }

  useDraft(draftId) {
    try {
      const recentsJson = localStorage.getItem('recentDrafts');
      if (!recentsJson) return;
      const recents = JSON.parse(recentsJson);
      const draft = recents.find((d) => d.id === draftId);
      if (draft) {
        let description = draft.fullDescription || draft.description;
        this.#view.applyDraftToForm(description);
      }
    } catch (error) {
      console.error('Error using draft:', error);
    }
  }

  _setupAutoSaveDraft() {
    let draftTimeout;
    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
      descriptionInput.addEventListener('input', () => {
        clearTimeout(draftTimeout);
        draftTimeout = setTimeout(() => {
          this._saveDraft(descriptionInput.value);
        }, 30000); // 30 detik tanpa aktivitas
      });
    }
  }

  _saveDraft(text) {
    if (!text || text.trim().length < 5) return;
    try {
      const draftsJson = localStorage.getItem('recentDrafts');
      let drafts = draftsJson ? JSON.parse(draftsJson) : [];
      const preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
      const newDraft = {
        id: Date.now().toString(),
        description: preview,
        fullDescription: text,
        timestamp: new Date().toISOString(),
      };
      drafts.unshift(newDraft);
      drafts = drafts.slice(0, 5);
      localStorage.setItem('recentDrafts', JSON.stringify(drafts));
      window.showToast && window.showToast('Draft saved automatically', 'info');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  // Camera
  _checkMediaPermissions() {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'camera' })
        .then((permissionStatus) => {
          const cameraButton = document.getElementById('camera-button');
          if (permissionStatus.state === 'denied' && cameraButton) {
            cameraButton.classList.add('permission-denied');
            cameraButton.title =
              'Camera permission denied. Please update your browser settings.';
          }
          permissionStatus.onchange = () => {
            if (cameraButton) {
              if (permissionStatus.state === 'denied') {
                cameraButton.classList.add('permission-denied');
                cameraButton.title =
                  'Camera permission denied. Please update your browser settings.';
              } else {
                cameraButton.classList.remove('permission-denied');
                cameraButton.title = '';
              }
            }
          };
        })
        .catch((error) => {
          console.log('Error checking camera permission:', error);
        });
    }
  }

  stopCamera() {
    if (this._cameraStream) {
      try {
        this._cameraStream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Error stopping camera tracks:', error);
      }
      this._cameraStream = null;
      if (this.#view) this.#view.resetCameraUI();
    }
  }

  _setupCamera() {
    this.#view.setOpenCameraCallback(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support camera access');
        }
        this.stopCamera();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        this._cameraStream = stream;
        this.#view.showCameraStream(stream);
        window.addEventListener('beforeunload', () => this.stopCamera(), {
          once: true,
        });
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.#view.showCameraError(
            'Camera access denied. Please allow camera access in your browser settings.'
          );
        } else if (error.name === 'NotFoundError') {
          this.#view.showCameraError(
            'No camera found on your device or camera is in use by another application.'
          );
        } else if (error.name === 'NotReadableError') {
          this.#view.showCameraError(
            'Could not access camera. Your camera might be in use by another application.'
          );
        } else if (error.name === 'OverconstrainedError') {
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            this._cameraStream = fallbackStream;
            this.#view.showCameraStream(fallbackStream);
          } catch {
            this.#view.showCameraError(
              'Could not access camera with requested settings. Please try a different device.'
            );
          }
        } else {
          this.#view.showCameraError(
            'Could not access camera: ' + (error.message || 'Unknown error')
          );
        }
      }
    });

    this.#view.setTakePhotoCallback(() => {
      if (!this._cameraStream) {
        this.#view.showCameraError('Camera is not ready. Please try again.');
        return;
      }
      try {
        const dataUrl = this.#view.capturePhoto();
        if (!dataUrl) {
          this.#view.showCameraError('Failed to capture photo');
          return;
        }
        this.#view.showCameraFlash();
        const filename = 'camera-photo-' + new Date().getTime() + '.jpg';
        const file = this._dataURLToFile(dataUrl, filename);
        if (!file) {
          this.#view.showCameraError('Failed to process captured photo');
          return;
        }
        if (file.size > CONFIG.MAX_PHOTO_SIZE) {
          this.#view.showPhotoError(
            `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_PHOTO_SIZE)}`
          );
          return;
        }
        this._photoFile = file;
        this.#view.showPhotoPreview(file);
        window.showToast &&
          window.showToast('Photo captured successfully!', 'success');
        setTimeout(() => this.stopCamera(), 500);
      } catch (error) {
        this.#view.showCameraError('Error capturing photo: ' + error.message);
      }
    });

    this.#view.setCloseCameraCallback(() => this.stopCamera());
  }

  _dataURLToFile(dataUrl, filename) {
    try {
      if (
        !dataUrl ||
        typeof dataUrl !== 'string' ||
        !dataUrl.startsWith('data:image/')
      )
        return null;
      const arr = dataUrl.split(',');
      if (arr.length !== 2) return null;
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch || mimeMatch.length < 2) return null;
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      return null;
    }
  }

  _setupPhotoPreview() {
    this.#view.setPhotoInputCallback((file) => {
      if (!file) return;
      if (file.size > CONFIG.MAX_PHOTO_SIZE) {
        this.#view.showPhotoError(
          `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_PHOTO_SIZE)}`
        );
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        this.#view.showPhotoError('Only JPEG and PNG images are allowed');
        return;
      }
      this._photoFile = file;
      this.#view.clearPhotoError();
      this.#view.showPhotoPreview(file);
    });
  }

  // Form
  _setupForm() {
    this.#view.setSubmitCallback(async (formData) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        await this.#view.showLoginRequiredAlert();
        window.location.hash = '#/login';
        return;
      }
      if (!this._validateForm()) {
        this.#view.showFormValidationError();
        return;
      }
      if (!formData.has('description') || !formData.get('description').trim()) {
        this.#view.showDescriptionError('Description is required');
        this.#view.showFormValidationError();
        return;
      }
      if (!formData.has('photo') || !formData.get('photo')) {
        if (this._photoFile) {
          formData.set('photo', this._photoFile);
        } else {
          this.#view.showPhotoError('Please select or take a photo');
          this.#view.showFormValidationError();
          return;
        }
      }
      this.#view.showLoader('Saving your story...');
      this.#view.showProgressBar();
      try {
        await DicodingStoryApi.addNewStory({
          token,
          data: formData,
          onProgress: (progress) => this.#view.updateProgressBar(progress),
        });
        this.#view.updateProgressBar(100);
        setTimeout(() => this.#view.hideProgressBar(), 500);
        await this.#view.showSuccessAlert();
        this.#view.showConfetti();
        this._addToRecents(formData.get('description'));
        setTimeout(() => {
          window.location.hash = '#/';
          this.#view.resetForm();
          this.stopCamera();
        }, 1000);
      } catch (error) {
        this.#view.hideProgressBar();
        this.#view.showErrorAlert(error.message);
      } finally {
        this.#view.hideLoader();
      }
    });
  }

  _setupInputValidation() {
    this.#view.setDescriptionInputCallback((value) =>
      this._validateDescription(value)
    );
  }

  _validateDescription(description) {
    if (!description) {
      this.#view.showDescriptionError('Please enter a description');
      return false;
    }
    if (description.length < 10) {
      this.#view.showDescriptionError(
        'Description must be at least 10 characters'
      );
      return false;
    }
    const sensitiveWords = ['judi', 'poker', 'togel', 'seks', 'adult', 'xxx'];
    const containsSensitiveContent = sensitiveWords.some((word) =>
      description.toLowerCase().includes(word)
    );
    if (containsSensitiveContent) {
      this.#view.showDescriptionError(
        'Your story may contain inappropriate content. Please revise.'
      );
      return false;
    }
    this.#view.clearDescriptionError();
    return true;
  }

  _validateForm() {
    const isDescriptionValid = this._validateDescription(
      this.#view.getDescription()
    );
    const isPhotoValid = this._validatePhoto();
    return isDescriptionValid && isPhotoValid;
  }

  _validatePhoto() {
    if (!this._photoFile) {
      const photoInput = document.getElementById('photo');
      if (photoInput && photoInput.files.length > 0) {
        this._photoFile = photoInput.files[0];
      } else {
        const photoPreview = document.querySelector('#photo-preview img');
        if (!photoPreview || photoPreview.classList.contains('hidden')) {
          this.#view.showPhotoError('Please select or take a photo');
          return false;
        }
      }
    }
    if (this._photoFile && this._photoFile.size > CONFIG.MAX_PHOTO_SIZE) {
      this.#view.showPhotoError(
        `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_PHOTO_SIZE)}`
      );
      return false;
    }
    return true;
  }

  // Location/Map
  _setupLocationCheckbox() {
    this.#view.setLocationCheckboxCallback((isChecked) => {
      if (isChecked) {
        this.#view.showMapContainer();
        if (!this._mapInitialized) {
          setTimeout(() => this._initMap(), 300);
        } else if (this._map) {
          this._map.invalidateSize();
        }
      } else {
        this.#view.hideMapContainer();
      }
    });
  }

  _initMap() {
    if (!window.L) {
      this.#view.showMapError(
        'Map library not loaded. Please check your internet connection and reload the page.'
      );
      return;
    }
    try {
      const mapElement = document.getElementById('map');
      if (!mapElement) return;
      this._map = L.map('map', {
        zoomControl: true,
        attributionControl: true,
      }).setView(CONFIG.DEFAULT_MAP_CENTER, CONFIG.DEFAULT_MAP_ZOOM);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this._map);
      setTimeout(() => this._map.invalidateSize(), 100);
      this._mapInitialized = true;
      if (window.L.Control && window.L.Control.Geocoder) {
        const geocoder = L.Control.Geocoder.nominatim({
          geocodingQueryParams: { countrycodes: 'id', limit: 5 },
        });
        const control = L.Control.geocoder({
          defaultMarkGeocode: false,
          geocoder: geocoder,
          placeholder: 'Search for places...',
          errorMessage: 'Nothing found.',
          suggestMinLength: 3,
          suggestTimeout: 250,
          queryMinLength: 1,
        }).addTo(this._map);
        control.on('markgeocode', (e) => {
          const { lat, lng } = e.geocode.center;
          this._updateLocation(lat, lng);
          this._map.setView([lat, lng], 15);
        });
      }
      if (window.L.control && window.L.control.locate) {
        L.control
          .locate({
            position: 'topright',
            strings: { title: 'Temukan lokasi saya' },
            locateOptions: { enableHighAccuracy: true, maxZoom: 15 },
            flyTo: true,
          })
          .addTo(this._map);
      }
      this._map.on('click', (e) =>
        this._updateLocation(e.latlng.lat, e.latlng.lng)
      );
      this.#view.setLocateMeCallback(() => {
        if ('geolocation' in navigator) {
          this.#view.showLoader('Finding your location...');
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.#view.hideLoader();
              const { latitude, longitude } = position.coords;
              this._updateLocation(latitude, longitude);
              this._map.setView([latitude, longitude], 15);
              window.showToast &&
                window.showToast('Location found!', 'success');
            },
            (error) => {
              this.#view.hideLoader();
              let errorMessage = 'Could not get your location.';
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage =
                    'Location access denied. Please check your browser settings.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = 'Location information is unavailable.';
                  break;
                case error.TIMEOUT:
                  errorMessage = 'Location request timed out.';
                  break;
              }
              this.#view.showMapError(errorMessage);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          this.#view.showMapError(
            'Geolocation is not supported by your browser'
          );
        }
      });
      this.#view.setSearchLocationCallback(() => {
        const geocoderControl = document.querySelector(
          '.leaflet-control-geocoder'
        );
        if (geocoderControl) {
          try {
            const searchButton = geocoderControl.querySelector(
              '.leaflet-control-geocoder-icon'
            );
            const searchInput = geocoderControl.querySelector('input');
            if (searchButton) searchButton.click();
            if (searchInput) searchInput.focus();
          } catch {
            this._showLocationSearchPrompt();
          }
        } else {
          this._showLocationSearchPrompt();
        }
      });
    } catch (error) {
      this.#view.showMapError('Failed to initialize map: ' + error.message);
    }
  }

  _showLocationSearchPrompt() {
    Swal.fire({
      title: 'Search Location',
      input: 'text',
      inputPlaceholder: 'Enter a place or address',
      showCancelButton: true,
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Search',
      showLoaderOnConfirm: true,
      preConfirm: (query) => {
        if (!query) {
          Swal.showValidationMessage('Please enter a location');
          return;
        }
        return fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        )
          .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Search failed: ${error.message}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed && result.value && result.value.length > 0) {
        const locations = result.value;
        if (locations.length === 1) {
          const location = locations[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          this._updateLocation(lat, lon);
          if (this._map) this._map.setView([lat, lon], 15);
        } else if (locations.length > 1) {
          const options = locations.map((loc) => ({
            text: loc.display_name,
            value: loc.place_id,
            lat: parseFloat(loc.lat),
            lon: parseFloat(loc.lon),
          }));
          Swal.fire({
            title: 'Select Location',
            input: 'radio',
            inputOptions: options.reduce((acc, opt) => {
              acc[opt.value] = opt.text;
              return acc;
            }, {}),
            showCancelButton: true,
            confirmButtonColor: '#4361ee',
            confirmButtonText: 'Select',
          }).then((result) => {
            if (result.isConfirmed) {
              const selectedOption = options.find(
                (opt) => opt.value.toString() === result.value
              );
              if (selectedOption) {
                this._updateLocation(selectedOption.lat, selectedOption.lon);
                if (this._map)
                  this._map.setView(
                    [selectedOption.lat, selectedOption.lon],
                    15
                  );
              }
            }
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No Results',
            text: 'No locations found for your search.',
          });
        }
      }
    });
  }

  _updateLocation(lat, lng) {
    this.#view.updateLocationCoordinates(lat, lng);
    if (this._marker) {
      this._marker.setLatLng([lat, lng]);
    } else if (this._map) {
      this._marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
      }).addTo(this._map);
      this._marker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        this._updateLocation(position.lat, position.lng);
      });
    }
    if (this._map) {
      this._map.setView([lat, lng], this._map.getZoom() || 15);
      const locationText = document.getElementById('location-text');
      if (locationText) {
        locationText.innerHTML = `
          <span class="loading-dots">Getting location name</span>
          <br>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}
        `;
      }
      this._reverseGeocode(lat, lng);
    }
  }

  _reverseGeocode(lat, lng) {
    if (window.L && window.L.Control && window.L.Control.Geocoder) {
      try {
        const geocoder = L.Control.Geocoder.nominatim();
        if (geocoder) {
          geocoder.reverse({ lat, lng }, this._map.getZoom(), (results) => {
            if (results && results.length > 0) {
              const locationName = results[0].name;
              const locationText = document.getElementById('location-text');
              if (locationText && locationName) {
                locationText.innerHTML = `
                  <strong>${locationName}</strong>
                  <br>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}
                `;
              }
            }
          });
          return;
        }
      } catch (error) {
        console.warn('Leaflet reverse geocoding failed:', error);
      }
    }
    // Fallback to Nominatim API
    try {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.display_name) {
            const locationText = document.getElementById('location-text');
            if (locationText) {
              locationText.innerHTML = `
                <strong>${data.display_name}</strong>
                <br>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}
              `;
            }
          }
        })
        .catch((error) => {
          const locationText = document.getElementById('location-text');
          if (locationText) {
            locationText.textContent = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          }
        });
    } catch (error) {
      // fallback
    }
  }

  _addToRecents(description) {
    try {
      const recentsJson = localStorage.getItem('recentDrafts');
      let recents = recentsJson ? JSON.parse(recentsJson) : [];
      const preview =
        description.substring(0, 50) + (description.length > 50 ? '...' : '');
      recents.unshift({
        description: preview,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      });
      recents = recents.slice(0, 5);
      localStorage.setItem('recentDrafts', JSON.stringify(recents));
    } catch (error) {
      console.error('Error saving to recents:', error);
    }
  }
}
