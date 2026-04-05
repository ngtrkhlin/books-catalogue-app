// Search, author filter, book cards, and favorites UI.

import { fetchBooks } from './api/api.js';
import { getFavorites, saveFavorites } from './utils/storage.js';
import bookIcon from './assets/book.svg';
import './styles/base.css';

const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const resultsEl = document.querySelector('#results');
const favoritesListEl = document.querySelector('#favoritesList');
const authorFilter = document.querySelector('#authorFilter');

let favorites = getFavorites();
let lastFetchedBooks = [];

function resetAuthorFilter() {
  if (!authorFilter) return;
  authorFilter.innerHTML = '<option value="all">All authors</option>';
  authorFilter.value = 'all';
  authorFilter.disabled = true;
}

function populateAuthorFilter(books) {
  if (!authorFilter) return;
  const authors = [...new Set(books.flatMap(b => b.author_name || []))].slice(0, 15);
  authorFilter.innerHTML = '<option value="all">All authors</option>';
  authors.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    authorFilter.appendChild(opt);
  });
  authorFilter.value = 'all';
  authorFilter.disabled = authors.length === 0;
}

function getBooksForDisplay() {
  if (lastFetchedBooks.length === 0) return [];
  const selected = authorFilter?.value ?? 'all';
  if (selected === 'all') return lastFetchedBooks;
  return lastFetchedBooks.filter(b => (b.author_name || []).includes(selected));
}

function renderResultsFromState() {
  renderBooks(getBooksForDisplay().slice(0, 20));
}

function applyAuthorFilter() {
  renderResultsFromState();
}

authorFilter?.addEventListener('change', applyAuthorFilter);

function renderBooks(books) {
  if (!resultsEl) return;

  resultsEl.innerHTML = books
    .map(book => {
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`
        : bookIcon;
      const coverClass = book.cover_i ? 'book-card__cover' : 'book-card__cover book-card__cover--placeholder';
      const inFavorites = favorites.some(f => f.key === book.key);

      return `
      <article class="book-card">
        <img class="${coverClass}" src="${coverUrl}" alt="" loading="lazy" />
        <h3>${book.title ?? ''}</h3>
        <p>${book.author_name ? book.author_name.join(', ') : 'Unknown author'}</p>
        <p>${book.first_publish_year ?? 'N/A'}</p>
        <button type="button" class="fav-btn" data-key="${book.key}" ${inFavorites ? 'disabled' : ''}>Add to Favorites</button>
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
    favoritesListEl.innerHTML = '';
    return;
  }

  favoritesListEl.innerHTML = favorites
    .map(
      book => `
    <div class="favorite-item">
      <span>${book.title ?? ''}</span>
      <button type="button" class="remove-fav" data-key="${book.key}">Remove</button>
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
  renderResultsFromState();
}

function removeFavorite(key) {
  if (key == null) return;
  favorites = favorites.filter(f => f.key !== key);
  saveFavorites(favorites);
  renderFavorites();
  renderResultsFromState();
}

async function handleSearch() {
  if (!resultsEl || !searchInput) return;

  const q = searchInput.value.trim();
  if (!q) {
    lastFetchedBooks = [];
    resetAuthorFilter();
    resultsEl.innerHTML = '<p>Enter a query.</p>';
    return;
  }

  resultsEl.innerHTML = '<p>Loading…</p>';

  try {
    const books = await fetchBooks(q);

    if (!books || books.length === 0) {
      lastFetchedBooks = [];
      resetAuthorFilter();
      resultsEl.innerHTML = '<p>Nothing found.</p>';
      return;
    }

    lastFetchedBooks = books;
    populateAuthorFilter(books);
    renderResultsFromState();
  } catch {
    lastFetchedBooks = [];
    resetAuthorFilter();
    resultsEl.innerHTML = '<p>Network error.</p>';
  }
}

searchBtn?.addEventListener('click', handleSearch);

resetAuthorFilter();
renderFavorites();
