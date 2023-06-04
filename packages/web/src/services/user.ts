// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/user */
export async function UserControllerFindAll(options?: { [key: string]: any }) {
  return request<any>('/api/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建 POST /api/user */
export async function UserControllerCreate(
  body: API.CreateUserDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/user/${param0} */
export async function UserControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerFindOneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/user/${param0} */
export async function UserControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerRemoveParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /api/user/${param0} */
export async function UserControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerUpdateParams,
  body: API.UpdateUserDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 当前登录用户信息 GET /api/user/current */
export async function UserControllerCurrent(options?: { [key: string]: any }) {
  return request<any>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}
