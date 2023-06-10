// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/task */
export async function TaskControllerFrom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerFromParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建/更新 POST /api/task */
export async function TaskControllerUpsert(
  body: API.UpsertTaskDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 DELETE /api/task */
export async function TaskControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 调试 GET /api/task/debug */
export async function TaskControllerDebug(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerDebugParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/debug', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 列表 POST /api/task/search */
export async function TaskControllerSearch(body: API.SearchDto, options?: { [key: string]: any }) {
  return request<any>('/api/task/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 开始 GET /api/task/start */
export async function TaskControllerStart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerStartParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/start', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 停止 GET /api/task/stop */
export async function TaskControllerStop(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerStopParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/stop', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
