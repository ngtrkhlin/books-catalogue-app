# Book Catalogue

## Task

[Assignment PDF](https://drive.google.com/file/d/1swszcMU9rF_-zRJaA2VchPuU_d7yrAbs/view)

**Live demo:** [your-app.vercel.app](https://your-app.vercel.app)


## How to run

```bash
npm install
npm run dev
npm run build
npm run preview
```

Production output is written to `dist/` (`index.html`, bundled JS and CSS, and `assets/` including `book.svg`).

## Folder structure

| Path | Contents |
|------|----------|
| `src/api/` | Open Library `fetch` |
| `src/utils/` | `localStorage` favorites helper |
| `src/styles/` | Layout and responsive CSS |
| `src/assets/` | `book.svg` (missing cover placeholder) |
| `src/main.js` | Search, author filter, cards, favorites |
| `index.html` | Page shell |
