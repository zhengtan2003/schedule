// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 DELETE /api/task/log/remove */
export async function TaskLogControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskLogControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/log/remove', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 🔍列表 POST /api/task/log/search */
export async function TaskLogControllerLogSearch(
  body: API.SearchDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/log/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
