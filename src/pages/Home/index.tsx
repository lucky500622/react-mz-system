import { useEffect, useState } from 'react'

import { Table, Card } from 'antd'

import '@/pages/Home/index.scss'
import { getWarehouseOverview, getWarehouseInfo } from '@/api/warehouse'
import type { WarehouseOverviewData } from '@/api/warehouse'
import { getProductOverview, getProductDayAction, getProductWarning } from '@/api/product'
import type { ProductOverviewData, ProductWarning } from '@/api/product'
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
  // 产品警告
  const [productWarning, setProductWarning] = useState<ProductWarning[]>([])

  useEffect(() => {
    const getInfo = async () => {
      // 获取概览信息
      const warehouseOverview = await getWarehouseOverview()
      const productOverview = await getProductOverview()
      setWarehouseInfo([warehouseOverview?.data ?? {} as WarehouseOverviewData])
      setProductInfo([productOverview?.data ?? {} as ProductOverviewData])

      // 获取仓库产品数量
      const warehouseInfo = await getWarehouseInfo()
      const warehouseProductNum = warehouseInfo?.data?.warehouseInfo?.map(item => {
        return {value: Number(item.total_product_num) || 0, name: item.warehouse_name}
      }) || []
      setWarehouseProductNum(warehouseProductNum)

      // 获取产品操作统计
      const productDayAction = await getProductDayAction()
      const addArr = productDayAction?.data?.productDayActionInfo?.in_arr.split(',')
        .map(item => Number(item) || 0) || []
      setAddProductAction(addArr)
      const subArr = productDayAction?.data?.productDayActionInfo?.out_arr.split(',')
        .map(item => Number(item) || 0) || []
      setSubProductAction(subArr)
      const sellArr = productDayAction?.data?.productDayActionInfo?.sale_arr.split(',')
        .map(item => Number(item) || 0) || []
      setSellProductAction(sellArr)

      // 获取产品警告
      const productWarning = await getProductWarning()
      setProductWarning(productWarning?.data?.warning ?? [])
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
      <div className="Home-warning">
        <div className="warning-tip">Tip：产品上架后，余量不足100时，触发余量不足警告</div>
        {productWarning.length > 0 ?
          productWarning.map(item => (
            <Card key={item.product_m_id}>
              <p>仓库名称: {item.warehouse_name}</p>
              -
              <p>产品名称: {item.product_name}</p>
              -
              <p>产品序列号: {item.product_m_id}</p>
              -
              <p>已上架数量: {item.product_list_num}</p>
              -
              <p>未上架余量: {item.product_diff_num}</p>
              -
              <p className="warning">警告：余量不足100</p>
            </Card>
          )) :
          <Card >
            <p className="no-warning">暂无警告</p>
          </Card>}
      </div>
    </div>
  )
}

export default Home
