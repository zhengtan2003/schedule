export default [
    {path: '/login', layout: false, component: './Login'},
    {
        name: '脚本管理',
        icon: 'table',
        path: '/script',
        routes:[
            {
                path: '/script',
                component: './Script',
            },
            {
                path: '/script/upsert',
                component: './Script/Upsert',
            }
        ]
    },
    {
        name: '任务管理',
        icon: 'table',
        path: '/task',
        component: './Task',
    },
    {path: '/welcome', icon: 'smile', component: './Welcome'},
    {path: '/', redirect: '/welcome'},
    // { path: '*', layout: false, component: './404' },
];
