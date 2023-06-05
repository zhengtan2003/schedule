// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/task */
export async function TaskControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerFindOneParams,
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

/** 创建 POST /api/task */
export async function TaskControllerCreate(
  body: API.CreateTaskDto,
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

/** 更新 PATCH /api/task */
export async function TaskControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerUpdateParams,
  body: API.UpdateTaskDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
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
