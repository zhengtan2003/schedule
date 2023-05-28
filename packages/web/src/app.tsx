import React from 'react';
import {history} from '@umijs/max';
import {currentUser} from './services/currentUser';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {SettingDrawer} from '@ant-design/pro-components';
import {defaultSettings} from '../config/defaultSettings';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {AvatarDropdown, AvatarName} from '@/components'

export * from './request';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: any;
    loading?: boolean;
    fetchUserInfo?: () => Promise<any | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const msg = await currentUser({
                skipErrorHandler: true,
            });
            return msg.data;
        } catch (error) {
            history.push(loginPath);
        }
        return undefined;
    };
    // 如果不是登录页面，执行
    const {location} = history;
    if (location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        return {
            fetchUserInfo,
            currentUser,
            settings: defaultSettings as Partial<LayoutSettings>,
        };
    }
    return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout /
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
    return {
        avatarProps: {
            src: initialState?.currentUser?.avatar,
            title: <AvatarName/>,
            render: (_, avatarChildren) => {
                return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
            },
        },
        waterMarkProps: {
            content: initialState?.currentUser?.name,
        },
        onPageChange: () => {
            const {location} = history;
            // 如果没有登录，重定向到 login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath);
            }
        },
        layoutBgImgList: [
            {
                src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
                left: 85,
                bottom: 100,
                height: '303px',
            },
            {
                src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
                bottom: -68,
                right: -45,
                height: '303px',
            },
            {
                src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
                bottom: 0,
                left: 0,
                width: '331px',
            },
        ],
        menuHeaderRender: undefined,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
        childrenRender: (children) => {
            // if (initialState?.loading) return <PageLoading />;
            return (
                <>
                    {children}
                    <SettingDrawer
                        disableUrlParams
                        enableDarkTheme
                        settings={initialState?.settings}
                        onSettingChange={(settings) => {
                            setInitialState((preInitialState) => ({
                                ...preInitialState,
                                settings,
                            }));
                        }}
                    />
                </>
            );
        },
        ...initialState?.settings,
    };
};
