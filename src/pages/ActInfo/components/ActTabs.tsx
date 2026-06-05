import { Tabs } from 'antd'

import WarehouseTable from '@/pages/ActInfo/components/WareHouseTable'
import ProductTable from '@/pages/ActInfo/components/ProductTable'
import FunctionBar from '@/pages/ActInfo/components/FunctionBar'

const ActTable = () => {
  // FunctionBar配置
  const warehouseConfig = {
    issue_m_id: '序列号',
    m_id: '仓库序列号',
    name: '仓库名称',
    operator: '操作人',
    type: '操作类型'
  }
  const productConfig = {
    issue_m_id: '序列号',
    m_id: '产品序列号',
    name: '产品名称',
    operator: '操作人',
    type: '操作类型'
  }

  // 选项卡
  const tabItems = [
    {
      label: '产品操作记录',
      key: 'product',
      children: 
      <div>
        <FunctionBar config={productConfig} />
        <ProductTable />
      </div>
    },
    {
      label: '仓库操作记录',
      key: 'warehouse',
      children: 
      <div>
        <FunctionBar config={warehouseConfig} />
        <WarehouseTable />
      </div>
    }
  ]
  return (
    <div>
      <Tabs items={tabItems}/>
    </div>
  )
}

export default ActTable
