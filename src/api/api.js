// Fetches book search results from the Open Library public API

export async function fetchBooks(query) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('Network error');
  const data = await response.json();
  return data.docs || [];
}
