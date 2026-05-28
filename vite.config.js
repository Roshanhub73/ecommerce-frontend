import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Only allow admin requests from /admin origin
            if (req.originalUrl.includes('/admin/') && !req.headers.origin?.includes('/admin')) {
              console.log('🔍 Blocking admin request from non-admin origin:', req.headers.origin);
              res.writeHead(403, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': req.headers.origin || 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin'
              });
              res.end('Access denied: Admin requests only allowed from /admin origin');
              return;
            }
          });
        }
      },
    },
  },
})
