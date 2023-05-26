import proxy from './proxy';
import routes from './routes';
import {defineConfig} from '@umijs/max';
import defaultSettings from './defaultSettings';

const {REACT_APP_ENV = 'dev'} = process.env;
export default defineConfig({
  proxy,
  routes,
  hash: true,
  ignoreMomentLocale: true,
  fastRefresh: true,
  model: {},
  initialState: {},
  title: 'Ant Design Pro',
  layout: {
    locale: true,
    ...defaultSettings,
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  antd: {},
  request: {},
  access: {},
  headScripts: [
    {
      src: '/scripts/loading.js',
      async: true,
    },
  ],
  presets: ['umi-presets-pro'],
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from '@umijs/max'",
  //     schemaPath: 'http://localhost:3000/swagger-doc-json',
  //     projectName: './',
  //     mock: false
  //   },
  // ],
  mfsu: {
    strategy: 'normal',
  },
  requestRecord: {},
  npmClient: 'pnpm',
});
