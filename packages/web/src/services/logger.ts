// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 DELETE /api/logger/remove */
export async function LoggerControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.LoggerControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/logger/remove', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 🔍列表 POST /api/logger/search */
export async function LoggerControllerLogSearch(
  body: API.SearchDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/logger/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
