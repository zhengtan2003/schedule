import { defineConfig } from '@umijs/max';
import { join } from 'path';
import { defaultSettings } from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
export default defineConfig({
  proxy,
  routes,
  layout: {
    ...defaultSettings,
  },
  model: {},
  hash: true,
  mock: false,
  tailwindcss: {},
  initialState: {},
  fastRefresh: true,
  title: 'Schedule',
  ignoreMomentLocale: true,
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
