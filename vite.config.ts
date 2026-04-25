import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [vue()],
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src')
        }
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'Vue3SimpleWordEditor',
          formats: ['es', 'umd'],
          fileName: (format) => `vue3-simple-wordeditor.${format}.js`,
        },
        rollupOptions: {
          external: ['vue', 'lucide-vue-next'],
          output: {
            exports: 'named',
            globals: {
              vue: 'Vue',
              'lucide-vue-next': 'LucideVueNext',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'vue3-simple-wordeditor.css'
              return assetInfo.name!
            },
          },
        },
        cssCodeSplit: false,
        outDir: 'dist',
      },
    }
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5174
    }
  }
})
