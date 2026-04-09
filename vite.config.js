import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        results: 'src/results.html',
        details: 'src/details.html',
        favorites: 'src/favorites.html',
        search: 'src/search.html'
      }
    }
  },
  server: {
    open: false
  }
})