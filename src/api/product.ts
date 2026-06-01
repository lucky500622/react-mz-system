import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取商品信息
type ProductInfoData = {
  productInfo: {
    m_id: number;
    product_name: string;
    product_type: string;
    product_num: number;
    warehouse_description: string;
  }[]
}
type ProductInfoResponse = ApiResponse<ProductInfoData>
export const getProductInfo = (offset: number = 0, limit: number = 999) => {
  return request({
    url: '/product',
    method: 'get',
    params: {
      offset,
      limit
    }
  }) as Promise<ProductInfoResponse>
}