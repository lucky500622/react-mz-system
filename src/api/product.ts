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
export type productConfig = {
  m_id?: number,
  product_m_id?: number,
  product_name?: string,
  user_name?: string,
  action_type?: number
}
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

// 获取产品名称
type ProductNameData = {
  name: {name: string }[]
}
export const getProductName = (text: string) => {
  return request.get('/product/name', {
    params: {
      text
    }
  }) as Promise<ApiResponse<ProductNameData>>
}

// 获取仓库产品信息
type WarehouseProduct = {
  listed_product_num: number;
  m_id: number;
  product_count: number;
  product_description: string;    
  product_diff_num: number;
  product_list_num: number;
  product_name: string;
  product_num: number; 
  product_type: string;
}
export type WarehouseProductData = {
  warehouse_name: string;
  warehouse_type: string;
  warehouseProduct: WarehouseProduct[]
}
export const getWarehouseProduct = (
  warehouse_m_id: number, product_m_id?: number, product_name?: string, product_type?: string
) => {
  return request.get('/product/infoOfWarehouse', {
    params: {
      warehouse_m_id,
      product_m_id,
      product_name,
      product_type
    }
  }) as Promise<ApiResponse<WarehouseProductData>>
}

// 上下架产品
export const upDownProduct = (data: {m_id: number, action_type: number, product_num?: number, action_all: boolean},
  warehouse_m_id: number) => {
  return request.patch('/product/list/update', data, {
    params: {
      warehouse_m_id
    }
  }) as Promise<ApiResponse<null>>
}

// 售出产品
export const saleProduct = (data: {m_id: number, product_num: number}, warehouse_m_id: number) => {
  return request.patch('/product/sale', data, {
    params: {
      warehouse_m_id
    }
  }) as Promise<ApiResponse<null>>
}

// 获取产品总览
export type ProductOverviewData = {
  count: number;
  total_product_num: number;
  listed_product_num: number;
}
export const getProductOverview = () => {
  return request.get('/product/overview') as Promise<ApiResponse<ProductOverviewData>>
}

// 获取产品近7天的新增总量减少总量售出总量操作信息
type ProductDayActionData = {
  productDayActionInfo: {
    in_arr: string;
    out_arr: string;
    sale_arr: string;
  }
}
export const getProductDayAction = () => {
  return request.get('/product/dayActionInfo') as Promise<ApiResponse<ProductDayActionData>>
}

// 获取产品警告
export type ProductWarning = {
  m_id: number;
  product_m_id: number;
  product_name: string;
  warehouse_name: string;
  product_diff_num: number;
  product_list_num: number;
}
type ProductWarningData = {
  warning: ProductWarning[]
}
export const getProductWarning = () => {
  return request.get('/product/warning') as Promise<ApiResponse<ProductWarningData>>
}