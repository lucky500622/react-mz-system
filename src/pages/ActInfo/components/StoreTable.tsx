import dayjs from 'dayjs'

import { useState, memo } from 'react'

import { Table, Tag } from 'antd'

import type { WarehouseActionInfoData } from '@/api/warehouse'
const StoreTable = memo(({queryWarehouseRecordDataSource} : 
  {queryWarehouseRecordDataSource: WarehouseActionInfoData[]}) => {
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
      render: (val: 1 | 2 | 3 | 4 | 5) => {
        const map = {
          1: '创建',
          2: '删除',
          3: '重命名',
          4: '成员经手',
          5: '成员退出'
        }
        return <Tag color={val === 1 ? 'green' : val === 2 ? 'red' 
          : val === 4 || val === 5 ? 'orange' : 'blue'}>
          {map[val] || val}
        </Tag>
      }
    },
    {
      title: '操作时间',
      dataIndex: 'issue_create_time',
      key: 'issue_create_time',
      render: (val: string) => {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ]
  // 当前页
  const [currentPage, setCurrentPage] = useState(1)
  // 每页显示数量
  const pageSize = 8

  return (
    <div>
      <Table dataSource={queryWarehouseRecordDataSource} columns={warehouseColumns} rowKey={(record) => record.m_id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: queryWarehouseRecordDataSource.length,
          onChange: (page) => {
            setCurrentPage(page)
          }
        }} />
    </div>
  )
})

export default StoreTable
