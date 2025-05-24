import DicodingStoryApi from '../data/api';
import { saveStories, getAllStories } from '../idb';

class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._page = 1;
    this._hasMoreData = true;
    this._isLoading = false;
    this._includeLocation = false;
  }

  async init() {
    try {
      this._view.renderPage();
      this._setupEventListeners();
      await this._loadInitialStories();
    } catch (error) {
      console.error('Error in HomePresenter.init:', error);
      this._view.showError('Error initializing page. Please try refreshing.');
    }
  }

  _setupEventListeners() {
    try {
      this._view.setLoadMoreCallback(async () => {
        await this._loadMoreStories();
      });

      this._view.setLocationFilterCallback((isChecked) => {
        this._includeLocation = isChecked;
        this._page = 1;
        this._hasMoreData = true;
        this._loadInitialStories();
      });
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  async _loadInitialStories() {
    if (this._isLoading) return;

    this._isLoading = true;
    this._page = 1;

    try {
      this._view.clearStories();
      this._view.showLoading();

      const token = localStorage.getItem('token');
      if (!token) {
        this._view.showLoginRequired();
        return;
      }

      console.log(
        'Fetching initial stories, page:',
        this._page,
        'location:',
        this._includeLocation ? 1 : 0
      );
      const response = await DicodingStoryApi.getAllStories({
        token,
        page: this._page,
        location: this._includeLocation ? 1 : 0,
      });

      if (response.error) {
        this._view.showError(response.message || 'Gagal memuat cerita');
        return;
      }

      // Validate response structure
      if (!response || typeof response !== 'object') {
        console.error('Invalid response format:', response);
        this._view.showError('Format respons server tidak valid');
        return;
      }

      const stories = response.listStory || [];
      const size = response.size || 10;

      console.log('Received stories:', stories.length);

      // Ensure stories is an array
      if (!Array.isArray(stories)) {
        console.error('Stories is not an array:', stories);
        this._view.showError('Format data cerita tidak valid');
        return;
      }

      if (stories.length === 0) {
        this._view.showEmptyState();
        this._hasMoreData = false;
      } else {
        // Persist stories to IndexedDB for offline use
        await saveStories(stories);
        this._view.renderStories(stories);
        this._hasMoreData = stories.length === size;
        this._view.updateLoadMoreButton(this._hasMoreData);
      }
    } catch (error) {
      console.error('Error loading initial stories:', error);
      // Try to load from cache if online fetch fails
      const cachedStories = await getAllStories();
      if (cachedStories && cachedStories.length > 0) {
        this._view.renderStories(cachedStories);
        this._view.showOfflineMessage();
      } else {
        this._view.showError(error.message || 'Gagal memuat cerita');
      }
    } finally {
      this._isLoading = false;
      this._view.hideLoading();
    }
  }

  async _loadMoreStories() {
    if (this._isLoading || !this._hasMoreData) return;

    this._isLoading = true;
    this._page += 1;

    try {
      this._view.showLoadingMore();

      const token = localStorage.getItem('token');
      if (!token) {
        this._view.showLoginRequired();
        return;
      }

      console.log(
        'Fetching more stories, page:',
        this._page,
        'location:',
        this._includeLocation ? 1 : 0
      );
      const response = await DicodingStoryApi.getAllStories({
        token,
        page: this._page,
        location: this._includeLocation ? 1 : 0,
      });

      if (response.error) {
        this._view.showError(
          response.message || 'Gagal memuat cerita tambahan'
        );
        return;
      }

      // Validate response structure
      if (!response || typeof response !== 'object') {
        console.error('Invalid response format:', response);
        this._view.showError('Format respons server tidak valid');
        return;
      }

      const stories = response.listStory || [];
      const size = response.size || 10;

      console.log('Received more stories:', stories.length);

      // Ensure stories is an array
      if (!Array.isArray(stories)) {
        console.error('Stories is not an array:', stories);
        this._view.showError('Format data cerita tidak valid');
        return;
      }

      if (stories.length > 0) {
        // Persist stories to IndexedDB
        await saveStories(stories);
        this._view.appendStories(stories);
        this._hasMoreData = stories.length === size;
      } else {
        this._hasMoreData = false;
      }

      this._view.updateLoadMoreButton(this._hasMoreData);
    } catch (error) {
      console.error('Error loading more stories:', error);
      this._view.showError(error.message || 'Gagal memuat cerita tambahan');
    } finally {
      this._isLoading = false;
      this._view.hideLoadingMore();
    }
  }
}

export default HomePresenter;
