import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 提交申请
export const submitApply = (data: { approve_user_name: string, apply_role: string}) => {
  return request.post('/apply/add', data) as Promise<ApiResponse<null>>
}

// 获取待处理申请
export type ApplyObj = {
  m_id: number,
  apply_role: string,
  apply_create_time: string,
  user_name: string,
}
export type Apply = {
  applyList: ApplyObj[]
}
export const getRequestApply = () => {
  return request.get('/apply/list') as Promise<ApiResponse<Apply>>
}

// 处理申请
export const handleApply = (data: { m_id: number, apply_status: number, apply_role: string, user_name: string }) => {
  return request.patch('/apply/approve', data) as Promise<ApiResponse<null>>
}

// 获取用户权限变更申请信息
export const getApplyInfo = () => {
  return request.get('/apply/info') as Promise<ApiResponse<ApplyObj>>
}
