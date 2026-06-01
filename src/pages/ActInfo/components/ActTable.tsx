import { useState, useEffect } from 'react'

import { Tabs, Table } from 'antd'

import {getWarehouseAction, getProductAction} from '@/api/action'

// 仓库记录表格配置项
const warehouseColumns = [
  {
    title: '序列号',
    dataIndex: 'm_id',
    key: 'm_id'
  },
  {
    title: '操作对象',
    dataIndex: 'issue_object',
    key: 'issue_object'
  },
  {
    title: '仓库名称',
    dataIndex: 'warehouse_name',
    key: 'warehouse_name'
  },
  {
    title: '操作人',
    dataIndex: 'creater',
    key: 'creater'
  },
  {
    title: '操作类型',
    dataIndex: 'action_type',
    key: 'action_type'
  },
  {
    title: '仓库新名',
    dataIndex: 'warehouse_rename',
    key: 'warehouse_rename'
  },
  {
    title: '操作时间',
    dataIndex: 'issue_create_time',
    key: 'issue_create_time'
  }
]
// 商品记录表格配置项
const productColumns = [
  {
    title: '序列号',
    dataIndex: 'm_id',
    key: 'm_id'
  },
  {
    title: '操作对象',
    dataIndex: 'issue_object',
    key: 'issue_object'
  },
  {
    title: '产品名称',
    dataIndex: 'product_name',
    key: 'product_name'
  },  
  {
    title: '操作人',
    dataIndex: 'creater',
    key: 'creater'
  },
  {
    title: '操作类型',
    dataIndex: 'action_type',
    key: 'action_type'
  },
  {
    title: '操作数量',
    dataIndex: 'action_num',
    key: 'action_num'
  },
  {
    title: '操作时间',
    dataIndex: 'issue_create_time',
    key: 'issue_create_time'
  }
]
const ActTable = () => {
  // 仓库操作记录表格数据
  const [warehouseDataSource, setWarehouseDataSource] = useState([])
  // 商品操作记录表格数据
  const [productRecordDataSource, setProductRecordDataSource] = useState([])

  // 当前页
  const [currentPage, setCurrentPage] = useState(1)
  // 每页显示数量
  const pageSize = 8
  // 选项卡
  const tabItems = [
    {
      label: '仓库操作记录',
      key: 'warehouse',
      children: 
      <Table dataSource={warehouseDataSource} columns={warehouseColumns} rowKey={(record) => record.m_id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: warehouseDataSource.length,
          onChange: (page) => {
            setCurrentPage(page)
          }
        }} />
    },
    {
      label: '商品操作记录',
      key: 'product',
      children: 
      <Table dataSource={productRecordDataSource} columns={productColumns} rowKey={(record) => record.m_id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: productRecordDataSource.length,
          onChange: (page) => {
            setCurrentPage(page)
          }
        }} />
    }
  ]
  // 选项卡切换事件
  const handleTabChange = (key: string) => {
    console.log(key)
  }

  useEffect(() => {
    // 获取仓库、产品操作记录表格数据
    const getWarehouseRecord = async () => {
      const res = await getWarehouseAction()
      setWarehouseDataSource(res.data.actionInfo)
    }
    const getProductRecord = async () => {
      const res = await getProductAction()
      setProductRecordDataSource(res.data.actionInfo)
    }
    getWarehouseRecord()
    getProductRecord()
  }, [])
  return (
    <div>
      <Tabs items={tabItems} onChange={handleTabChange}/>
    </div>
  )
}

export default ActTable
