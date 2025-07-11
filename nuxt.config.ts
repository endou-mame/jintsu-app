export default defineNuxtConfig({
  devtools: { enabled: true },
  
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  modules: ['@nuxt/eslint'],
  
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/jintsu_app'
  },
  
  nitro: {
    experimental: {
      wasm: true
    }
  },
  
  vite: {
    optimizeDeps: {
      exclude: ['postgres'],
      include: ['chartjs-adapter-date-fns']
    }
  }
})