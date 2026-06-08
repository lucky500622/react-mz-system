import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取仓库信息
export type WarehouseInfoData = {
  m_id: number;
  warehouse_name_ed: string | null;
  warehouse_name: string;
  warehouse_type: string;
  exists_list_product: number;
  exists_user_handle: number;
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
  description: string
}) => {
  return request.patch('/warehouse/editDescription', data) as Promise<ApiResponse<null>>
}

// 删除仓库
export const deleteWarehouse = (data: {
  m_id: number;
}) => {
  return request.patch('/warehouse/delete', null, {
    params: data
  }) as Promise<ApiResponse<null>>
}

// 获取仓库详情
type WarehouseDetailDataObj = {
  exists_user_handle: number;
  exists_list_product: number;
  m_id: number;
  product_num: number;
  warehouse_create_time: string;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_name_ed: string | null;
}
type WarehouseDetailData = {
  warehouseInfo: WarehouseDetailDataObj[]
}
type WarehouseDetailResponse = ApiResponse<WarehouseDetailData>
export const getWarehouseDetail = (data: {
  m_id: number
}) => {
  return request.get('/warehouse/info', {
    params: data
  }) as Promise<WarehouseDetailResponse>
}

// 获取仓库名称
export type WarehouseNameData = {
  name: {name: string}[]
}
export const getWarehouseName = (text: string) => {
  return request.get('/warehouse/name', {
    params: {
      text
    }
  }) as Promise<ApiResponse<WarehouseNameData>>
}

// 获取经手仓库
export type HandleWarehouseInfo = {
  m_id: number;
  warehouse_name: string;
  warehouse_type: string;
}
type HandleWarehouseInfoData = {
  handleWarehouseInfo: HandleWarehouseInfo[]
}
export const getHandleWarehouseInfo = () => {
  return request.get('/warehouse/handle') as Promise<ApiResponse<HandleWarehouseInfoData>>
}

// 新增经手仓库
export const addHandleWarehouse = (data: {
  m_id: number;
}) => {
  return request.patch('/warehouse/addHandle', data) as Promise<ApiResponse<null>>
}