/* js/storage.js */

const STORAGE_KEY = "hankkitv";

function getStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveStorage(storage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

function getFavorites() {
  const storage = getStorage();

  return storage.favorites || [];
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const storage = getStorage();

  storage.favorites = storage.favorites || [];

  const index = storage.favorites.indexOf(id);

  if (index >= 0) {
    storage.favorites.splice(index, 1);
  } else {
    storage.favorites.push(id);
  }

  saveStorage(storage);

  return storage.favorites;
}
