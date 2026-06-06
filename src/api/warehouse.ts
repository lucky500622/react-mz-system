import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取仓库信息
export type WarehouseInfoData = {
  m_id: number;
  warehouse_name_ed: string | null;
  warehouse_name: string;
  warehouse_type: string;
  user_name: string;
  warehouse_create_time: string;
  warehouse_description: string;
}
type WarehouseData = {
  warehouseInfo: WarehouseInfoData[]
 }
type WarehouseInfoResponse = ApiResponse<WarehouseData>
export const getWarehouseInfo = (offset: number = 0, limit: number = 999, values?: {
    m_id?: number;
    warehouse_name?: string;
    warehouse_type?: string;
    user_name?: string;
  }) => {
  return request({
    url: '/warehouse',
    method: 'get',
    params: {
      offset,
      limit,
      ...values
    }
  }) as Promise<WarehouseInfoResponse>
}

// 获取仓库操作记录
type WarehouseActionData = {
  actionInfo: {
    m_id: number;
    issue_object: number;
    issue_create_time: string;
    creater: string;
    warehouse_name: string;
    action_type: string;
    warehouse_rename: string;
  }[]
}
type WarehouseActionResponse = ApiResponse<WarehouseActionData>
export const getWarehouseAction = (offset: number = 0, limit: number = 999) => {
  return request.get('/warehouse/action', {
    params: {
      offset,
      limit
    }
  }) as Promise<WarehouseActionResponse>
}

// 新增仓库
export const addWarehouse = (data: {
  warehouse_name: string;
  warehouse_type: string;
  warehouse_description?: string;
}) => {
  return request.post('/warehouse/add', data) as Promise<ApiResponse<null>>
}

// 编辑仓库
export const editWarehouse = (data: {
  m_id: number,
  warehouse_name: string
}) => {
  return request.patch('/warehouse/edit', data) as Promise<ApiResponse<null>>
}

// 删除仓库
export const deleteWarehouse = (data: {
  m_id: number
}) => {
  return request.delete('/warehouse/delete', {
    params: data
  }) as Promise<ApiResponse<null>>
}