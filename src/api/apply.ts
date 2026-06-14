import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 提交申请
export const submitApply = (data: { approve_user_name: string, apply_role: string}) => {
  return request.post('/apply/add', data) as Promise<ApiResponse<null>>
}
