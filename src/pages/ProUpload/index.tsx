import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Table, Input, Button, Form, InputNumber, Select, Tag, Modal, message } from 'antd'
import type { FormProps } from 'antd'

import '@/pages/ProUpload/index.scss'
import { getWarehouseProduct, upDownProduct } from '@/api/product'
import type { WarehouseProductData } from '@/api/product'
import MessageBoard from '@/pages/ProUpload/components/MessageBoard'
import { useLoading } from '@/hooks/useLoading'

const ProUpload = () => {
  // 从路由参数中获取仓库序列号
  const { id } = useParams()
  // 刷新状态
  const [refresh, setRefresh] = useState(false)

  // 表格配置
  const columns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id'
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
      title: '上架数量',
      dataIndex: 'product_list_num',
      key: 'product_list_num'
    },
    {
      title: '可用数量',
      dataIndex: 'product_diff_num',
      key: 'product_diff_num'
    },
    {
      title: '产品描述',
      key: 'product_description',
      width: 100,
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small">详情</Button>
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
            <Button type="link" size="small">售出</Button>
          </div>
        )
      } 
    }
  ]
  // 分页
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // 产品信息
  const [product, setProduct] = useState<WarehouseProductData>({
    warehouse_name: '',
    warehouse_type: '',
    warehouseProduct: []
  })

  // 表单数据类型
  type FieldType = {
    m_id: number
    product_name: string
    product_type: string
  }
  // 查询表单提交
  const onQueryFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }
  const onQueryFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // 调整产品数量弹窗
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  // 调整产品序列号
  const [adjustMId, setAdjustMId] = useState<number>(0)
  const handleAdjust = (m_id: number) => {
    setAdjustMId(m_id)
    setAdjustModalOpen(true)
  }
  // 调整表单类型
  type AdjustFieldType = {
    action_type: number
    product_num: number
  }
  // 加载状态
  const {loading: adjustLoading, run: adjustRun} = useLoading()
  // 调整表单实例
  const [adjustForm] = Form.useForm()
  // 调整表单提交
  const onAdjustFinish: FormProps<AdjustFieldType>['onFinish'] = async (values) => {
    try {
      const res = await adjustRun(() => upDownProduct({
        m_id: adjustMId,
        action_type: values.action_type,
        product_num: values.product_num,
        action_all: false
      }, Number(id)))

      if (res.code === 4024) {
        message.error(res.message)
        return
      }
      message.success('调整成功')
      setRefresh(!refresh)
    } finally {
      setAdjustMId(undefined)
      adjustForm.resetFields()
      setAdjustModalOpen(false)
    }
  }
  const onAdjustFinishFailed: FormProps<AdjustFieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  // 全部上架按钮点击事件
  const handleAllUpload = async () => {
    try {
      const res = await adjustRun(() => upDownProduct({
        m_id: adjustMId,
        action_type: 5,
        action_all: true
      }, Number(id)))

      if (res.code === 4024) {
        message.error(res.message)
        return
      }
      message.success('调整成功')
      setRefresh(!refresh)
    } finally {
      setAdjustMId(undefined)
      adjustForm.resetFields()
      setAdjustModalOpen(false)
    }
  }
  // 全部下架按钮点击事件
  const handleAllDown = async () => {
    try {
      const res = await adjustRun(() => upDownProduct({
        m_id: adjustMId,
        action_type: 6,
        action_all: true
      }, Number(id)))

      if (res.code === 4024) {
        message.error(res.message)
        return
      }
      message.success('调整成功')
      setRefresh(!refresh)
    } finally {
      setAdjustMId(undefined)
      adjustForm.resetFields()
      setAdjustModalOpen(false)
    }
  }

  useEffect(() => {
    const getInfo = async () => {
      const res = await getWarehouseProduct(Number(id))
      // 如果仓库中没有产品，直接返回
      if (res.data.warehouseProduct.length === 1 && !res.data.warehouseProduct[0].m_id) {
        setProduct({
          ...res.data,
          warehouseProduct: []
        })
        return
      }
      setProduct(res.data)
    }
    getInfo()
  }, [id, refresh])

  return (
    <div className="ProUpload">
      <div className="ProUpload-title">
        <h1>产品上架</h1>

        <div className="warehouse-info">
          <div>仓库序列号：{id}</div>
          <div>仓库名：{product.warehouse_name || '无'}</div>
        </div>
      </div>

      <div className="main">
        <div className="left">
          <MessageBoard id={Number(id)} />
        </div>

        <div className="right">
          <div className="query-bar">
            <Form 
              layout="inline"
              onFinish={onQueryFinish}
              onFinishFailed={onQueryFinishFailed}
              autoComplete="off">
              <Form.Item name="m_id" label="产品序列号" rules={[{ pattern: /^\d+$/, min: 1, message: '请输入有效的产品序列号' }]}>
                <InputNumber min={1} placeholder="请输入产品序列号" />
              </Form.Item>

              <Form.Item name="product_name" label="产品名称"
                rules={[{pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '产品名称只能包含汉字、字母和数字'}]}>
                <Input placeholder="请输入产品名称" />
              </Form.Item>
            
              <Form.Item label="产品类型" name="product_type" 
                rules={[{ pattern: /^[\u4e00-\u9fa5]+$/, message: '产品类型只能包含汉字'}]}>
                <Select placeholder="请选择产品类型" className="type-select"
                  options={[
                    { value: '食品生鲜', label: '食品生鲜' },
                    { value: '日用百货', label: '日用百货' },
                    { value: '家电数码', label: '家电数码' },
                    { value: '服饰鞋帽', label: '服饰鞋帽' },
                    { value: '母婴用品', label: '母婴用品' },
                    { value: '美妆护肤', label: '美妆护肤' },
                    { value: '家居家纺', label: '家居家纺' },
                    { value: '文体玩具', label: '文体玩具' },
                    { value: '医疗器械', label: '医疗器械' },
                    { value: '其他产品', label: '其他产品' }
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Button type="default" htmlType="submit">查询</Button>
                <Button type="default" htmlType="reset">重置</Button>
              </Form.Item>
            </Form>
          </div>
      
          <Table dataSource={product.warehouseProduct} columns={columns} rowKey={(record) => record.m_id}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: product.warehouseProduct.length,
              onChange: (page) => {
                setCurrentPage(page)
              }
            }} />
          <Modal
            title="调整产品数量"
            open={adjustModalOpen}
            onCancel={() => setAdjustModalOpen(false)}
            footer={null}
            className='ProUpload-adjust-modal'
          >
            <Form
              form={adjustForm}
              onFinish={onAdjustFinish}
              onFinishFailed={onAdjustFinishFailed}
              autoComplete="off"
              className="adjust-form"
              disabled={adjustLoading}>
              <Form.Item label="操作类型" name="action_type" >
                <Select placeholder="请选择操作类型" className="type-select"
                  options={[
                    {value: 5, label: '上架'},
                    {value: 6, label: '下架'}
                  ]}
                />
              </Form.Item>

              <Form.Item name="product_num" label="操作数量" 
                rules={[{ pattern: /^\d+$/, min: 1, message: '请输入有效的操作数量' }]}>
                <InputNumber min={1} placeholder="请输入操作数量" />
              </Form.Item>
              <Form.Item label={null} >
                <Button onClick={handleAllUpload}>全部上架</Button>
                <Button onClick={handleAllDown}>全部下架</Button>
                <Button type="primary" htmlType="submit" className="confirm-btn">确认</Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default ProUpload
