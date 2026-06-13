import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 用户注册
export const registerService = (data: {
  user_name: string;
  user_password: string;
}) => {
  return request.post('/user/register', data) as Promise<ApiResponse<null>>
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

// 更新用户密码
export const updatePasswordService = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return request.post('/user/update', data) as Promise<ApiResponse<null>>
}

// 退出登录
export const logoutService = () => {
  return request.post('/user/logout') as Promise<ApiResponse<null>>
}