import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取仓库信息
export type WarehouseInfoData = {
  m_id: number;
  warehouse_name_ed: string | null;
  warehouse_name: string;
  warehouse_type: string;
  exists_list_product: number;
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
export type WarehouseActionInfoData = {
  m_id: number;
  issue_object: number;
  issue_create_time: string;
  creater: string;
  warehouse_name: string;
  action_type: string;
  warehouse_rename: string;
}
type WarehouseActionData = {
  actionInfo: WarehouseActionInfoData[]
}
type WarehouseActionResponse = ApiResponse<WarehouseActionData>
import type { warehouseConfig } from '@/pages/ActInfo/components/ActTabs'
export const getWarehouseAction = (offset: number = 0, limit: number = 999, values?: warehouseConfig) => {
  return request.get('/warehouse/action', {
    params: {
      offset,
      limit,
      ...values
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

// 编辑仓库描述
export const editWarehouseDescription = (data: {
  m_id: number,
  warehouse_description: string
}) => {
  return request.patch('/warehouse/editDescription', data) as Promise<ApiResponse<null>>
}

// 删除仓库
export const deleteWarehouse = (data: {
  m_id: number
}) => {
  return request.delete('/warehouse/delete', {
    params: data
  }) as Promise<ApiResponse<null>>
}

// 获取仓库详情
type WarehouseDetailDataList = {
  exists_list_product: number;
  m_id: number;
  product_num: number;
  warehouse_create_time: string;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_name_ed: string | null;
}
type WarehouseDetailData = {
  warehouseInfo: WarehouseDetailDataList[]
}
type WarehouseDetailResponse = ApiResponse<WarehouseDetailData>
export const getWarehouseDetail = (data: {
  m_id: number
}) => {
  return request.get('/warehouse/info', {
    params: data
  }) as Promise<WarehouseDetailResponse>
}
