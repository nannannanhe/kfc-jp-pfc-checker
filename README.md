# kfc-jp-pfc-checker

A PFC calculator based on the nutrition data published by KFC Japan.

Select menu items to calculate total calories and nutritional values, including:

- Protein
- Fat
- Carbohydrates
- Dietary fiber

This is a small experimental project built with Claude Code.

## Prerequisites

- **Node.js** v24 or higher — https://nodejs.org/
  - Verify: `node -v`
- **npm** (bundled with Node.js)
  - Verify: `npm -v`

For E2E tests, Playwright manages its own browser binaries (installed via `npm run test:e2e` setup step below).

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (only needed for E2E tests)
npx playwright install --with-deps
```

## Development

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check + production build
npm run preview    # Preview production build locally
```

## Testing

```bash
npm run test       # Unit + component tests (Vitest)
npm run test:e2e   # E2E tests (Playwright, requires dev server to be running)
npm run typecheck  # TypeScript type check only
```
