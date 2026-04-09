import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { resolve } from 'path'

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
  plugins: [{
    name: 'copy-partials',
    closeBundle() {
      const srcPartial = resolve(__dirname, 'public/partials')
      const destPartial = resolve(__dirname, 'dist/partials')
      
      if (!existsSync(srcPartial)) {
        console.error('❌ public/partials folder not found!')
        return
      }
      
      if (!existsSync(destPartial)) {
        mkdirSync(destPartial, { recursive: true })
      }
      
      const files = readdirSync(srcPartial)
      for (const file of files) {
        const srcPath = resolve(srcPartial, file)
        const destPath = resolve(destPartial, file)
        copyFileSync(srcPath, destPath)
        console.log(`✅ Copied: ${file} to dist/partials/`)
      }
    }
  }],
  server: {
    open: false
  }
})