// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

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

/** 当前登录用户信息 GET /api/user/current */
export async function UserControllerCurrent(options?: { [key: string]: any }) {
  return request<any>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}
