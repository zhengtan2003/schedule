// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/env */
export async function EnvControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.EnvControllerFindOneParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/env', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 POST /api/env */
export async function EnvControllerCreate(
  body: API.CreateEnvDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/env', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 DELETE /api/env */
export async function EnvControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.EnvControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/env', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新 PATCH /api/env */
export async function EnvControllerUpdate(
  body: API.UpdateEnvDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/env', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/env/form */
export async function EnvControllerForm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.EnvControllerFormParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/env/form', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 列表 POST /api/env/search */
export async function EnvControllerSearch(body: API.SearchDto, options?: { [key: string]: any }) {
  return request<any>('/api/env/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
