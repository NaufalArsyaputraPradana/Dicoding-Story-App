import { openDB } from 'idb';
import CONFIG from './config';

const dbPromise = openDB(CONFIG.DATABASE_NAME, CONFIG.DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(CONFIG.OBJECT_STORE_NAME)) {
      db.createObjectStore(CONFIG.OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveStories(stories) {
  if (!Array.isArray(stories) || stories.length === 0) return;
  const db = await dbPromise;
  const tx = db.transaction(CONFIG.OBJECT_STORE_NAME, 'readwrite');
  for (const story of stories) {
    tx.store.put(story);
  }
  await tx.done;
}

export async function getAllStories() {
  const db = await dbPromise;
  return (await db.getAll(CONFIG.OBJECT_STORE_NAME)) || [];
}

export async function deleteStory(id) {
  const db = await dbPromise;
  const tx = db.transaction(CONFIG.OBJECT_STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}
