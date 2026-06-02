import {useState, useEffect} from 'react'

import dayjs from 'dayjs'
import { Table, Button, Modal } from 'antd'

import { getWarehouseInfo } from '@/api/warehouse'
const StoTable = () => {
  // 表格列配置
  const columns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id'
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouse_name',
      key: 'warehouse_name'
    },
    {
      title: '仓库类型',
      dataIndex: 'warehouse_type',
      key: 'warehouse_type'
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: '创建时间',
      dataIndex: 'warehouse_create_time',
      key: 'warehouse_create_time'
    },
    {
      title: '仓库描述',
      key: 'warehouse_description',
      width: 100,
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => handleDetail(record.warehouse_description)}>详情</Button>
          </div>
        )
      } 
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
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
  const [dataSource, setDataSource] = useState([])

  // 详情弹窗内容
  const [detailContent, setDetailContent] = useState('')
  // 详情点击事件
  const handleDetail = (item: string) => {
    setDetailContent(item)
    setIsModalOpen(true)
  }
  // 详情弹窗配置
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const getInfo = async () => {
      const res = await getWarehouseInfo()
      // 处理时间格式
      res.data.warehouseInfo.forEach(item => {
        item.warehouse_create_time = dayjs(item.warehouse_create_time).format('YYYY-MM-DD HH:mm:ss')
      })
      setDataSource(res.data.warehouseInfo)
    }
    getInfo()
  }, [])


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(record) => record.m_id} pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: dataSource.length,
        onChange: (page) => {
          setCurrentPage(page)
        }
      }} />
      <Modal
        title="仓库详情弹窗"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <p>{detailContent}</p>
      </Modal>
    </div>
  )
}

export default StoTable
