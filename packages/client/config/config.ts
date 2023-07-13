import { defineConfig } from '@umijs/max';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { defaultSettings } from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

export default defineConfig({
  proxy,
  routes,
  layout: {
    ...defaultSettings,
  },
  analyze: {},
  model: {},
  hash: true,
  mock: false,
  tailwindcss: {},
  initialState: {},
  fastRefresh: true,
  title: 'Schedule',
  chainWebpack: (memo, { env }) => {
    process.env.ANALYZE === '1' &&
      memo.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
  },
  ignoreMomentLocale: true,
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  antd: {},
  request: {},
  access: {},
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
  },
  headScripts: [
    {
      src: '/scripts/loading.js',
      async: true,
    },
    {
      src: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.${process.env.NODE_ENV}.min.js`,
      crossorigin: true,
    },
    {
      src: `https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.${process.env.NODE_ENV}.min.js`,
      crossorigin: true,
    },
    'https://cdn.jsdelivr.net/npm/moment@2.29.4/min/moment.min.js',
  ],
  presets: ['umi-presets-pro'],
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'http://localhost:3000/swagger-doc-json',
      projectName: './',
    },
  ],
  mfsu: false,
  requestRecord: {},
  npmClient: 'pnpm',
});
