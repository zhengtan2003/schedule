export default [
    {path: '/login', layout: false, component: './Login'},
    {
        name: '脚本管理',
        icon: 'table',
        path: '/task',
        component: './Task',
    },
    {path: '/welcome', icon: 'smile', component: './Welcome'},
    {path: '/', redirect: '/welcome'},
    // { path: '*', layout: false, component: './404' },
];
