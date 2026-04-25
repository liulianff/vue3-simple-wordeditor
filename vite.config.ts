import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        vue(),
        dts({
          include: 'src/index.ts',
          outDir: 'dist',
        }),
      ],
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
            entryFileNames: 'vue3-simple-wordeditor.[format].js',
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
    base: '/vue3-simple-wordeditor/',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: 'docs'
    },
    server: {
      port: 5174
    }
  }
})
