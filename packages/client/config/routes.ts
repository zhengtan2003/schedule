export default [
  { path: '/login', layout: false, component: './Login' },
  {
    name: '脚本管理',
    icon: 'FileOutlined',
    path: '/script',
    routes: [
      {
        path: '/script',
        component: './Script',
      },
      {
        name: '新建脚本',
        hideInMenu: true,
        path: '/script/create',
        component: './Script/Upsert',
      },
      {
        name: '编辑脚本',
        hideInMenu: true,
        path: '/script/update/:id',
        component: './Script/Upsert',
      },
    ],
  },
  {
    name: '任务管理',
    icon: 'CodepenOutlined',
    path: '/task',
    routes: [
      {
        path: '/task', redirect: '/task/list'
      },
      {
        path: '/task/list',
        component: './Task/List',
      },
      {
        path: '/task/details',
        component: './Task/Details',
      }
    ],
  },
  {
    name: '终端',
    icon: 'CodeOutlined',
    path: '/terminal',
    routes: [
      {
        path: '/terminal',
        component: './Terminal',
      },
    ],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
  { path: '/', redirect: '/welcome' },
  // { path: '*', layout: false, component: './404' },
];
