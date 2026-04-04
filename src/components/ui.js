import { isFavorite } from '../utils/storage.js';

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function bookPayload(book) {
    const bookId = book.key || book.id;
    const author = book.author_name
        ? Array.isArray(book.author_name)
            ? book.author_name.join(', ')
            : book.author_name
        : book.author || 'Unknown Author';
    const year = book.first_publish_year ? book.first_publish_year : book.year || 'Unknown Year';
    return {
        id: bookId,
        title: book.title,
        author,
        year,
        cover_i: book.cover_i,
    };
}

function safeDataAttr(bookData) {
    return JSON.stringify(bookData).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

export function renderBooks(books, container) {
    container.innerHTML = books
        .map((book) => {
            const bookData = bookPayload(book);
            const bookId = bookData.id;
            const favorited = isFavorite(bookId);
            const safeBookData = safeDataAttr(bookData);

            const coverHtml = bookData.cover_i
                ? `<img src="https://covers.openlibrary.org/b/id/${bookData.cover_i}.jpg" alt="${escapeHtml(book.title)} cover" class="book-cover" />`
                : `<div class="no-cover">No cover</div>`;

            const heartLabel = favorited ? 'Remove from favorites' : 'Add to favorites';
            const heartClass = favorited ? 'favorite-heart is-favorited' : 'favorite-heart';
            const heartIcon = favorited ? '❤️' : '🤍';

            return `
            <article class="book-card">
                <div class="book-cover-wrap">
                    ${coverHtml}
                    <button type="button" class="${heartClass}" data-book="${safeBookData}" aria-pressed="${favorited}" aria-label="${heartLabel}">
                        <span class="favorite-heart__icon" aria-hidden="true">${heartIcon}</span>
                    </button>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${escapeHtml(book.title)}</h3>
                    <p class="book-author">${escapeHtml(bookData.author)}</p>
                    <p class="book-year">${escapeHtml(String(bookData.year))}</p>
                </div>
            </article>
        `;
        })
        .join('');
}

export function renderFavoriteRows(favorites, container) {
    if (favorites.length === 0) {
        container.innerHTML =
            '<p class="empty-favorites">No favorites yet. Search and tap the heart on a book to save it.</p>';
        return;
    }

    container.innerHTML = favorites
        .map((bookData) => {
            const safeBookData = safeDataAttr(bookData);
            const thumb = bookData.cover_i
                ? `<img class="favorite-row__thumb" src="https://covers.openlibrary.org/b/id/${bookData.cover_i}.jpg" alt="" />`
                : `<div class="favorite-row__thumb favorite-row__thumb--placeholder" aria-hidden="true">—</div>`;

            return `
            <button type="button" class="favorite-row" data-book="${safeBookData}" aria-label="Remove ${escapeHtml(bookData.title)} from favorites">
                ${thumb}
                <div class="favorite-row__meta">
                    <span class="favorite-row__title">${escapeHtml(bookData.title)}</span>
                    <span class="favorite-row__sub">${escapeHtml(bookData.author)} · ${escapeHtml(String(bookData.year))}</span>
                </div>
                <span class="favorite-row__heart" aria-hidden="true">❤️</span>
            </button>
        `;
        })
        .join('');
}
