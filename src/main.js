import { searchBooks } from './api/api.js';
import { debounce } from './utils/utils.js';
import { renderBooks } from './components/ui.js';

const searchInput = document.getElementById('searchInput');
const loadingText = document.getElementById('loadingText');
const resultsGrid = document.getElementById('resultsGrid');

async function handleSearch(event) {
    const query = event.target.value.trim();

    if (!query) {
        resultsGrid.innerHTML = '<p>Please enter a book title, author, or keyword.</p>';
        return;
    }

    loadingText.classList.remove('hidden');
    resultsGrid.innerHTML = '';

    const results = await searchBooks(query);

    loadingText.classList.add('hidden');

    if (!results) {
        resultsGrid.innerHTML = '<p style="color:red;">Network error. Please try again.</p>';
        return;
    }

    if (results.length === 0) {
        resultsGrid.innerHTML = '<p>Nothing found for this query.</p>';
        return;
    }

    renderBooks(results, resultsGrid);
}

searchInput.addEventListener('input', debounce(handleSearch));