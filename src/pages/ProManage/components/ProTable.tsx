import dayjs from 'dayjs'

import {useState, useEffect, useImperativeHandle} from 'react'

import { Table, Button, Modal, Tag, message, InputNumber, Select } from 'antd'

import '@/pages/ProManage/components/styles/protable.scss'
import { useLoading } from '@/hooks/useLoading'
import { getProductInfo, deleteProduct, adjustProduct } from '@/api/product'

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
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => handleAdjust(record.m_id)}>调整</Button>
            <Button type="link" size="small" onClick={() => handleDelete(record.m_id)}>删除</Button>
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

  // 删除loading状态
  const { loading: deleteLoading, run: deleteRun } = useLoading()
  // 删除点击事件
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteMId, setDeleteMId] = useState(0)
  const handleDelete =  (m_id: number) => {
    setDeleteMId(m_id)
    setIsDeleteModalOpen(true)
  }
  const handleDeleteConfirm = async () => {
    try {
      await deleteRun(() => {
        return deleteProduct({m_id: deleteMId})
      })
      message.success('删除成功')
      setRefresh(!refresh)
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  // 调整数量loading状态
  const { loading: adjustLoading, run: adjustRun } = useLoading()
  // 调整数量点击事件
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [adjustMId, setAdjustMId] = useState(0)
  const [adjustNum, setAdjustNum] = useState<number>()
  const [adjustType, setAdjustType] = useState<number>()
  const handleAdjust =  (m_id: number) => {
    setAdjustMId(m_id)
    setIsAdjustModalOpen(true)
  }
  const handleAdjustConfirm = async () => {
    try {
      const res = await adjustRun(() => {
        return adjustProduct({m_id: adjustMId, action_type: adjustType, product_num: adjustNum})
      })
      if (res.code === 4022) {
        message.error(res.message)
        return
      }
      message.success('调整成功')
      setRefresh(!refresh)
      if (res.data.endNum === 0) {
        // 后期做删除商品逻辑
        console.log('调整数量为0 是否删除商品')
      }
    } finally {
      setAdjustNum(null)
      setAdjustType(null)
      setIsAdjustModalOpen(false)
    }
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
      <Modal
        title="确认删除吗？"
        okText="确认"
        cancelText="取消"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        okButtonProps={{ 
          disabled: deleteLoading
        }}
      />
      <Modal
        className="Protable-adjust-modal"
        title="调整商品数量"
        open={isAdjustModalOpen}
        onCancel={() => setIsAdjustModalOpen(false)}
        footer={null}
      >
        {/* 调整类型选择 */}
        <div className="type-input">
          <span className="label">调整类型:</span>
          <Select placeholder="请选择调整类型"
            options={[
              {
                label: '上调',
                value: 3
              },
              {
                label: '下调',
                value: 4
              }
            ]} 
            value={adjustType} onChange={(val) => setAdjustType(val)} />
        </div>
        {/* 调整数量输入 */}
        <div className="number-input"> 
          <span className="label">调整数量:</span>
          <InputNumber placeholder="请输入调整数量" 
            value={adjustNum} onChange={(val) => setAdjustNum(val)} />
        </div>
        {/* 确认按钮 */}
        <Button type="primary" onClick={handleAdjustConfirm} disabled={adjustLoading}>确认</Button>
      </Modal>
    </div>
  )
}

export default ProTable
