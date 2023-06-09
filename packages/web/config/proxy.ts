export default {
  '/api/': {
    // 要代理的地址
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  // '/api/': {
  //   // 要代理的地址
  //   target: 'http://159.75.217.92',
  //   changeOrigin: true,
  // },
};
