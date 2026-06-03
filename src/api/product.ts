import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取商品信息
type ProductInfoData = {
  productInfo: {
    m_id: number;
    product_belong_id: number;
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
  return request.get('/product/action', {
    params: {
      offset,
      limit
    }
  }) as Promise<ProductActionResponse>
}

// 添加商品
export type AddProductData = {
  m_id: number;
  product_name: string;
  product_type?: string;
  product_num: number;
  warehouse_description?: string;
}
type AddProductResponse = ApiResponse<AddProductData>
export const addProduct = (data: AddProductData) => {
  return request.post('/product/add', data) as Promise<AddProductResponse>
}
