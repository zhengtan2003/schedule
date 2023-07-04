// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建/更新 POST /api/script */
export async function ScriptControllerUpsert(
  body: API.UpdateScriptDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 DELETE /api/script */
export async function ScriptControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ScriptControllerRemoveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** from GET /api/script/from */
export async function ScriptControllerFrom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ScriptControllerFromParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script/from', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** options GET /api/script/options */
export async function ScriptControllerOptions(options?: { [key: string]: any }) {
  return request<any>('/api/script/options', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 列表 POST /api/script/search */
export async function ScriptControllerSearch(
  body: API.SearchDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
