import { useState, useEffect } from 'react'

import { Tabs } from 'antd'

import '@/pages/ActInfo/components/styles/actTabs.scss'
import StoreTable from '@/pages/ActInfo/components/StoreTable'
import ProductTable from '@/pages/ActInfo/components/ProductTable'
import FunctionBar from '@/pages/ActInfo/components/FunctionBar'
import { useLoading } from '@/hooks/useLoading'
import { getProductAction } from '@/api/product'
import type { ProductActionInfoData, productConfig } from '@/api/product'
import { getWarehouseAction } from '@/api/warehouse'
import type { WarehouseActionInfoData, warehouseConfig } from '@/api/warehouse'

const ActTable = () => {
  // FunctionBar配置
  const warehouseLabelConfig = {
    config_type: 'warehouse'
  }
  const warehouseOptions = ['新增', '删除', '重命名', '成员经手', '成员退出']
  const productLabelConfig = {
    config_type: 'product'
  }
  const productOptions = ['新增', '删除', '上调', '下调', '上架', '下架']

  // 加载状态
  const {loading: productLoading, run: runProductSearch} = useLoading()
  const {loading: warehouseLoading, run: runWarehouseSearch} = useLoading()
  // 产品操作记录数据源
  const [queryProductRecordDataSource, setQueryProductRecordDataSource] = useState<ProductActionInfoData[]>([])
  // 仓库操作记录数据源
  const [queryWarehouseRecordDataSource, setQueryWarehouseRecordDataSource] = useState<WarehouseActionInfoData[]>([])
  // 查询事件
  const onSearch = async (values: warehouseConfig | productConfig, config_type: string) => {
    if (config_type === 'warehouse') {
      const res = await runWarehouseSearch(() => {
        return getWarehouseAction(0, 999, values as warehouseConfig)
      })
      setQueryWarehouseRecordDataSource(res?.data?.actionInfo ?? [])
    } else {
      const res = await runProductSearch(() => {
        return getProductAction(0, 999, values as productConfig)
      })
      setQueryProductRecordDataSource(res?.data?.actionInfo ?? [])
    }
  }

  useEffect(() => {
    // 获取产品操作记录表格数据
    const getProductInfo = async () => {
      const res = await getProductAction()
      setQueryProductRecordDataSource(res?.data?.actionInfo ?? [])
    }
    getProductInfo()
    // 获取仓库操作记录表格数据
    const getWarehouseRecord = async () => {
      const res = await getWarehouseAction()
      setQueryWarehouseRecordDataSource(res?.data?.actionInfo ?? [])
    }
    getWarehouseRecord()
  }, [])

  // 选项卡
  const tabItems = [
    {
      label: '产品操作记录',
      key: 'product',
      children: 
      <div>
        <FunctionBar labelConfig={productLabelConfig}
          options={productOptions} onSearch={onSearch} loading={productLoading} />
        <ProductTable queryProductRecordDataSource={queryProductRecordDataSource} />
      </div>
    },
    {
      label: '仓库操作记录',
      key: 'warehouse',
      children: 
      <div>
        <FunctionBar labelConfig={warehouseLabelConfig}
          options={warehouseOptions} onSearch={onSearch} loading={warehouseLoading} />
        <StoreTable queryWarehouseRecordDataSource={queryWarehouseRecordDataSource} />
      </div>
    }
  ]
  return (
    <div>
      <Tabs items={tabItems} className="ActTabs" />
    </div>
  )
}

export default ActTable
