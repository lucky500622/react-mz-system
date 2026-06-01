import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

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
  return request.get('/action/warehouse', {
    params: {
      offset,
      limit
    }
  }) as Promise<WarehouseActionResponse>
}


// 获取商品操作记录
type ProductActionData = {  
  actionInfo: {
    m_id: number;
    issue_object: number;
    issue_create_time: string;
    creater: string;
    product_name: string;
    action_type: string;
    action_num: number;
  }[]
}
type ProductActionResponse = ApiResponse<ProductActionData>
export const getProductAction = (offset: number = 0, limit: number = 999) => { 
  return request.get('/action/product', {
    params: {
      offset,
      limit
    }
  }) as Promise<ProductActionResponse>
}
