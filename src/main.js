import { searchBooks } from './api/api.js';
import { debounce } from './utils/utils.js';
import { renderBooks, renderFavoriteRows } from './components/ui.js';
import { getFavorites, toggleFavorite } from './utils/storage.js';

import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadingText = document.getElementById('loadingText');
const resultsGrid = document.getElementById('resultsGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const favoritesCount = document.getElementById('favoritesCount');

let currentSearchResults = [];

function renderFavoritesSection() {
    const favorites = getFavorites();
    const n = favorites.length;
    if (favoritesCount) {
        favoritesCount.textContent = `${n} book${n === 1 ? '' : 's'} saved`;
    }
    renderFavoriteRows(favorites, favoritesGrid);
}

renderFavoritesSection();

document.addEventListener('click', (event) => {
    const btn = event.target.closest('.favorite-heart, .favorite-row');
    if (!btn || !btn.hasAttribute('data-book')) return;

    const raw = btn.getAttribute('data-book');
    let bookData;
    try {
        bookData = JSON.parse(raw);
    } catch {
        return;
    }

    toggleFavorite(bookData);

    renderFavoritesSection();
    if (currentSearchResults.length > 0) {
        renderBooks(currentSearchResults, resultsGrid);
    }
});

async function handleSearch(event) {
    const query = (event.target?.value ?? searchInput.value).trim();

    if (!query) {
        resultsGrid.innerHTML =
            '<p class="placeholder-msg">Please enter a book title, author, or keyword.</p>';
        currentSearchResults = [];
        return;
    }

    loadingText.classList.remove('hidden');
    resultsGrid.innerHTML = '';

    const results = await searchBooks(query);

    loadingText.classList.add('hidden');

    if (!results) {
        resultsGrid.innerHTML =
            '<p class="error-msg">Network error. Please try again.</p>';
        currentSearchResults = [];
        return;
    }

    if (results.length === 0) {
        resultsGrid.innerHTML = '<p class="placeholder-msg">Nothing found for this query.</p>';
        currentSearchResults = [];
        return;
    }

    currentSearchResults = results;
    renderBooks(currentSearchResults, resultsGrid);
}

searchInput.addEventListener('input', debounce(handleSearch));
searchBtn?.addEventListener('click', () => handleSearch({ target: searchInput }));

const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});
