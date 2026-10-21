// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    webhookUrl: ''
  },
  nitro: {
    routeRules: {
      '/': { prerender: true },
      '/about': { prerender: true },
      '/projects': { prerender: true },
      '/contact': { prerender: true },
      '/about-contact': { prerender: true },
      '/cv': {
        redirect: '/cv.pdf'
      }
    }
  },
  app: {
    head: {
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  },

  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true },
      },
    },
  },

  icon: {
    provider: 'server',
    serverBundle: 'local',
    fallbackToApi: false,
  },

  modules: [
    "@nuxt/content",
    '@nuxt/ui',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    "@nuxt/image"
  ],

  compatibilityDate: '2024-12-06',
});
