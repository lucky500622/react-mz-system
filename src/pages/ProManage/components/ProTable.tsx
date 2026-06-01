import {useState, useEffect} from 'react'

import { Table, Button, Modal } from 'antd'

import { getProductInfo } from '@/api/product'
const ProTable = () => {
  // 表格列配置
  const columns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id'
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      key: 'product_name'
    },
    {
      title: '商品类型',
      dataIndex: 'product_type',
      key: 'product_type'
    },
    {
      title: '商品数量',
      dataIndex: 'product_num',
      key: 'product_num'
    },
    {
      title: '商品描述',
      key: 'product_description',
      width: 100,
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => handleDetail(record.product_description)}>详情</Button>
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
      const res = await getProductInfo()
      setDataSource(res.data.productInfo)
    }
    getInfo()
  }, [])


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(record) => record.m_id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: dataSource.length,
          onChange: (page) => {
            setCurrentPage(page)
          }
        }} />
      <Modal
        title="商品详情弹窗"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <p>{detailContent}</p>
      </Modal>
    </div>
  )
}

export default ProTable
