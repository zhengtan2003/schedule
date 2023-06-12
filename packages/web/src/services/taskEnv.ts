// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建/更新 POST /api/task/env */
export async function TaskEnvControllerUpsertEnv(
  body: API.TaskEnvDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/env', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 DELETE /api/task/env */
export async function TaskEnvControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskEnvControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/env', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/task/env/from */
export async function TaskEnvControllerForm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskEnvControllerFormParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/env/from', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 🔍列表 POST /api/task/env/search */
export async function TaskEnvControllerSearch(
  body: API.SearchDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/env/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
