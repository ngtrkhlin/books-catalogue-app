// Persists the favorites list and the color theme in localStorage.

const FAVORITES_KEY = 'favorites';
const THEME_KEY = 'theme';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

// Returns the saved theme: 'dark' or 'light' (defaults to 'light')
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

// Saves the chosen theme so it survives a page reload
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
