import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.SANITY_PROJECT_ID': JSON.stringify('6tepoyf9'),
    'import.meta.env.SANITY_DATASET': JSON.stringify('production'),
    'import.meta.env.SANITY_TOKEN': JSON.stringify('skAEk3zw7eQfKltfS3ztW7crJyGbMH6OjBjaj4tkdMTsFrzcJgvdfPRyQtlYPbObpe7olnkk8rmJLpIrioiQMwuWW12oX3DP3zxW6mINEyGWUdEJkEF8ivzegj2HXA1tRgnusvmJsPXhepZIuiSes3ZNeFtpmz6fWcoQBQRsifID4LcjbWZc'),
  },
});
