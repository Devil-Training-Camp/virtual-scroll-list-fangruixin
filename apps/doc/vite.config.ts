import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return ({
    plugins: [vue()],
    resolve: {
      alias: mode === 'development' ? [
        {
          find: 'virtual-scroll-list-vue',
          replacement: fileURLToPath(new URL('../../packages/virtual-scroll-list-vue/src/index.ts', import.meta.url))
        }
      ] : undefined
    }
  })
})
