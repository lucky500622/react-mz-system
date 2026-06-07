import dayjs from 'dayjs'

import { useState, memo } from 'react'

import { Table, Tag } from 'antd'

import type { ProductActionInfoData } from '@/api/product'

const ProductTable = memo(( { queryProductRecordDataSource }: 
  { queryProductRecordDataSource: ProductActionInfoData[] } ) => {
  // 产品记录表格配置项
  const productColumns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id'
    },
    {
      title: '产品序列号',
      dataIndex: 'product_m_id',
      key: 'product_m_id'
    },
    {
      title: '操作产品',
      dataIndex: 'product_name',
      key: 'product_name'
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
          1: '新增',
          2: '删除',
          3: '上调',
          4: '下调',
          5: '上架',
          6: '下架',
          7: '售出'
        }
        return ( 
          <Tag color={val === 1 ? 'green' : val === 2 ? 'red' : 'blue'}>
            {map[val] || val}
          </Tag>
        )
      }
    },
    {
      title: '操作数量',
      dataIndex: 'action_num',
      key: 'action_num'
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
  // 当前页
  const [currentPage, setCurrentPage] = useState(1)
  // 每页显示数量
  const pageSize = 8

  return (
    <div>
      <Table dataSource={queryProductRecordDataSource} columns={productColumns} rowKey={(record) => record.m_id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: queryProductRecordDataSource.length,
          onChange: (page) => {
            setCurrentPage(page)
          }
        }} />
    </div>
  )
})

export default ProductTable
