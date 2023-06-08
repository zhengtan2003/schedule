// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

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

/** 创建env/更新env POST /api/task/env */
export async function TaskControllerUpsertEnv(
  body: API.UpsertTaskEnvDto,
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

/** 删除env DELETE /api/task/env */
export async function TaskControllerRemoveEnv(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerRemoveEnvParams,
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

/** 用于antd from组件 GET /api/task/env/retrieve */
export async function TaskControllerEnvRetrieve(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerEnvRetrieveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/env/retrieve', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** env列表 POST /api/task/env/search */
export async function TaskControllerEnvSearch(
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

/** 此处后端没有提供注释 POST /api/task/log/remove/all */
export async function TaskControllerRemoveAllLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerRemoveAllLogParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/log/remove/all', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得日志 POST /api/task/log/search */
export async function TaskControllerLogSearch(
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
