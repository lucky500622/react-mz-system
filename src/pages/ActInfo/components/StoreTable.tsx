import dayjs from 'dayjs'

import { useState, useEffect } from 'react'

import { Table, Tag } from 'antd'

import { getWarehouseAction } from '@/api/warehouse'

// 仓库记录表格配置项
const warehouseColumns = [
  {
    title: '序列号',
    dataIndex: 'm_id',
    key: 'm_id'
  },
  {
    title: '仓库序列号',
    dataIndex: 'warehouse_m_id',
    key: 'warehouse_m_id'
  },
  {
    title: '操作仓库',
    dataIndex: 'warehouse_name',
    key: 'warehouse_name'
  },
  {
    title: '操作人',
    dataIndex: 'user_name',
    key: 'user_name'
  },
  {
    title: '操作类型',
    dataIndex: 'action_type',
    key: 'action_type',
    render: (val) => {
      const map = {
        1: '创建',
        2: '删除',
        3: '重命名'
      }
      return <Tag color={val === 1 ? 'green' : val === 2 ? 'red' : 'blue'}>{map[val] || val}</Tag>
    }
  },
  {
    title: '操作时间',
    dataIndex: 'issue_create_time',
    key: 'issue_create_time',
    render: (val) => {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]

const StoreTable = () => {
  // 仓库操作记录表格数据
  const [warehouseDataSource, setWarehouseDataSource] = useState([])
  // 当前页
  const [currentPage, setCurrentPage] = useState(1)
  // 每页显示数量
  const pageSize = 8
  
  useEffect(() => {
    // 获取仓库操作记录表格数据
    const getWarehouseRecord = async () => {
      const res = await getWarehouseAction()
      setWarehouseDataSource(res.data.actionInfo)
    }
    getWarehouseRecord()
  }, [])

  return (
    <div>
      <Table dataSource={warehouseDataSource} columns={warehouseColumns} rowKey={(record) => record.m_id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: warehouseDataSource.length,
          onChange: (page) => {
            setCurrentPage(page)
          }
        }} />
    </div>
  )
}

export default StoreTable
