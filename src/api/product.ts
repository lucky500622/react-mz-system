import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

// 获取产品信息
export type ProductInfoData = {
  m_id: number;
  product_belong_id: number;
  product_name: string;
  product_type: string;
  product_num: number;
  product_list_num: number;
  product_diff_num: number;
  warehouse_description: string;
}
type ProductData = {
  productInfo: ProductInfoData[]
}
type ProductInfoResponse = ApiResponse<ProductData>
export const getProductInfo = (offset: number = 0, limit: number = 999, values?: {
  m_id?: number;
  warehouse_m_id?: number;
  product_name?: string;
  product_type?: string;
}) => {
  return request({
    url: '/product',
    method: 'get',
    params: {
      offset,
      limit,
      ...values
    }
  }) as Promise<ProductInfoResponse>
}

// 获取产品操作记录
export type ProductActionInfoData = {  
  m_id: number;
  issue_object: number;
  issue_create_time: string;
  creater: string;
  product_name: string;
  action_type: string;
  action_num: number;
}
type ProductActionData = {
  actionInfo: ProductActionInfoData[]
}
type ProductActionResponse = ApiResponse<ProductActionData>
import type { productConfig } from '@/pages/ActInfo/components/ActTabs'
export const getProductAction = (offset: number = 0, limit: number = 999, values?: productConfig) => { 
  return request.get('/product/action', {
    params: {
      offset,
      limit,
      ...values
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
  return request.patch('/product/delete', null, {
    params: data
  }) as Promise<ApiResponse<null>>
}

// 调整产品数量
export type AdjustProductData = {
  endNum: number;
}
type AdjustProductResponse = ApiResponse<AdjustProductData>
export const adjustProduct = (data: {m_id: number, action_type: number, product_num: number}) => {
  return request.patch('/product/update', data) as Promise<AdjustProductResponse>
}

// 编辑产品描述
export const editProductDescription = (data: {m_id: number, description: string}) => {
  return request.patch('/product/editDescription', data) as Promise<ApiResponse<null>>
}

type ProductNameData = {
  name: {name: string }[]
}
// 获取产品名称
export const getProductName = (text: string) => {
  return request.get('/product/name', {
    params: {
      text
    }
  }) as Promise<ApiResponse<ProductNameData>>
}