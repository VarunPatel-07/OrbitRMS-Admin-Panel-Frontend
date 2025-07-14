import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    eslint({
      fix: true,
      failOnWarning: false,
      failOnError: true,
    }),
  ],
  assetsInclude: ['**/*.lottie'],
})
