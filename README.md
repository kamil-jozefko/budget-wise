# Budget-Wise

Budget-Wise is a modern web application for managing personal and household finances. It allows users to track income, expenses, and financial health with a clean, user-friendly interface.

---

## ✨ Overview

Budget-Wise helps you:
- Track income and expenses
- Manage categories for transactions
- View financial statistics and charts
- Filter and search transactions
- Use the app in English or Polish
- Access a responsive and accessible UI

---

## 🛠️ Technologies Used

- **Nuxt 3** (Vue 3 framework)
- **TypeScript**
- **TailwindCSS**
- **Pinia** (state management)
- **Vitest** (unit testing)
- **Vue I18n** (internationalization)
- **Husky** (git hooks)

---

## 🚩 Features

- **Dashboard**: Overview of income, expenses, and balance
- **Recent Transactions**: Quick preview of latest activity
- **Transactions Table**: Transactions activity with pagination
- **Add/Edit/Delete Transactions**: Full CRUD with validation
- **Category Management**: Income and expense categories
- **Date Filtering**: Quick filters and custom date range
- **Charts**: Monthly income vs. expenses, category breakdowns
- **Internationalization**: English and Polish support
- **Accessibility**: Semantic HTML, basic ARIA
- **Responsive Design**: Mobile-first in most areas
- **Testing**: Unit tests for components and logic

---

## Limitations / Areas for Improvement
- Transactions Table is only partially responsive (columns hide on small screens, but not fully mobile-optimized)
- Table is not sortable
- Accessibility is basic (semantic HTML, some aria-labels, not a11y-complete)

---

## 🚀 Setup

Install dependencies:

```sh
yarn install
```

---

## 🛠 Development

Start the development server on `http://localhost:3000`:

```sh
yarn dev
```

---

## 🏗️ Production

Build for production:

```sh
yarn build
```

Preview production build locally:

```sh
yarn preview
```

---

## 🔍 Testing

Run all tests:

```sh
yarn test
```

Run tests in watch mode:

```sh
yarn test:watch
```

---

## 🧹 Linting

Run linting:

```sh
yarn lint
```

---

## 🛡️ Git Hooks

Husky ensures that linting and tests run before every commit.

---

## 📖 Documentation

- [Nuxt Documentation](https://nuxt.com/docs)
- [Vitest Documentation](https://vitest.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)

---

## 📝 License

MIT

