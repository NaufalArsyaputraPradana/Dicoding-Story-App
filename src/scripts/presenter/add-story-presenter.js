import DicodingStoryApi from '../data/api';
import CONFIG from '../config';
import { formatFileSize, isOnline } from '../utils/index';

class AddStoryPresenter {
  constructor({ view }) {
    this._view = view;
    this._photoFile = null;
    this._map = null;
    this._marker = null;
    this._cameraStream = null;
    this._mapInitialized = false;

    // Set up navigation event handling to ensure camera is stopped when navigating away
    window.addEventListener('hashchange', () => {
      this.stopCamera();
    });

    // Also stop camera when the page is unloaded
    window.addEventListener('beforeunload', () => {
      this.stopCamera();
    });
  }

  init() {
    this._setupForm();
    this._setupPhotoPreview();
    this._setupCamera();
    this._setupLocationCheckbox();
    this._setupInputValidation();
    this._setupAutoSaveDraft();

    // Check permissions ahead of time
    this._checkMediaPermissions();
  }

  loadRecentDrafts() {
    try {
      const recentsJson = localStorage.getItem('recentDrafts');
      if (!recentsJson) {
        this._view.displayRecentDrafts([]);
        return;
      }

      const recents = JSON.parse(recentsJson);
      this._view.displayRecentDrafts(recents);
    } catch (error) {
      console.error('Error loading recent drafts:', error);
      this._view.displayRecentDrafts([]);
    }
  }

  useDraft(draftId) {
    try {
      const recentsJson = localStorage.getItem('recentDrafts');
      if (!recentsJson) return;

      const recents = JSON.parse(recentsJson);
      const draft = recents.find((d) => d.id === draftId);

      if (draft) {
        // Extract full description if available
        let description = draft.fullDescription || draft.description;
        this._view.applyDraftToForm(description);
      }
    } catch (error) {
      console.error('Error using draft:', error);
    }
  }

