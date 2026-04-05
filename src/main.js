import { fetchBooks } from './api/api.js';
import { debounce } from './utils/debounce.js';
import { getFavorites, saveFavorites } from './utils/storage.js';
import './styles/base.css';

const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const resultsEl = document.querySelector('#results');
const favoritesListEl = document.querySelector('#favoritesList');

let favorites = getFavorites();

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderBooks(books) {
  if (!resultsEl) return;

  resultsEl.innerHTML = books
    .map(book => {
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/200x300?text=No+Cover';
      const inFavorites = favorites.some(f => f.key === book.key);
      const btnLabel = inFavorites ? 'Saved' : '❤️ Add to Favorites';

      return `
      <article class="book-card">
        <img src="${coverUrl}" alt="${escapeHtml(book.title)}" loading="lazy" />
        <h3>${escapeHtml(book.title)}</h3>
        <p>${escapeHtml(book.author_name ? book.author_name.join(', ') : 'Unknown Author')}</p>
        <p>${escapeHtml(String(book.first_publish_year || 'N/A'))}</p>
        <button type="button" class="fav-btn" data-key="${escapeHtml(book.key)}" ${inFavorites ? 'disabled' : ''}>${btnLabel}</button>
      </article>
    `;
    })
    .join('');

  resultsEl.querySelectorAll('.fav-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const book = books.find(b => b.key === key);
      addFavorite(book);
    });
  });
}

function renderFavorites() {
  if (!favoritesListEl) return;

  if (favorites.length === 0) {
    favoritesListEl.innerHTML = '<p class="favorite-empty">No saved books yet.</p>';
    return;
  }

  favoritesListEl.innerHTML = favorites
    .map(
      book => `
    <div class="favorite-item">
      <span>${escapeHtml(book.title)}${book.author_name?.[0] ? ` (${escapeHtml(book.author_name[0])})` : ''}</span>
      <button type="button" class="remove-fav" data-key="${escapeHtml(book.key)}" aria-label="Remove">✕</button>
    </div>
  `
    )
    .join('');

  favoritesListEl.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(btn.getAttribute('data-key'));
    });
  });
}

function addFavorite(book) {
  if (!book || favorites.some(f => f.key === book.key)) return;
  favorites.push(book);
  saveFavorites(favorites);
  renderFavorites();
  const btn = [...(resultsEl?.querySelectorAll('.fav-btn') ?? [])].find(b => b.dataset.key === book.key);
  if (btn) {
    btn.textContent = 'Saved';
    btn.disabled = true;
  }
}

function removeFavorite(key) {
  if (key == null) return;
  favorites = favorites.filter(f => f.key !== key);
  saveFavorites(favorites);
  renderFavorites();
  const btn = [...(resultsEl?.querySelectorAll('.fav-btn') ?? [])].find(b => b.dataset.key === key);
  if (btn) {
    btn.textContent = '❤️ Add to Favorites';
    btn.disabled = false;
  }
}

async function handleSearch() {
  if (!resultsEl || !searchInput) return;

  const q = searchInput.value.trim();
  if (!q) {
    resultsEl.innerHTML = '<p>Enter a title or author to search.</p>';
    return;
  }

  resultsEl.innerHTML = '<p>Loading…</p>';

  try {
    const books = await fetchBooks(q);

    if (!books || books.length === 0) {
      resultsEl.innerHTML = '<p>No results found for that search.</p>';
      return;
    }

    renderBooks(books.slice(0, 20));
  } catch {
    resultsEl.innerHTML = '<p>Search failed. Check your connection.</p>';
  }
}

searchBtn?.addEventListener('click', handleSearch);
searchInput?.addEventListener('input', debounce(handleSearch, 600));

renderFavorites();
