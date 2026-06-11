import { useEffect, useState } from 'react'

import { Table } from 'antd'

import '@/pages/Home/index.scss'
import { getWarehouseOverview, getWarehouseInfo } from '@/api/warehouse'
import type { WarehouseOverviewData } from '@/api/warehouse'
import { getProductOverview, getProductDayAction } from '@/api/product'
import type { ProductOverviewData } from '@/api/product'
import MyEChartsPie from '@/components/MyEChartsPie'
import MyEChartsLine from '@/components/MyEChartsLine'

const warehouseColumns = [
  {
    title: '仓库总数',
    dataIndex: 'count',
    key: 'count'
  },  
  {
    title: '经手仓库总数',
    dataIndex: 'handle_count',
    key: 'handle_count'
  }
] 
const productColumns = [
  {
    title: '产品品类总数',
    dataIndex: 'count',
    key: 'count'
  },
  {  
    title: '产品总数',
    dataIndex: 'total_product_num',
    key: 'total_product_num'
  },
  {  
    title: '产品上架总数',
    dataIndex: 'listed_product_num',
    key: 'listed_product_num'
  }
]

const Home = () => {
  // 仓库信息
  const [warehouseInfo, setWarehouseInfo] = useState<WarehouseOverviewData[]>([])
  // 产品信息
  const [productInfo, setProductInfo] = useState<ProductOverviewData[]>([])
  // 各个仓库产品数量数组
  const [warehouseProductNum, setWarehouseProductNum] = useState<{value: number, name: string}[]>([])
  // 近7日新增产品操作统计
  const [addProductAction, setAddProductAction] = useState<number[]>([])
  // 近7日减少产品操作统计
  const [subProductAction, setSubProductAction] = useState<number[]>([])
  // 近7日售出产品操作统计
  const [sellProductAction, setSellProductAction] = useState<number[]>([])

  useEffect(() => {
    const getInfo = async () => {
      // 获取概览信息
      const warehouseOverview = await getWarehouseOverview()
      const productOverview = await getProductOverview()
      setWarehouseInfo([warehouseOverview.data])
      setProductInfo([productOverview.data])

      // 获取仓库产品数量
      const warehouseInfo = await getWarehouseInfo()
      const warehouseProductNum = warehouseInfo.data.warehouseInfo.map(item => {
        return {value: Number(item.total_product_num) || 0, name: item.warehouse_name}
      })
      setWarehouseProductNum(warehouseProductNum)

      // 获取产品操作统计
      const productDayAction = await getProductDayAction()
      const addArr = productDayAction.data.productDayActionInfo.in_arr.split(',').map(item => Number(item) || 0)
      setAddProductAction(addArr)
      const subArr = productDayAction.data.productDayActionInfo.out_arr.split(',').map(item => Number(item) || 0)
      setSubProductAction(subArr)
      const sellArr = productDayAction.data.productDayActionInfo.sale_arr.split(',').map(item => Number(item) || 0)
      setSellProductAction(sellArr)
    } 
    getInfo()
  }, [])

  return (
    <div>
      <div className="Home-top-bar">
        <h2>首页</h2>
      </div>
      <div className="Home-table">
        <Table className="warehouse-table-item"
          rowKey={(record) => record.count}
          columns={warehouseColumns} dataSource={warehouseInfo} pagination={false} />
        <Table className="product-table-item" 
          rowKey={(record) => record.count}
          columns={productColumns} dataSource={productInfo} pagination={false} />
      </div>
      <div className="Home-main">
        <div className="left">
          <MyEChartsPie className="warehouse-chart"
            style={{ width: '100%', height: '360px'}}
            title={{text: '各仓库库存数量' }}
            data={warehouseProductNum} radius="60%" />
        </div>
        <div className="right">
          <MyEChartsLine className="product-chart"
            style={{ width: '100%', height: '310px' }}
            title={{text: '近7日出入库操作统计'}} 
            dataOne={addProductAction} dataTwo={subProductAction} dataThree={sellProductAction} />
        </div>
      </div>
    </div>
  )
}

export default Home
