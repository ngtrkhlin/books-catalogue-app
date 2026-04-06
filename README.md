# Book Catalogue

## Task
[Assignment PDF](https://drive.google.com/file/d/1swszcMU9rF_-zRJaA2VchPuU_d7yrAbs/view)

## Live Demo
[books-catalogue-app.vercel.app](https://books-catalogue-app.vercel.app)

---

## Description
A simple web application built with **HTML, CSS, and Vanilla JavaScript** that allows users to search for books using the Open Library API and save their favorite books using localStorage.

---

## Features
- Search books by title, author, or keyword
- Display results as cards (cover, title, author, year)
- Handle loading, empty input, and error states
- Add and remove books from favorites
- Favorites persist using localStorage
- Filter results by author
- Responsive layout for desktop and mobile

---

## How to run

```bash
npm install
npm run dev
npm run build
npm run preview

## Folder stucture
src/
 ├── api/        # Open Library fetch logic
 ├── utils/      # localStorage helper
 ├── styles/     # CSS layout and responsiveness
 ├── assets/     # SVG icons
 └── main.js     # Main app logic

index.html       # Main HTML file
vite.config.js   # Vite configuration
