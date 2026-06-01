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