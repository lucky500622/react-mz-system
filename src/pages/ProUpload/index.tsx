import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Table, Input, Button, Form, InputNumber, Select } from 'antd'
import type { FormProps } from 'antd'

import '@/pages/ProUpload/index.scss'
import { getWarehouseProduct } from '@/api/product'
import type { WarehouseProductData } from '@/api/product'

const ProUpload = () => {
  // 从路由参数中获取仓库序列号
  const { id } = useParams()

  // 表格配置
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'p_name',
      key: 'p_name'
    },
    {
      title: '产品类型',
      dataIndex: 'p_type',
      key: 'p_type'
    },
    {
      title: '产品库存',
      dataIndex: 'p_stock',
      key: 'p_stock'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation'
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
  // 表单提交
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
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
  }, [id])

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
        <div className="query-bar">
          <Form 
            layout="inline"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Form.Item name="p_stock" label="产品序列号" rules={[{ pattern: /^\d+$/, min: 1, message: '请输入有效的产品序列号' }]}>
              <InputNumber min={1} placeholder="请输入产品序列号" />
            </Form.Item>

            <Form.Item name="p_name" label="产品名称"
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
      </div>
    </div>
  )
}

export default ProUpload
