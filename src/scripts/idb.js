import { openDB } from 'idb';

const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';
const FAVORITES_STORE = 'favorites';

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
      }
    },
  });
}

// Stories
export async function saveStories(stories) {
  if (!Array.isArray(stories)) return;
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const story of stories) {
    try {
      await tx.store.put(story);
    } catch (e) {
      console.error('Failed to save story:', story, e);
    }
  }
  await tx.done;
}

export async function getAllStories() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function getStoryById(id) {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function deleteStory(id) {
  const db = await getDb();
  return db.delete(STORE_NAME, id);
}

export async function clearStories() {
  const db = await getDb();
  return db.clear(STORE_NAME);
}

// Favorites
export async function addToFavorites(story) {
  if (!story || !story.id) return;
  const db = await getDb();
  await db.put(FAVORITES_STORE, story);
}

export async function removeFromFavorites(id) {
  const db = await getDb();
  await db.delete(FAVORITES_STORE, id);
}

export async function getFavorites() {
  const db = await getDb();
  return db.getAll(FAVORITES_STORE);
}

export async function isFavorite(id) {
  const db = await getDb();
  const fav = await db.get(FAVORITES_STORE, id);
  return !!fav;
}

export async function clearFavorites() {
  const db = await getDb();
  return db.clear(FAVORITES_STORE);
}

// Utility: Sync stories/favorites (for future offline sync)
export async function bulkSaveFavorites(favorites) {
  if (!Array.isArray(favorites)) return;
  const db = await getDb();
  const tx = db.transaction(FAVORITES_STORE, 'readwrite');
  for (const fav of favorites) {
    try {
      await tx.store.put(fav);
    } catch (e) {
      console.error('Failed to save favorite:', fav, e);
    }
  }
  await tx.done;
}

const IdbHelper = {
  saveStories,
  getAllStories,
  getStoryById,
  deleteStory,
  clearStories,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite,
  clearFavorites,
  bulkSaveFavorites,
};

export default IdbHelper;
