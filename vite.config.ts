import { defineConfig } from 'vite'
import eslint from '@rollup/plugin-eslint'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {...eslint({include: 'src/**/*.+(js|jsx|ts|tsx)'}), enforce: 'pre'},
    reactRefresh()
  ],
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output : {
        manualChunks: {
          '@white-matrix/nft-mirror-sdk': ['@white-matrix/nft-mirror-sdk']
        }
      }
    }
  },
})
