import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'electron/electron.ts'),
        preload: path.resolve(__dirname, 'electron/preload.ts')
      },
      output: {
        entryFileNames: '[name].js',
        format: 'cjs'
      },
      external: [
        'electron', 'fs', 'path', 'url' // тут все модули node.js, которые ты используешь
      ]
    },
    outDir: 'dist/electron',
    emptyOutDir: false,
    target: 'node18', // или твой Node
    minify: false
  }
})