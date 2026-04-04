export async function searchBooks(query) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        return data.docs;
    } catch (error) {
        console.error("API Error:", error);
        return null; 
    }
}