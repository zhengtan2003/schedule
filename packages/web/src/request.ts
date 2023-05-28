import type {RequestOptions, AxiosResponse} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {message, notification} from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
    SILENT = 0,
    WARN_MESSAGE = 1,
    ERROR_MESSAGE = 2,
    NOTIFICATION = 3,
    REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
    success: boolean;
    data: any;
    code?: number;
    message?: string;
    showType?: ErrorShowType;
}

const authHeaderInterceptor = (url: string, options: RequestOptions) => {
    const Authorization = localStorage.getItem('authorization')
    const authHeader = {Authorization};
    return {
        url: `${url}`,
        options: {...options, interceptors: true, headers: authHeader},
    };
};
export const request: RequestConfig = {
    errorConfig: {
        errorThrower: (res) => {
            const {success, data, code, message, showType} =
                res as unknown as ResponseStructure;
            if (!success) {
                const error: any = new Error(message);
                error.name = 'BizError';
                error.info = {code, message, showType, data};
                throw error; // 抛出自制的错误
            }
        },
        // 错误接收及处理
        errorHandler: (error: any, opts: any) => {
            if (opts?.skipErrorHandler) throw error;
            // 我们的 errorThrower 抛出的错误。
            if (error.name === 'BizError') {
                const errorInfo: ResponseStructure | undefined = error.info;
                if (errorInfo) {
                    const {message: errorMessage, code} = errorInfo;
                    switch (errorInfo.showType) {
                        case ErrorShowType.SILENT:
                            // do nothing
                            break;
                        case ErrorShowType.WARN_MESSAGE:
                            message.warning(errorMessage);
                            break;
                        case ErrorShowType.ERROR_MESSAGE:
                            message.error(errorMessage);
                            break;
                        case ErrorShowType.NOTIFICATION:
                            notification.open({
                                description: errorMessage,
                                message: code,
                            });
                            break;
                        case ErrorShowType.REDIRECT:
                            // TODO: redirect
                            break;
                        default:
                            message.error(errorMessage);
                    }
                }
            } else if (error.response) {
                // Axios 的错误
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                message.error(`Response status:${error.response.status}`);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                message.error('None response! Please retry.');
            } else {
                // 发送请求时出了点问题
                message.error('Request error, please retry.');
            }
        },
    },
    responseInterceptors: [(response: any) => {
        const {showType, msg} = response.data;
        if (showType) {
            message.success(msg)
        }
        return response
    }],
    requestInterceptors: [authHeaderInterceptor],
};
