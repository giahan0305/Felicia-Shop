import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@contexts': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    host: '0.0.0.0', // Đảm bảo Vite lắng nghe trên mọi địa chỉ IP
    port: 5173, // Cổng mặc định hoặc có thể thay đổi thành một cổng khác nếu cần
  },
});
