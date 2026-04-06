import { describe, test, expect, vi } from 'vitest';
import { fetchBooks } from './api.js';

// vi.stubGlobal replaces the real fetch with a fake one so tests never hit the network
describe('fetchBooks', () => {
  test('returns the docs array from the API response', async () => {
    const fakeBooks = [{ title: 'Harry Potter', key: '/works/1' }];

    vi.stubGlobal('fetch', async () => ({
      ok: true,
      json: async () => ({ docs: fakeBooks }),
    }));

    const result = await fetchBooks('harry potter');
    expect(result).toEqual(fakeBooks);
  });

  test('returns an empty array when the API returns no docs', async () => {
    vi.stubGlobal('fetch', async () => ({
      ok: true,
      json: async () => ({ docs: [] }),
    }));

    const result = await fetchBooks('xyznotabook');
    expect(result).toEqual([]);
  });

  test('throws an error when the API response is not ok', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: false }));

    await expect(fetchBooks('anything')).rejects.toThrow('Network error');
  });
});
