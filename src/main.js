import { searchBooks } from './api/api.js';
import { debounce } from './utils/utils.js';
import { renderBooks, renderFavorites } from './components/ui.js';
import {
    addFavorite,
    removeFavorite,
    getFavoriteIdsSet,
} from './utils/storage.js';

const searchInput = document.getElementById('searchInput');
const loadingText = document.getElementById('loadingText');
const resultsGrid = document.getElementById('resultsGrid');
const favoritesGrid = document.getElementById('favoritesGrid');

let lastSearchResults = [];

function parseBookFromButton(btn) {
    const raw = btn.getAttribute('data-book');
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw));
}

function refreshFavoritesSection() {
    renderFavorites(favoritesGrid);
}

function refreshSearchResultsButtons() {
    if (lastSearchResults.length === 0) return;
    renderBooks(lastSearchResults, resultsGrid, getFavoriteIdsSet());
}

async function handleSearch(event) {
    const query = event.target.value.trim();

    if (!query) {
        lastSearchResults = [];
        resultsGrid.innerHTML = '<p>Please enter a book title, author, or keyword.</p>';
        return;
    }

    loadingText.classList.remove('hidden');
    resultsGrid.innerHTML = '';

    const results = await searchBooks(query);

    loadingText.classList.add('hidden');

    if (!results) {
        lastSearchResults = [];
        resultsGrid.innerHTML = '<p style="color:red;">Network error. Please try again.</p>';
        return;
    }

    if (results.length === 0) {
        lastSearchResults = [];
        resultsGrid.innerHTML = '<p>Nothing found for this query.</p>';
        return;
    }

    lastSearchResults = results;
    renderBooks(results, resultsGrid, getFavoriteIdsSet());
}

searchInput.addEventListener('input', debounce(handleSearch));

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.favorite-btn');
    if (!btn) return;

    const book = parseBookFromButton(btn);
    if (!book) return;

    if (btn.classList.contains('is-favorited')) {
        removeFavorite(book);
    } else {
        addFavorite(book);
    }

    refreshFavoritesSection();
    refreshSearchResultsButtons();
});

refreshFavoritesSection();
