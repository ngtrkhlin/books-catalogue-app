import { isFavorite } from '../utils/storage.js';

export function renderBooks(books, container) {
    container.innerHTML = books.map(book => {
        const bookId = book.key || book.id; 
        
        const author = book.author_name ? (Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name) : book.author || 'Unknown Author';
        const year = book.first_publish_year ? book.first_publish_year : book.year || 'Unknown Year';
        
        const coverHtml = book.cover_i 
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}.jpg" alt="${book.title} cover" class="book-cover" />`
            : `<div class="no-cover">No cover</div>`;

        const bookData = {
            id: bookId,
            title: book.title,
            author: author,
            year: year,
            cover_i: book.cover_i
        };
        
        const safeBookData = JSON.stringify(bookData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        
        const favorited = isFavorite(bookId);
        const btnText = favorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
        const btnClass = favorited ? 'favorite-btn active' : 'favorite-btn';

        return `
            <div class="book-card">
                ${coverHtml}
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${author}</p>
                    <p class="book-year">${year}</p>
                    <button class="${btnClass}" data-book="${safeBookData}">${btnText}</button>
                </div>
            </div>
        `;
    }).join('');
}