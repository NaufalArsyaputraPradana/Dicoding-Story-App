import { showFormattedDate } from '../utils/index';
import CONFIG from '../config';

class AppCard extends HTMLElement {
  set story(data) {
    this._story = data;
    this.render();
  }

  render() {
    if (!this._story) return;

    try {
      // Ensure required properties exist
      const story = {
        id: this._story.id || `unknown-${Date.now()}`,
        name: this._story.name || 'Unknown User',
        description: this._story.description || 'No description provided',
        photoUrl: this._story.photoUrl || './images/placeholder.jpg',
        createdAt: this._story.createdAt || new Date().toISOString(),
        lat: this._story.lat,
        lon: this._story.lon,
      };

      const formattedDate = showFormattedDate(story.createdAt, 'id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Generate unique IDs for accessibility
      const titleId = `story-title-${story.id}`;
      const descId = `story-desc-${story.id}`;

      // Create a color for this card based on the user's name (consistent for same user)
      const userColor = getUserColor(story.name);

      this.innerHTML = `
        <article class="story-item" aria-labelledby="${titleId}" aria-describedby="${descId}">
          <div class="story-image-container">
            <div class="story-badge" style="background-color: ${userColor}">
              <i class="fas fa-camera" aria-hidden="true"></i>
            </div>
            <img 
              class="story-image" 
              src="${story.photoUrl}" 
              alt="Photo shared by ${story.name}" 
              loading="lazy"
              onerror="this.src='./images/placeholder.jpg'"
            >
          </div>
          
          <div class="story-content">
            <div class="story-header">
              <div class="story-user">
                <div class="user-avatar" aria-hidden="true" style="background-color: ${userColor}">
                  ${getInitials(story.name)}
                </div>
                <div>
                  <h3 class="story-name" id="${titleId}">${story.name}</h3>
                  <time class="story-date" datetime="${story.createdAt}">
                    <i class="far fa-calendar-alt" aria-hidden="true"></i> ${formattedDate}
                  </time>
                </div>
              </div>
              ${
                story.lat && story.lon
                  ? `<div class="story-location-badge" title="Has location data">
                      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    </div>`
                  : ''
              }
            </div>
            
            <p class="story-description" id="${descId}">${truncateText(story.description, 120)}</p>
            
            ${
              story.lat && story.lon
                ? `<div class="story-map" id="map-${story.id}" 
                        aria-label="Location of story by ${story.name}" 
                        tabindex="0"></div>`
                : ''
            }
            
            <div class="story-actions">
              <a href="#/stories/${story.id}" class="story-link" 
                 aria-label="Read full story by ${story.name}">
                <i class="fas fa-book-reader" aria-hidden="true"></i>
                Read Full Story
              </a>
            </div>
          </div>
        </article>
      `;

      if (story.lat && story.lon) {
        // Use requestAnimationFrame to ensure the map container is ready
        requestAnimationFrame(() => this.renderMap());
      }
    } catch (error) {
      console.error('Error rendering card:', error, { story: this._story });

      // Render a fallback card
      this.innerHTML = `
        <article class="story-item">
          <div class="story-content">
            <div class="story-header">
              <div class="story-user">
                <div class="user-avatar" style="background-color: #4361ee">U</div>
                <div>
                  <h3 class="story-name">Story data error</h3>
                  <time class="story-date">Unknown date</time>
                </div>
              </div>
            </div>
            <p class="story-description">There was an error rendering this story. Please try refreshing the page.</p>
            <div class="story-actions">
              <a href="#/" class="story-link">
                <i class="fas fa-home" aria-hidden="true"></i>
                Back to Home
              </a>
            </div>
          </div>
        </article>
      `;
    }
  }

  renderMap() {
    try {
      if (!this._story) {
        console.error('Cannot render map: story data is missing');
        return;
      }

      // Check if we have valid coordinates
      const lat = parseFloat(this._story.lat);
      const lon = parseFloat(this._story.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.error('Cannot render map: invalid coordinates', {
          lat: this._story.lat,
          lon: this._story.lon,
        });
        return;
      }

      // Ensure required story properties
      const storyId = this._story.id || `unknown-${Date.now()}`;
      const storyName = this._story.name || 'Unknown User';
      const storyDescription = this._story.description || '';

      const mapElement = this.querySelector(`#map-${storyId}`);
      if (!mapElement || !window.L) {
        console.error(
          'Cannot render map: DOM element or Leaflet not available'
        );
        return;
      }

      const map = L.map(mapElement, {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      }).setView([lat, lon], 13);

      // Add base layer
      L.tileLayer(CONFIG.MAP_TILE_LAYERS.osm.url, {
        maxZoom: 19,
      }).addTo(map);

      // Add marker with custom icon based on user color
      const userColor = getUserColor(storyName);
      const customIcon = L.divIcon({
        html: `<div style="background-color: ${userColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-map-marker-alt"></i>
              </div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div class="map-popup">
            <b>${storyName}</b>
            <p>${truncateText(storyDescription, 50)}...</p>
            <a href="#/stories/${storyId}" class="popup-link">View Details</a>
          </div>`,
          {
            className: 'custom-popup',
            closeButton: false,
          }
        )
        .openPopup();

      // Add map click handler that navigates to detail page
      map.on('click', () => {
        window.location.hash = `#/stories/${storyId}`;
      });

      // Add keyboard handler for accessibility
      mapElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          window.location.hash = `#/stories/${storyId}`;
        }
      });
    } catch (error) {
      console.error('Error rendering map:', error, { story: this._story });
    }
  }

  connectedCallback() {
    // Add intersection observer to animate cards when they enter viewport
    try {
      if (
        'IntersectionObserver' in window &&
        window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      ) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.classList.add('visible');
                observer.unobserve(this);
              }
            });
          },
          { threshold: 0.2 }
        );

        observer.observe(this);
      } else {
        // Add visible class immediately if IntersectionObserver not supported
        this.classList.add('visible');
      }
    } catch (error) {
      console.error('Error in connectedCallback:', error);
      // Ensure the card is visible even if observer fails
      this.classList.add('visible');
    }
  }
}

customElements.define('app-card', AppCard);

// Helper functions
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';

  try {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters
  } catch (error) {
    console.error('Error getting initials:', error, { name });
    return 'U';
  }
}

function getUserColor(name) {
  // Generate consistent color based on user name
  const colors = [
    '#4361ee', // primary
    '#3f37c9', // secondary
    '#4895ef', // accent
    '#4cc9f0', // success
    '#f72585', // danger
    '#7209b7', // purple
    '#3a0ca3', // indigo
    '#4cc9f0', // blue
    '#f72585', // pink
    '#f8961e', // orange
  ];

  // Safety check - if name is undefined or null, return default color
  if (!name || typeof name !== 'string') {
    return colors[0]; // Return primary color as default
  }

  // Simple hash function to get consistent color for same name
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}

function truncateText(text, maxLength = 100) {
  if (!text || typeof text !== 'string') return '';

  try {
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
  } catch (error) {
    console.error('Error truncating text:', error, { text });
    return '';
  }
}
