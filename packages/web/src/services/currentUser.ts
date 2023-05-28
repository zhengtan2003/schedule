// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 当前用户信息 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<any>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}
