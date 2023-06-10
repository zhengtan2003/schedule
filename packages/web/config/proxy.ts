export default {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/ws': {
    target: 'ws://localhost:8080',
    changeOrigin: true,
    ws: true,
  },
};
