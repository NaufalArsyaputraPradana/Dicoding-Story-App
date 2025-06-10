import DicodingStoryApi from '../../data/api';
import { saveStories, getAllStories } from '../../idb';

export default class HomePresenter {
  #view;
  #page = 1;
  #hasMoreData = true;
  #isLoading = false;
  #includeLocation = false;

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    try {
      this.#view.renderPage();
      this.#setupEventListeners();
      await this.#loadInitialStories();
    } catch (error) {
      console.error('Error in HomePresenter.init:', error);
      this.#view.showError('Error initializing page. Please try refreshing.');
    }
  }

  #setupEventListeners() {
    this.#view.setLoadMoreCallback(() => this.#loadMoreStories());
    this.#view.setLocationFilterCallback((isChecked) => {
      this.#includeLocation = isChecked;
      this.#page = 1;
      this.#hasMoreData = true;
      this.#loadInitialStories();
    });
  }

  async #loadInitialStories() {
    if (this.#isLoading) return;
    this.#isLoading = true;
    this.#page = 1;

    try {
      this.#view.clearStories();
      this.#view.showLoading();

      const token = localStorage.getItem('accessToken');
      if (!token) {
        this.#view.showLoginRequired();
        return;
      }

      const response = await DicodingStoryApi.getAllStories({
        token,
        page: this.#page,
        location: this.#includeLocation ? 1 : 0,
      });

      if (response.error) {
        this.#view.showError(response.message || 'Gagal memuat cerita');
        return;
      }

      if (!response || typeof response !== 'object') {
        this.#view.showError('Format respons server tidak valid');
        return;
      }

      const stories = response.listStory || [];
      const size = response.size || 10;

      if (!Array.isArray(stories)) {
        this.#view.showError('Format data cerita tidak valid');
        return;
      }

      if (stories.length === 0) {
        this.#view.showEmptyState();
        this.#hasMoreData = false;
      } else {
        await saveStories(stories);
        this.#view.renderStories(stories);
        this.#hasMoreData = stories.length === size;
        this.#view.updateLoadMoreButton(this.#hasMoreData);
      }
    } catch (error) {
      // Fallback: load from cache if fetch fails
      const cachedStories = await getAllStories();
      if (cachedStories && cachedStories.length > 0) {
        this.#view.renderStories(cachedStories);
        this.#view.showOfflineMessage();
      } else {
        this.#view.showError(error.message || 'Gagal memuat cerita');
      }
    } finally {
      this.#isLoading = false;
      this.#view.hideLoading();
    }
  }

  async #loadMoreStories() {
    if (this.#isLoading || !this.#hasMoreData) return;
    this.#isLoading = true;
    this.#page += 1;

    try {
      this.#view.showLoadingMore();

      const token = localStorage.getItem('accessToken');
      if (!token) {
        this.#view.showLoginRequired();
        return;
      }

      const response = await DicodingStoryApi.getAllStories({
        token,
        page: this.#page,
        location: this.#includeLocation ? 1 : 0,
      });

      if (response.error) {
        this.#view.showError(
          response.message || 'Gagal memuat cerita tambahan'
        );
        return;
      }

      if (!response || typeof response !== 'object') {
        this.#view.showError('Format respons server tidak valid');
        return;
      }

      const stories = response.listStory || [];
      const size = response.size || 10;

      if (!Array.isArray(stories)) {
        this.#view.showError('Format data cerita tidak valid');
        return;
      }

      if (stories.length > 0) {
        await saveStories(stories);
        this.#view.appendStories(stories);
        this.#hasMoreData = stories.length === size;
      } else {
        this.#hasMoreData = false;
      }

      this.#view.updateLoadMoreButton(this.#hasMoreData);
    } catch (error) {
      // Fallback: show offline message, but do not append duplicate stories
      this.#view.showOfflineMessage();
    } finally {
      this.#isLoading = false;
      this.#view.hideLoadingMore();
    }
  }
}
