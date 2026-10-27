# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Exclude your own visits from analytics

After deployment, open https://rushjsdev.com/?analytics=off directly in your browser's address bar. This saves an opt-out in that browser's local storage before the Cloudflare tracker loads, including on that first visit. Subsequent visits and page reloads remain excluded.

To resume tracking, open https://rushjsdev.com/?analytics=on directly in the address bar.

Repeat the opt-out in each browser, profile, or device you use. Clearing site data removes the preference; private browsing has separate storage. If browser storage is unavailable, the tracker stays disabled for that page load, but the preference cannot be saved. This does not remove visits already recorded.

Analytics otherwise runs only in production builds on `rushjsdev.com`, excluding local development and preview domains.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
