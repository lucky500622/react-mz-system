import request from '@/utils/request'

// 用户注册
type RegisterResponse = {
  code: number;
  msg: string;
  data: {
    user_name: string;
  }
}
export const registerService = (data: {
  user_name: string;
  user_password: string;
}) => {
  return request.post('/user/register', data) as Promise<RegisterResponse>
}

// 用户名查重接口
type CheckUsernameResponse = {
  code: number;
  msg: string;
  data: {
    isExist: boolean;
  }
}
export const checkUsernameService = (data: {
  user_name: string;
}) => {
  return request.get('/user/register/checkUsername', { params: data }) as Promise<CheckUsernameResponse>
}

// 用户登录