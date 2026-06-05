import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取产品信息
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

// 获取产品操作记录
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

// 添加产品
export const addProduct = (data: {
  name: string,
  belong_id: number,
  type: string,
  count: number,
  description: string
}) => {
  return request.post('/product/add', data) as Promise<ApiResponse<null>>
}

// 删除产品
export const deleteProduct = (data: {
  m_id: number;
}) => {
  return request.delete('/product/delete', { params: data }) as Promise<ApiResponse<null>>
}

// 调整产品数量
export type AdjustProductData = {
  endNum: number;
}
type AdjustProductResponse = ApiResponse<AdjustProductData>
export const adjustProduct = (data: {m_id: number, action_type: number, product_num: number}) => {
  return request.patch('/product/update', data) as Promise<AdjustProductResponse>
}
