import request from '@/utils/request'

// 用户注册
export const registerService = (data: {
  user_name: string;
  user_password: string;
}) => {
  return request.post('/user/register', data)
}

// 用户名查重接口
export const checkUsernameService = (data: {
  user_name: string;
}) => {
  return request.get('/user/register/checkUsername', { params: data })
}

// 用户登录