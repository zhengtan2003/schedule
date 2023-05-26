export default {
  '/api/': {
    // 要代理的地址
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
