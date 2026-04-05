const KEY = 'favorites';

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
