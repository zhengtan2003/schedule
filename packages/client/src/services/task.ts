// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /api/task */
export async function TaskControllerUpdate(
  body: API.UpdateTaskDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/task */
export async function TaskControllerCreat(
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

/** 任务详情 GET /api/task/details */
export async function TaskControllerDetails(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerDetailsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/details', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Antd From 组件 GET /api/task/from */
export async function TaskControllerFrom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerFromParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/from', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新任务的脚本Ext POST /api/task/scripExt */
export async function TaskControllerUpdateScripExt(
  body: API.UpdateScripExtDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/scripExt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 任务关联的脚本列表 GET /api/task/script */
export async function TaskControllerScript(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TaskControllerScriptParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/script', {
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

/** 任务与脚本关联同步 POST /api/task/syncScrip */
export async function TaskControllerSyncScrip(
  body: API.SyncScripDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/task/syncScrip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 开始/停止 POST /api/task/toggle */
export async function TaskControllerToggle(options?: { [key: string]: any }) {
  return request<any>('/api/task/toggle', {
    method: 'POST',
    ...(options || {}),
  });
}
