import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the animation library in its own cacheable chunk.
          gsap: ['gsap'],
        },
      },
    },
  },
});
