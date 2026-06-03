import dayjs from 'dayjs'

import {useState, useEffect, useImperativeHandle} from 'react'

import { Table, Button, Modal, Tag } from 'antd'

import { getProductInfo } from '@/api/product'

// 产品表格引用类型
export type ProTableRef = {
  handleRefresh: () => void
}
const ProTable = ({ref} : {ref: React.Ref<ProTableRef>}) => {
  // 表格列配置
  const columns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id',
      width: 100
    },
    {
      title: '所属仓库序列号',
      dataIndex: 'warehouse_m_id',
      key: 'warehouse_m_id',
      width: 150
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name'
    },
    {
      title: '产品类型',
      dataIndex: 'product_type',
      key: 'product_type',
      render: (_, record) => {
        return (
          <Tag color="blue">{record.product_type}</Tag>
        )
      }
    },
    {
      title: '产品数量',
      dataIndex: 'product_num',
      key: 'product_num'
    },
    {
      title: '创建时间',
      dataIndex: 'product_create_time',
      key: 'product_create_time',
      render: (val) => {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '产品描述',
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

  // 刷新表格状态
  const [refresh, setRefresh] = useState(false)
  // 向外暴露刷新方法
  useImperativeHandle(ref, () => ({
    handleRefresh: () => {
      setRefresh(!refresh)
    }
  }))

  useEffect(() => {
    const getInfo = async () => {
      const res = await getProductInfo()
      setDataSource(res.data.productInfo)
    }
    getInfo()
  }, [refresh])


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
        title="商品描述"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <p>{detailContent || '暂无商品描述'}</p>
      </Modal>
    </div>
  )
}

export default ProTable
