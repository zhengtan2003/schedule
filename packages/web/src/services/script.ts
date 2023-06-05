// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取 GET /api/script */
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

/** 创建 POST /api/script */
export async function ScriptControllerCreat(
  body: API.CreateScriptDto,
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

/** 更新 PATCH /api/script */
export async function ScriptControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ScriptControllerUpdateParams,
  body: API.UpdateScriptDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script', {
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

/** list-用于antd select GET /api/script/select */
export async function ScriptControllerSelect(options?: { [key: string]: any }) {
  return request<any>('/api/script/select', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 订阅 POST /api/script/subscribe */
export async function ScriptControllerSubscribe(
  body: API.SubscribeDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/script/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
