export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) ||[];
}

export function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(book => book.id === id);
}

export function toggleFavorite(book) {
    let favorites = getFavorites();
    
    if (isFavorite(book.id)) {
        favorites = favorites.filter(b => b.id !== book.id);
    } else {
        favorites.push(book);
    }
    
    // Save the updated array back to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}