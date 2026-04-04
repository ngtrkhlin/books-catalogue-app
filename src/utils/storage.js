export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function addFavorite(book) {
    const favorites = getFavorites();
    favorites.push(book);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function removeFavorite(book) {
    const favorites = getFavorites();
    localStorage.setItem('favorites', JSON.stringify(favorites.filter(b => b.id !== book.id)));
}