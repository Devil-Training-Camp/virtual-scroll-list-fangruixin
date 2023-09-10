import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const name = 'virtual-scroll-list-vue'

const outputFileName = {
  es: `${name}.mjs`,
  cjs: `${name}.cjs`,
  iife: `${name}.iife.js`,
}

const formats = Object.keys(outputFileName) as Array<keyof typeof outputFileName>

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VirtualScrollListVue',
      formats,
      fileName: format => outputFileName[format],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
