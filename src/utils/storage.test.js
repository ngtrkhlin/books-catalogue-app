import { describe, test, expect, beforeEach } from 'vitest';
import { getFavorites, saveFavorites, getSavedTheme, saveTheme } from './storage.js';

// Clear localStorage before each test so tests don't affect each other
beforeEach(() => {
  localStorage.clear();
});

describe('getFavorites', () => {
  test('returns an empty array when nothing is saved', () => {
    expect(getFavorites()).toEqual([]);
  });

  test('returns the saved list after saveFavorites is called', () => {
    const books = [{ key: '/works/1', title: 'Dune' }];
    saveFavorites(books);
    expect(getFavorites()).toEqual(books);
  });

  test('returns an empty array if localStorage contains invalid JSON', () => {
    localStorage.setItem('favorites', 'not-valid-json');
    expect(getFavorites()).toEqual([]);
  });
});

describe('getSavedTheme', () => {
  test('returns "light" by default when nothing is saved', () => {
    expect(getSavedTheme()).toBe('light');
  });

  test('returns "dark" after saveTheme("dark") is called', () => {
    saveTheme('dark');
    expect(getSavedTheme()).toBe('dark');
  });

  test('returns "light" after saveTheme("light") is called', () => {
    saveTheme('light');
    expect(getSavedTheme()).toBe('light');
  });
});