  _checkMediaPermissions() {
    // Check if browser supports permissions API
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'camera' })
        .then((permissionStatus) => {
          console.log('Camera permission status:', permissionStatus.state);
          // We could update the UI based on permission state
          if (permissionStatus.state === 'denied') {
            const cameraButton = document.querySelector('#camera-button');
            if (cameraButton) {
              cameraButton.classList.add('permission-denied');
              cameraButton.title =
                'Camera permission denied. Please update your browser settings.';
            }
          }

          // Listen for changes in permission state
          permissionStatus.onchange = () => {
            console.log(
              'Camera permission status changed to:',
              permissionStatus.state
            );
            const cameraButton = document.querySelector('#camera-button');
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
        const tracks = this._cameraStream.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (error) {
        console.error('Error stopping camera tracks:', error);
      }
      this._cameraStream = null;

      // Also reset the camera UI
      if (this._view) {
        this._view.resetCameraUI();
      }
    }
  }

  _setupAutoSaveDraft() {
    // Autosave draft every 30 seconds
    let draftTimeout;
    const descriptionInput = document.querySelector('#description');

    if (descriptionInput) {
      descriptionInput.addEventListener('input', () => {
        clearTimeout(draftTimeout);
        draftTimeout = setTimeout(() => {
          this._saveDraft(descriptionInput.value);
        }, 30000); // Save after 30 seconds of inactivity
      });
    }
  }

  _saveDraft(text) {
    if (!text || text.trim().length < 5) return; // Don't save very short drafts

    try {
      // Get existing drafts
      const draftsJson = localStorage.getItem('recentDrafts');
      let drafts = draftsJson ? JSON.parse(draftsJson) : [];

      // Create a new draft
      const preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
      const newDraft = {
        id: Date.now().toString(),
        description: preview,
        fullDescription: text,
        timestamp: new Date().toISOString(),
      };

      // Add to beginning of array
      drafts.unshift(newDraft);

      // Limit to 5 drafts
      drafts = drafts.slice(0, 5);

      // Save back to localStorage
      localStorage.setItem('recentDrafts', JSON.stringify(drafts));

      // Show toast notification
      window.showToast && window.showToast('Draft saved automatically', 'info');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  _setupForm() {
    this._view.setSubmitCallback(async (formData) => {
      const token = localStorage.getItem('token');
      if (!token) {
        await this._view.showLoginRequiredAlert();
        window.location.hash = '#/login';
        return;
      }

      // Validate form before submission
      if (!this._validateForm()) {
        this._view.showFormValidationError();
        return;
      }

      // Double-check that formData has required fields
      if (!formData.has('description') || !formData.get('description').trim()) {
        this._view.showDescriptionError('Description is required');
        this._view.showFormValidationError();
        return;
      }

      // Ensure photo is included in formData
      if (!formData.has('photo') || !formData.get('photo')) {
        // If we have a photo in memory but it's not in formData, add it
        if (this._photoFile) {
          formData.set('photo', this._photoFile);
        } else {
          this._view.showPhotoError('Please select or take a photo');
          this._view.showFormValidationError();
          return;
        }
      }

      this._view.showLoader('Saving your story...');
      this._view.showProgressBar();

      try {
        await DicodingStoryApi.addNewStory({
          token,
          data: formData,
          onProgress: (progress) => {
            this._view.updateProgressBar(progress);
          },
        });

        // Reset progress bar after completion
        this._view.updateProgressBar(100);

        setTimeout(() => {
          this._view.hideProgressBar();
        }, 500);

        await this._view.showSuccessAlert();

        // Apply confetti animation for success
        this._view.showConfetti();

        // Add story to recents
        this._addToRecents(formData.get('description'));

        // Navigate home after a short delay for better UX
        setTimeout(() => {
          window.location.hash = '#/';
          this._view.resetForm();

          // Make sure camera is stopped
          this.stopCamera();
        }, 1000);
      } catch (error) {
        this._view.hideProgressBar();
        this._view.showErrorAlert(error.message);
      } finally {
        this._view.hideLoader();
      }
    });
  }

  _setupPhotoPreview() {
    this._view.setPhotoInputCallback((file) => {
      if (!file) return;

      // Validate file size
      if (file.size > CONFIG.MAX_PHOTO_SIZE) {
        this._view.showPhotoError(
          `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_PHOTO_SIZE)}`
        );
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        this._view.showPhotoError('Only JPEG and PNG images are allowed');
        return;
      }

      this._photoFile = file;
      this._view.clearPhotoError();
      this._view.showPhotoPreview(file);
    });
  }

  _setupCamera() {
    this._view.setOpenCameraCallback(async () => {
      try {
        // Check if browser supports mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support camera access');
        }

        // First attempt to stop any existing streams
        this.stopCamera();

        // Try accessing the camera with environment (back camera) preference
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        this._cameraStream = stream;
        this._view.showCameraStream(stream);

        // Make sure we clean up the camera stream when page unloads
        window.addEventListener(
          'beforeunload',
          () => {
            this.stopCamera();
          },
          { once: true }
        );
      } catch (error) {
        console.error('Error accessing camera:', error);

        // Provide more specific error messages based on error type
        if (error.name === 'NotAllowedError') {
          this._view.showCameraError(
            'Camera access denied. Please allow camera access in your browser settings.'
          );
        } else if (error.name === 'NotFoundError') {
          this._view.showCameraError(
            'No camera found on your device or camera is in use by another application.'
          );
        } else if (error.name === 'NotReadableError') {
          this._view.showCameraError(
            'Could not access camera. Your camera might be in use by another application.'
          );
        } else if (error.name === 'OverconstrainedError') {
          // Try again with less constraints
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            this._cameraStream = fallbackStream;
            this._view.showCameraStream(fallbackStream);
          } catch (fallbackError) {
            this._view.showCameraError(
              'Could not access camera with requested settings. Please try a different device.'
            );
          }
        } else {
          this._view.showCameraError(
            'Could not access camera: ' + (error.message || 'Unknown error')
          );
        }
      }
    });

    this._view.setTakePhotoCallback(() => {
      if (!this._cameraStream) {
        console.error('Cannot take photo: Camera stream is not available');
        this._view.showCameraError('Camera is not ready. Please try again.');
        return;
      }

      try {
        const dataUrl = this._view.capturePhoto();
        if (!dataUrl) {
          console.error('Failed to capture photo: null data URL');
          this._view.showCameraError('Failed to capture photo');
          return;
        }

        // Add flash effect
        this._view.showCameraFlash();

        // Convert data URL to file object
        const filename = 'camera-photo-' + new Date().getTime() + '.jpg';
        const file = this._dataURLToFile(dataUrl, filename);

        if (!file) {
          console.error('Failed to convert data URL to file');
          this._view.showCameraError('Failed to process captured photo');
          return;
        }

        // Check file size for camera capture (same as photo upload validation)
        if (file.size > CONFIG.MAX_PHOTO_SIZE) {
          this._view.showPhotoError(
            `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_PHOTO_SIZE)}`
          );
          return;
        }

        this._photoFile = file;
        this._view.showPhotoPreview(file);

        // Provide feedback that photo was captured successfully
        window.showToast &&
          window.showToast('Photo captured successfully!', 'success');

        // Stop camera after successful capture
        setTimeout(() => {
          this.stopCamera();
        }, 500);
      } catch (error) {
        console.error('Error taking photo:', error);
        this._view.showCameraError('Error capturing photo: ' + error.message);
      }
    });

    // Setup close camera button
    this._view.setCloseCameraCallback(() => {
      this.stopCamera();
    });
  }

  _dataURLToFile(dataUrl, filename) {
    try {
      if (
        !dataUrl ||
        typeof dataUrl !== 'string' ||
        !dataUrl.startsWith('data:image/')
      ) {
        console.error('Invalid data URL format');
        return null;
      }

      const arr = dataUrl.split(',');
      if (arr.length !== 2) {
        console.error('Invalid data URL structure');
        return null;
      }

      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch || mimeMatch.length < 2) {
        console.error('Could not extract MIME type from data URL');
        return null;
      }

      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      return null;
    }
  }

  _setupLocationCheckbox() {
    this._view.setLocationCheckboxCallback((isChecked) => {
      if (isChecked) {
        this._view.showMapContainer();
        if (!this._mapInitialized) {
          // Initialize map with a small delay to ensure DOM is ready
          setTimeout(() => {
            this._initMap();
          }, 300);
        } else if (this._map) {
          // If map was already initialized, just invalidate the size
          this._map.invalidateSize();
        }
      } else {
        this._view.hideMapContainer();
      }
    });
  }

  _setupInputValidation() {
    this._view.setDescriptionInputCallback((value) => {
      this._validateDescription(value);
    });
  }

  _validateDescription(description) {
    if (!description) {
      this._view.showDescriptionError('Please enter a description');
      return false;
    }

    if (description.length < 10) {
      this._view.showDescriptionError(
        'Description must be at least 10 characters'
      );
      return false;
    }

    // Check for potentially inappropriate content
    const sensitiveWords = ['judi', 'poker', 'togel', 'seks', 'adult', 'xxx'];
    const containsSensitiveContent = sensitiveWords.some((word) =>
      description.toLowerCase().includes(word)
    );

    if (containsSensitiveContent) {
      this._view.showDescriptionError(
        'Your story may contain inappropriate content. Please revise.'
      );
      return false;
    }

    this._view.clearDescriptionError();
    return true;
  }

  _validateForm() {
    const isDescriptionValid = this._validateDescription(
      this._view.getDescription()
    );
    const isPhotoValid = this._validatePhoto();

    return isDescriptionValid && isPhotoValid;
  }

  _validatePhoto() {
    // Photo input bisa dari file input atau dari kamera
    if (!this._photoFile) {
      const photoInput = document.querySelector('#photo');
      // Coba cek apakah ada photo file yang dipilih
      if (photoInput && photoInput.files.length > 0) {
        this._photoFile = photoInput.files[0];
      } else {
        // Cek apakah ada preview image yang sudah diambil dari kamera
        const photoPreview = document.querySelector('#photo-preview img');
        if (!photoPreview || photoPreview.classList.contains('hidden')) {
          this._view.showPhotoError('Please select or take a photo');
          return false;
        }
      }
    }

    // Validate file size if we have a photo file
    if (this._photoFile && this._photoFile.size > CONFIG.MAX_PHOTO_SIZE) {
      this._view.showPhotoError(
        `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_PHOTO_SIZE)}`
      );
      return false;
    }

    return true;
  }

  _initMap() {
    if (!window.L) {
      console.error('Leaflet library not loaded!');
      this._view.showMapError(
        'Map library not loaded. Please check your internet connection and reload the page.'
      );
      return;
    }

    try {
      // Pastikan elemen map ada
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map container element not found');
        return;
      }

      console.log('Initializing map...');

      // Buat instance peta dengan koordinat default Indonesia
      this._map = L.map('map', {
        zoomControl: true,
        attributionControl: true,
      }).setView(CONFIG.DEFAULT_MAP_CENTER, CONFIG.DEFAULT_MAP_ZOOM);

      // Tambahkan tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this._map);

      // Perbaiki tampilan peta setelah dirender
      setTimeout(() => {
        if (this._map) {
          console.log('Invalidating map size');
          this._map.invalidateSize();
        }
      }, 100);

      // Mark that map has been initialized
      this._mapInitialized = true;

      // Tambahkan geocoder jika tersedia
      if (window.L.Control && window.L.Control.Geocoder) {
        const geocoder = L.Control.Geocoder.nominatim({
          geocodingQueryParams: {
            countrycodes: 'id', // Default to Indonesia
            limit: 5,
          },
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

          // Zoom to location
          this._map.setView([lat, lng], 15);
        });
      } else {
        console.warn('Geocoder control not available');
      }

      // Tambahkan locate control for finding user's location
      if (window.L.control && window.L.control.locate) {
        L.control
          .locate({
            position: 'topright',
            strings: {
              title: 'Temukan lokasi saya',
            },
            locateOptions: {
              enableHighAccuracy: true,
              maxZoom: 15,
            },
            flyTo: true,
          })
          .addTo(this._map);
      } else {
        console.warn('Locate control not available');
      }

      // Handle map click
      this._map.on('click', (e) => {
        this._updateLocation(e.latlng.lat, e.latlng.lng);
      });

      // Setup locate me button
      this._view.setLocateMeCallback(() => {
        if ('geolocation' in navigator) {
          // Show loader while waiting for location
          this._view.showLoader('Finding your location...');

          navigator.geolocation.getCurrentPosition(
            (position) => {
              this._view.hideLoader();
              const { latitude, longitude } = position.coords;
              this._updateLocation(latitude, longitude);
              this._map.setView([latitude, longitude], 15);
              window.showToast &&
                window.showToast('Location found!', 'success');
            },
            (error) => {
              this._view.hideLoader();
              console.error('Geolocation error:', error);
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

              this._view.showMapError(errorMessage);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          this._view.showMapError(
            'Geolocation is not supported by your browser'
          );
        }
      });

      // Setup search location button
      this._view.setSearchLocationCallback(() => {
        const geocoderControl = document.querySelector(
          '.leaflet-control-geocoder'
        );

        if (geocoderControl) {
          try {
            // Try to expand the geocoder control
            const searchButton = geocoderControl.querySelector(
              '.leaflet-control-geocoder-icon'
            );
            const searchInput = geocoderControl.querySelector('input');

            if (searchButton) {
              searchButton.click();
            }

            if (searchInput) {
              searchInput.focus();
            }
          } catch (error) {
            console.error('Error expanding geocoder:', error);

            // Fallback - show a simple prompt
            this._showLocationSearchPrompt();
          }
        } else {
          // Geocoder not available, show custom search prompt
          this._showLocationSearchPrompt();
        }
      });

      console.log('Map initialization complete');
    } catch (error) {
      console.error('Error initializing map:', error);
      this._view.showMapError('Failed to initialize map: ' + error.message);
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

        // Try to find location using Nominatim API
        return fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
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
          // Only one result, use it immediately
          const location = locations[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);

          this._updateLocation(lat, lon);
          if (this._map) {
            this._map.setView([lat, lon], 15);
          }
        } else if (locations.length > 1) {
          // Multiple results, let user pick one
          const options = locations.map((loc) => {
            return {
              text: loc.display_name,
              value: loc.place_id,
              lat: parseFloat(loc.lat),
              lon: parseFloat(loc.lon),
            };
          });

          Swal.fire({
            title: 'Select Location',
            input: 'radio',
            inputOptions: options.reduce((acc, opt, idx) => {
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
                if (this._map) {
                  this._map.setView(
                    [selectedOption.lat, selectedOption.lon],
                    15
                  );
                }
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
    // Update form values
    this._view.updateLocationCoordinates(lat, lng);

    // Update marker
    if (this._marker) {
      this._marker.setLatLng([lat, lng]);
    } else if (this._map) {
      this._marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
      }).addTo(this._map);

      // Allow marker to be dragged to adjust location
      this._marker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        this._updateLocation(position.lat, position.lng);
      });
    }

    // Center map
    if (this._map) {
      this._map.setView([lat, lng], this._map.getZoom() || 15);

      // Update location text in UI with loading state
      const locationText = document.getElementById('location-text');
      if (locationText) {
        locationText.innerHTML = `
          <span class="loading-dots">Getting location name</span>
          <br>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}
        `;
      }

      // Get location name via reverse geocoding if available
      this._reverseGeocode(lat, lng);
    }
  }

  _reverseGeocode(lat, lng) {
    // First check if Leaflet's built-in geocoder is available
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

    // Fallback to direct Nominatim API if Leaflet geocoder is not available
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
          console.warn('Nominatim reverse geocoding failed:', error);
          // Use coordinates as fallback
          const locationText = document.getElementById('location-text');
          if (locationText) {
            locationText.textContent = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          }
        });
    } catch (error) {
      console.warn('External reverse geocoding failed:', error);
    }
  }

  _addToRecents(description) {
    try {
      // Get existing recents
      const recentsJson = localStorage.getItem('recentDrafts');
      let recents = recentsJson ? JSON.parse(recentsJson) : [];

      // Add new draft at the beginning (limited preview)
      const preview =
        description.substring(0, 50) + (description.length > 50 ? '...' : '');
      recents.unshift({
        description: preview,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      });

      // Limit to 5 recent drafts
      recents = recents.slice(0, 5);

      // Save back to localStorage
      localStorage.setItem('recentDrafts', JSON.stringify(recents));
    } catch (error) {
      console.error('Error saving to recents:', error);
    }
  }
}

export default AddStoryPresenter;
