# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Nuxt dev server on `http://localhost:3000`
- `npm run build` — production build (SSR output in `.output/`)
- `npm run generate` — static-site generate
- `npm run preview` — preview the production build locally
- `npm install` — installs deps and runs `nuxt prepare` postinstall (regenerates `.nuxt/` types)

There is no lint or test setup in this repo. Formatting is handled by Prettier + `prettier-plugin-tailwindcss` (config: `prettier.config.js`).

## Architecture

Personal portfolio site built with **Nuxt 3** (Vue 3, TypeScript, Tailwind CSS). Uses file-based routing, server API routes, and content collections. Auto-imports are on — components, composables, and `ref`/`useX` helpers generally don't need explicit imports.

### Content-driven projects page
Project entries live as markdown files in `content/projects/*.md` and are served via `@nuxt/content`. Each file is frontmatter-only (no body) with fields `id`, `title`, `description`, `image`, `link`, `tags[]`. `pages/projects.vue` calls `queryContent('/projects').find()` and sorts by numeric `id` (not the default sort) to control display order. To add a project, create a new markdown file — no code changes required. Tag → icon mapping is hardcoded in `components/project/Card.vue` (`icons2` array); new tag strings must be added there to render an icon.

### Routing & layout
`pages/` produces routes `/`, `/about`, `/contact`, `/projects`. `/cv` is redirected to `/cv.pdf` via a `nitro.routeRules` redirect in `nuxt.config.ts` (the PDF lives in `public/`). All pages use `layouts/default.vue`, which provides `TheNavbar`, the shared vertical-fade-in content container, and the footer. Nav entries are defined once in `composables/useNav.ts` and consumed by both `TheNavbar` and `MobileMenu`.

### Contact form → Discord webhook
`pages/contact.vue` uses `@vee-validate/nuxt` + `zod` for validation and posts to `/api/contact`. `server/api/contact.post.ts` forwards the payload as a Discord embed to `runtimeConfig.webhookUrl`. Set `NUXT_WEBHOOK_URL` in a `.env` file locally — runtime config keys map from env vars following Nuxt's `NUXT_*` convention. Without this env var, form submissions will fail at runtime.

### Styling conventions
Tailwind with the Nuxt UI module (`@nuxt/ui`, prefix `U…` for components like `UNotifications`). Global theme: dark background `#161616`, yellow accent `#facc15`/`#f8e42e`, orange `#ff7d54`. Custom keyframes (`fade-in`, `pulse-slow`, `spin-slow`) and `child`/`child-hover` variants are defined in `tailwind.config.js`. `app.vue` customises toast `#title`/`#description` slots to render HTML via `v-html`, so toast strings may contain markup (see `contact.vue`).

### Icons
Icons come from the `@nuxt/ui` `<Icon />` component backed by Iconify. Use Iconify collection names (e.g. `logos:vue`, `heroicons:puzzle-piece`, `devicon:typescript`).
