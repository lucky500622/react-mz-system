import request from '@/utils/request'

import type { ApiResponse } from '@/api/type'

// 用户注册
type RegisterData = {
  user_name: string;
}
type RegisterResponse = ApiResponse<RegisterData>
export const registerService = (data: {
  user_name: string;
  user_password: string;
}) => {
  return request.post('/user/register', data) as Promise<RegisterResponse>
}

// 用户名查重接口
type CheckUsernameData = {
  isExist: boolean;
}
type CheckUsernameResponse = ApiResponse<CheckUsernameData>
export const checkUsernameService = (params: {
  user_name: string;
}) => {
  return request.get('/user/register/checkUsername', { params }) as Promise<CheckUsernameResponse>
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