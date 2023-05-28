// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录 POST /api/auth/login */
export async function authLogin(body: API.LoginDto, options?: { [key: string]: any }) {
  return request<any>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
