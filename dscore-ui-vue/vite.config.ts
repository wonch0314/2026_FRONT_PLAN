import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DscoreUiVue',
      formats: ['es', 'umd'],
      fileName: (format) => `dscore-ui-vue.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['vue', 'dscore-starter-vue'],
      output: {
        globals: {
          vue: 'Vue',
          'dscore-starter-vue': 'DscoreStarterVue',
        },
      },
    },
  },
})
