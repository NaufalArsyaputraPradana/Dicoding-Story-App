import '../components/sidebar';
import '../components/header';
import '../components/footer';
import { getAllStories, deleteStory } from '../idb';

export default class SavedStoriesPage {
  async render() {
    return `
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main id="main-content" class="main-content" tabindex="-1">
        <section class="container saved-stories">
          <h1 class="page-title">
            <i class="fas fa-database" aria-hidden="true"></i>
            Saved Stories
          </h1>
          <div id="saved-stories-list" class="stories-list"></div>
        </section>
      </main>
      <app-footer></app-footer>
    `;
  }

  async afterRender() {
    const listContainer = document.getElementById('saved-stories-list');
    const stories = await getAllStories();
    if (!stories || stories.length === 0) {
      listContainer.innerHTML = `<p>No saved stories available.</p>`;
      return;
    }
    stories.forEach((story) => {
      const card = document.createElement('app-card');
      card.story = story;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-story-button';
      deleteBtn.addEventListener('click', async () => {
        await deleteStory(story.id);
        card.remove();
        window.showToast('Story deleted from cache', 'success');
      });

      card.appendChild(deleteBtn);
      listContainer.appendChild(card);
    });
  }
}
