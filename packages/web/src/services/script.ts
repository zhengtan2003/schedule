// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/script */
export async function ScriptControllerRetrieve(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ScriptControllerRetrieveParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建/更新 POST /api/script */
export async function ScriptControllerUpsert(
  body: API.UpsertScriptDto,
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

/** 此处后端没有提供注释 GET /api/script/enum */
export async function ScriptControllerEnum(options?: { [key: string]: any }) {
  return request<any>('/api/script/enum', {
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

/** 订阅 POST /api/script/subscribe */
export async function ScriptControllerSubscribe(options?: { [key: string]: any }) {
  return request<any>('/api/script/subscribe', {
    method: 'POST',
    ...(options || {}),
  });
}
