// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建/更新 POST /api/env */
export async function EnvControllerUpsert(
  body: API.UpsertTaskEnvDto,
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

/** 此处后端没有提供注释 GET /api/env/from */
export async function EnvControllerForm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.EnvControllerFormParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/env/from', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 🔍列表 POST /api/env/search */
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
