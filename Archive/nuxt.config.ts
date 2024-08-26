// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/tailwind/index.css"],

  postcss: {
    plugins: {
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // setup middleware

  modules: ["@pinia/nuxt", "@nuxt/ui"],

  colorMode: {
    preference: "light",
  },
  
  ui: {
    global: true,
    // icons: ["mdi", "simple-icons"],
  },
});