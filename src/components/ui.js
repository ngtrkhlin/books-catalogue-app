export function renderBooks(books, container) {
    container.innerHTML = books.map(book => {
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const year = book.first_publish_year ? book.first_publish_year : 'Unknown Year';
        
        const coverHtml = book.cover_i 
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}.jpg" alt="${book.title} cover" class="book-cover" />`
            : `<div class="no-cover">No cover</div>`;

        const bookData = {
            id: book.key, 
            title: book.title,
            author: author,
            year: year,
            cover_i: book.cover_i
        };
        
        const safeBookData = JSON.stringify(bookData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

        return `
            <div class="book-card">
                ${coverHtml}
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${author}</p>
                    <p class="book-year">${year}</p>
                    <button class="favorite-btn" data-book="${safeBookData}">🤍 Add to Favorites</button>
                </div>
            </div>
        `;
    }).join('');
}