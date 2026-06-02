import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取仓库信息
type WarehouseInfoData = {
  warehouseInfo: {
    m_id: number;
    warehouse_name: string;
    warehouse_type: string;
    warehouse_creater: string;
    warehouse_create_time: string;
    warehouse_description: string;
  }[]
}
type WarehouseInfoResponse = ApiResponse<WarehouseInfoData>
export const getWarehouseInfo = (offset: number = 0, limit: number = 999) => {
  return request({
    url: '/warehouse',
    method: 'get',
    params: {
      offset,
      limit
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
type AddWarehouseData = {
  warehouse_name: string;
  warehouse_type: string;
  warehouse_description?: string;
}
type AddWarehouseResponse = ApiResponse<AddWarehouseData>
export const addWarehouse = (data: AddWarehouseData) => {
  return request.post('/warehouse/add', data) as Promise<AddWarehouseResponse>
}