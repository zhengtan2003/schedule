// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 DELETE /api/log/remove */
export async function LogControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.LogControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/log/remove', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 🔍列表 POST /api/log/search */
export async function LogControllerLogSearch(
  body: API.SearchDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/log/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
