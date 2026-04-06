# Book Catalogue

## Task
[Assignment PDF](https://drive.google.com/file/d/1swszcMU9rF_-zRJaA2VchPuU_d7yrAbs/view)

## Live Demo
[books-catalogue-app.vercel.app](https://books-catalogue-app.vercel.app)

---

## Description
A simple web application built with **HTML, CSS, and Vanilla JavaScript** that allows users to search for books using the Open Library API, filter results by author, toggle between light and dark themes, and save favorite books using localStorage.

---

## Features
- Search books by title, author, or keyword
- On-the-fly search with debounce (600 ms delay)
- Display results as cards (cover, title, author, year)
- Handle loading, empty input, and error states
- Filter results by author
- Add and remove books from favorites
- Favorites persist using localStorage
- Light / dark theme toggle — preference saved across reloads
- Responsive layout for desktop and mobile

---

## How to run

```bash
npm install       # install dependencies
npm run dev       # start development server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm test          # run unit tests
```

---

## Testing

Unit tests are written with [Vitest](https://vitest.dev/) and run in a simulated browser environment (`jsdom`).

```bash
npm test
```

| File | What is tested |
|------|---------------|
| `src/api/api.test.js` | fetchBooks returns results, handles empty response, throws on network error |
| `src/utils/storage.test.js` | getFavorites defaults, save/load round-trip, corrupt JSON safety, theme persistence |

---

## Folder structure

```
src/
 ├── api/
 │    ├── api.js          # Open Library fetch logic
 │    └── api.test.js     # Unit tests for the API helper
 ├── utils/
 │    ├── storage.js      # localStorage helpers (favorites + theme)
 │    └── storage.test.js # Unit tests for storage helpers
 ├── styles/
 │    └── base.css        # Layout, theme, and responsive CSS
 ├── assets/
 │    ├── book.svg        # Logo and missing-cover placeholder
 │    ├── heart.svg       # Favorites button icon
 │    └── search.svg      # Search input icon
 └── main.js              # Main app logic (search, render, favorites, theme)

index.html                # App shell
vite.config.js            # Vite + Vitest configuration
```
