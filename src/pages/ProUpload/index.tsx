import { useParams } from 'react-router-dom'
import { useEffect, useState ,useRef} from 'react'

import { Table, Button, Form, InputNumber, Select, Tag, Modal, message } from 'antd'
import type { FormProps } from 'antd'

import '@/pages/ProUpload/index.scss'
import { getWarehouseProduct, upDownProduct, saleProduct, getProductName } from '@/api/product'
import { exitHandleWarehouse } from '@/api/warehouse'
import type { WarehouseProductData } from '@/api/product'
import MessageBoard from '@/pages/ProUpload/components/MessageBoard'
import { useLoading } from '@/hooks/useLoading'
import SelectNameAssociation from '@/components/SelectNameAssociation'

const ProUpload = () => {
  // 从路由参数中获取仓库序列号
  const params = useParams()
  const id = params.id ? Number(params.id) : 0
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
      render: (product_type: string) => {
        return (
          <Tag color="blue">{product_type}</Tag>
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
      render: ({m_id}: {m_id: number}) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => handleDetailClick(m_id)}>详情</Button>
          </div>
        )
      } 
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: ({m_id}: {m_id: number}) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => handleAdjust(m_id)}>调整</Button>
            <Button type="link" size="small" onClick={() => handleSale(m_id)}>售出</Button>
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
  // 加载状态
  const {loading: queryLoading, run: queryRun} = useLoading()
  // 查询表单提交
  const onQueryFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await queryRun(() => getWarehouseProduct(Number(id), 
      values.m_id,
      values.product_name,
      values.product_type
    ))
    setProduct(res.data ?? {
      warehouse_name: '',
      warehouse_type: '',
      warehouseProduct: []
    })
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
      setAdjustMId(0)
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
      setAdjustMId(0)
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
      setAdjustMId(0)
      adjustForm.resetFields()
      setAdjustModalOpen(false)
    }
  }

  // 产品描述弹窗
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  // 产品描述弹窗内容
  const [detailContent, setDetailContent] = useState('')
  const handleDetailClick = (m_id: number) => {
    setDetailModalOpen(true)
    setDetailContent(product.warehouseProduct.find(item => item.m_id === m_id)?.product_description ?? '')
  }

  // 售出产品弹窗
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  // 售出产品数量
  const [saleNum, setSaleNum] = useState<number>(1)
  // 售出产品弹窗加载状态
  const {loading: saleLoading, run: saleRun} = useLoading()
  // 售出产品序列号
  const [saleMId, setSaleMId] = useState<number>(0)
  const handleSale = (m_id: number) => {
    setSaleMId(m_id)
    setSaleModalOpen(true)
  }
  // 售出产品弹窗提交事件
  const handleSaleSubmit = async () => {
    try {
      const res = await saleRun(() => saleProduct({
        m_id: saleMId,
        product_num: saleNum
      }, Number(id)))
      if (res.code === 4024) {
        message.error(res.message)
        return
      }
      message.success('售出成功')
      setRefresh(!refresh)
    } finally {
      setSaleMId(0)
      setSaleNum(1)
      setSaleModalOpen(false)
    }
  }

  // 退出仓库弹窗加载状态
  const {loading: exitLoading, run: exitRun} = useLoading()
  // 退出仓库弹窗
  const [exitModalOpen, setExitModalOpen] = useState(false)
  // 退出仓库按钮点击事件
  const handleExit = async () => {
    setExitModalOpen(true)
  }
  // 退出仓库弹窗定时器
  const timer = useRef<number | undefined>(undefined)
  // 退出仓库弹窗提交事件
  const handleExitSubmit = async () => {
    await exitRun(() => exitHandleWarehouse(Number(id)))
    setExitModalOpen(false)
    message.success('退出仓库成功')
    // 发送消息到其他窗口
    const channel = new BroadcastChannel('channel-pro-upload')
    channel.postMessage('exit-success')
    channel.close()
    // 退出仓库成功后，定时器过期
    timer.current = setTimeout(() => {
      window.location.href = '/sto-handle'
    }, 1000)
  }

  useEffect(() => {
    const getInfo = async () => {
      const res = await getWarehouseProduct(Number(id))
      // 如果仓库中没有产品，直接返回
      if (res?.data?.warehouseProduct.length === 1 && !res?.data?.warehouseProduct[0]?.m_id) {
        setProduct({
          ...res.data,
          warehouse_name: res?.data?.warehouse_name ?? '',
          warehouse_type: res?.data?.warehouse_type ?? '',
          warehouseProduct: []
        })
        return
      }
      setProduct(res.data as WarehouseProductData)
    }
    getInfo()
  }, [id, refresh])

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className="ProUpload">
      <div className="ProUpload-title">
        <h1>产品上架</h1>

        <div className="warehouse-info">
          <Button type="default" onClick={handleExit}>退出仓库</Button>
          <div>仓库序列号：{id}</div>
          <div>仓库名：{product.warehouse_name || '无'}</div>
        </div>
      </div>

      <div className="main">
        <div className="left">
          <MessageBoard id={id} />
        </div>

        <div className="right">
          <div className="query-bar">
            <Form 
              layout="inline"
              onFinish={onQueryFinish}
              onFinishFailed={onQueryFinishFailed}
              autoComplete="off"
              disabled={queryLoading}>
              <Form.Item<FieldType> 
                name="m_id" label="产品序列号" rules={[{ pattern: /^\d+$/, min: 1, message: '请输入有效的产品序列号' }]}>
                <InputNumber min={1} placeholder="请输入产品序列号" />
              </Form.Item>

              <Form.Item<FieldType> 
                name="product_name" label="产品名称"
                rules={[{pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '产品名称只能包含汉字、字母和数字'}]}>
                <SelectNameAssociation
                  placeholder="请选择产品名称"
                  SelectFn={getProductName}
                />
              </Form.Item>
            
              <Form.Item<FieldType> 
                name="product_type" label="产品类型" 
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
              <Form.Item label="操作类型" name="action_type" 
                rules={[{ required: true, message: '请选择操作类型' }]}>
                <Select placeholder="请选择操作类型" className="type-select"
                  options={[
                    {value: 5, label: '上架'},
                    {value: 6, label: '下架'}
                  ]}
                />
              </Form.Item>

              <Form.Item name="product_num" label="操作数量" 
                rules={[{ required: true, pattern: /^\d+$/, min: 1, message: '请输入有效的操作数量' }]}>
                <InputNumber min={1} placeholder="请输入操作数量" />
              </Form.Item>
              <Form.Item label={null} >
                <Button onClick={handleAllUpload}>全部上架</Button>
                <Button onClick={handleAllDown}>全部下架</Button>
                <Button type="primary" htmlType="submit" className="confirm-btn">确认</Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="产品描述"
            open={detailModalOpen}
            onCancel={() => setDetailModalOpen(false)}
            footer={null}
            className="ProUpload-detail-modal"
          >
            <p>{detailContent || '暂无产品描述'}</p>
          </Modal>
          <Modal
            title="售出产品"
            open={saleModalOpen}
            onCancel={() => setSaleModalOpen(false)}
            onOk={handleSaleSubmit}
            className="ProUpload-sale-modal"
            okText="确认"
            cancelText="取消"
            okButtonProps={{
              disabled: saleLoading
            }}
          >
            <span>售出数量：</span>
            <InputNumber value={saleNum} onChange={(v) => setSaleNum(v ?? 0)}
              required min={1} placeholder="请输入售出数量" />
          </Modal>
          <Modal
            title="退出仓库"
            open={exitModalOpen}
            onCancel={() => setExitModalOpen(false)}
            onOk={handleExitSubmit}
            className="ProUpload-exit-modal"
            okText="确认"
            cancelText="取消"
            okButtonProps={{
              disabled: exitLoading
            }}
          >
            <p>**注：确认退出仓库吗？这将下架所有仓库中的产品，以及仓库中与你相关的待办事项!**</p>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default ProUpload
