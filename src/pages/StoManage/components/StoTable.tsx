import {useState, useEffect, useImperativeHandle} from 'react'

import dayjs from 'dayjs'
import { Table, Button, Modal, Tag } from 'antd'

export type StoTableRef = {
  refreshData: () => void
}
import { getWarehouseInfo } from '@/api/warehouse'
const StoTable = ({ref}: {ref: React.Ref<StoTableRef>}) => {
  // 表格列配置
  const columns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id',
      width: 100
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouse_name',
      key: 'warehouse_name'
    },
    {
      title: '仓库类型',
      dataIndex: 'warehouse_type',
      key: 'warehouse_type',
      render: (_, record) => {
        return (
          <Tag color={'blue'}>{record.warehouse_type}</Tag>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: '创建时间',
      dataIndex: 'warehouse_create_time',
      key: 'warehouse_create_time',
      render: (val) => {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
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

  // 刷新表格状态
  const [refresh, setRefresh] = useState(false)
  // 向外暴露刷新表格数据方法
  useImperativeHandle(ref, () => ({
    refreshData: () => {
      setRefresh(!refresh)
    }
  }))
  
  useEffect(() => {
    const getInfo = async () => {
      const res = await getWarehouseInfo()
      setDataSource(res.data.warehouseInfo)
    }
    getInfo()
  }, [refresh])


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
        title="仓库描述"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <p>{detailContent || '暂无仓库描述'}</p>
      </Modal>
    </div>
  )
}

export default StoTable
