import {useState, useEffect} from 'react'

import { Table, Button } from 'antd'

const StoTable = () => {
  // 表格列配置
  const columns = [
    {
      title: '仓库编号',
      dataIndex: 'sto_id',
      key: 'sto_id'
    },
    {
      title: '仓库名称',
      dataIndex: 'sto_name',
      key: 'sto_name'
    },
    {
      title: '仓库类型',
      dataIndex: 'sto_type',
      key: 'sto_type'
    },
    {
      title: '创建人',
      dataIndex: 'create_user',
      key: 'create_user'
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time'
    },
    {
      title: '操作',
      key: 'action',
      render: () => {
        return (
          <div>
            <Button type="link" size="small">编辑</Button>
            <Button type="link" size="small">删除</Button>
          </div>
        )
      } 
    }
  ]
  // 表格分页配置
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // 表格数据
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      sto_id: '1001',
      sto_name: '仓库1',
      sto_type: '普通仓库',
      create_user: '张三',
      phone: '13800000000',
      create_time: '2023-01-01 10:00:00'
    },
    {
      key: '2',
      sto_id: '1001',
      sto_name: '仓库1',
      sto_type: '普通仓库',
      create_user: '张三',
      phone: '13800000000',
      create_time: '2023-01-01 10:00:00'
    }
  ])


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: dataSource.length,
        onChange: (page) => {
          setCurrentPage(page)
        }
      }} />;
    </div>
  )
}

export default StoTable
