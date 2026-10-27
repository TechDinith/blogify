# Blogify — Modern TypeScript Blog

A full-featured blogging platform built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **json-server**.

## Features

- 📝 Create, edit, delete posts with Markdown editor + live preview
- 🔍 Search, filter by author/tag, sort, and paginate
- 💬 Comments and ❤️ likes
- 🌙 Dark / light theme with persisted preference
- 🔐 Mock authentication (login / register)
- 👤 Profile with your posts and stats
- 📱 Responsive UI with skeletons and toasts

## Getting started

Install dependencies:

```bash
npm install
```

Start the mock API and dev server together:

```bash
npm start
```

Or run them separately:

```bash
npm run server   # json-server on http://localhost:8000
npm run dev      # Vite on http://localhost:3000
```

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview production build
- `npm run server` — start json-server
- `npm run lint` — run ESLint

## Demo accounts

- mario@example.com / password
- yoshi@example.com / password

## Project structure

```
src/
  components/   # Reusable UI components
  pages/        # Route pages
  context/      # Theme + Auth providers
  hooks/        # Custom hooks (useFetch)
  lib/          # API client + utilities
  types/        # TypeScript types
```
