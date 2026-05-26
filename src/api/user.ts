import request from '@/utils/request'

import type { ApiResponse } from '@/api/type'

// 用户注册
type RegisterData = {
  isExist: boolean;
}
type RegisterResponse = ApiResponse<RegisterData>
export const registerService = (data: {
  user_name: string;
  user_password: string;
}) => {
  return request.post('/user/register', data) as Promise<RegisterResponse>
}

// 用户登录
type LoginData = {
  user_name: string;
  token: string;
} | null

type LoginResponse = ApiResponse<LoginData>

export const loginService = (data: {
  user_name: string;
  user_password: string;
}) => {
  return request.post('/user/login', data) as Promise<LoginResponse>
}

// 获取用户信息
type UserInfoData = {
  user_name: string;
  user_role: string;
}
type UserInfoResponse = ApiResponse<UserInfoData>
export const getUserInfoService = () => {
  return request.get('/user/info') as Promise<UserInfoResponse>
}