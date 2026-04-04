import { searchBooks } from './api/api.js';
import { debounce } from './utils/utils.js';
import { renderBooks } from './components/ui.js';
import { getFavorites, toggleFavorite } from './utils/storage.js';

const searchInput = document.getElementById('searchInput');
const loadingText = document.getElementById('loadingText');
const resultsGrid = document.getElementById('resultsGrid');
const favoritesGrid = document.getElementById('favoritesGrid');

let currentSearchResults = []; 

renderFavoritesSection();

function renderFavoritesSection() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p>No favorites added yet. Search for a book above!</p>';
    } else {
        renderBooks(favorites, favoritesGrid);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('favorite-btn')) {
        const bookData = JSON.parse(event.target.getAttribute('data-book'));
        
        toggleFavorite(bookData);
        
        renderFavoritesSection();
        if (currentSearchResults.length > 0) {
            renderBooks(currentSearchResults, resultsGrid);
        }
    }
});

async function handleSearch(event) {
    const query = event.target.value.trim();

    if (!query) {
        resultsGrid.innerHTML = '<p>Please enter a book title, author, or keyword.</p>';
        currentSearchResults = [];
        return;
    }

    loadingText.classList.remove('hidden');
    resultsGrid.innerHTML = '';

    const results = await searchBooks(query);

    loadingText.classList.add('hidden');

    if (!results) {
        resultsGrid.innerHTML = '<p style="color:red;">Network error. Please try again.</p>';
        currentSearchResults = [];
        return;
    }

    if (results.length === 0) {
        resultsGrid.innerHTML = '<p>Nothing found for this query.</p>';
        currentSearchResults = [];
        return;
    }

    currentSearchResults = results;
    renderBooks(currentSearchResults, resultsGrid);
}

searchInput.addEventListener('input', debounce(handleSearch));