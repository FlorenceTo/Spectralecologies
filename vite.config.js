import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '',   // add this line
  server: {
    proxy: {
      '/api/copernicus-token': {
        target: 'https://shapps.dataspace.copernicus.eu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/copernicus-token/, '/auth/realms/CDSE/protocol/openid-connect/token'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.body) {
              const bodyData = new URLSearchParams(req.body).toString();
              proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
              proxyReq.end();
            }
          });
        }
      }
    }
  }
})
