import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

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
  const Authorization = localStorage.getItem('authorization');
  const authHeader = { Authorization };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
export const request: RequestConfig = {
  errorConfig: {
    errorThrower: (res: any) => {
      const { success, data, code, message, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(message);
        error.name = 'BizError';
        error.info = { code, message, showType, data };
        throw error;
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        const { showType, message: errorMessage } = error.info;
        if (showType === 1) {
          message.error(errorMessage);
        } else if (showType === 2) {
          message.warning(errorMessage);
        }
      } else if (error.name === 'AxiosError') {
        const { statusText, data } = error.response;
        notification.error({
          message: statusText,
          description: data,
        });
      } else if (error.request) {
        message.error('无响应，请重试。');
      } else {
        message.error('请求错误，请重试。');
      }
    },
  },
  responseInterceptors: [
    (response: any) => {
      if (response.data.success && response.data.showType === 1) {
        message.success(response.data.message);
      }
      return response;
    },
  ],
  requestInterceptors: [authHeaderInterceptor],
};
