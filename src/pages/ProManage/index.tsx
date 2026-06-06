import {useState, useCallback, useRef} from 'react'

import { Button, Input, InputNumber, Select, Form } from 'antd'
import type { FormProps } from 'antd/es/form'

import '@/pages/ProManage/index.scss'
import ProTable from '@/pages/ProManage/components/ProTable'
import AddProductModal from '@/pages/ProManage/components/AddProductModal'
import type { AddProductModalRef } from '@/pages/ProManage/components/AddProductModal'
import type { ProTableRef } from '@/pages/ProManage/components/ProTable'
import { useLoading } from '@/hooks/useLoading'
import { getProductInfo } from '@/api/product'
import type { ProductInfoData } from '@/api/product'

const ProManage = () => {
  const {loading, run} = useLoading()
  // 新增产品表单字段类型
  type FieldType = {
    m_id?: number;
    warehouse_m_id?: number;
    product_name?: string;
    product_type?: string;
  }
  const [form] = Form.useForm()
  const [querySource, setQuerySource] = useState<ProductInfoData[]>()
  // 新增产品表单提交
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await run(() => getProductInfo(0, 999, values))
    setQuerySource(res.data.productInfo)
  }
  // 新增产品表单提交失败
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // 产品弹窗状态
  const [visible, setVisible] = useState(false)
  // 新增产品
  const handleAdd = () => {
    setVisible(true)
  }
  // 新增产品弹窗关闭
  const handleClose = useCallback(() => {
    setVisible(false)
    addModalRef.current?.resetFields()
  }, [setVisible])

  // 新增产品弹窗引用
  const addModalRef = useRef<AddProductModalRef>(null)
  // 产品表格引用
  const tableRef = useRef<ProTableRef>(null)
  // 刷新表格数据
  const handleRefresh = useCallback(() => {
    tableRef.current?.handleRefresh()
  }, [tableRef])
  return (
    <div>
      <div className="ProManage-top-bar">
        <h2>产品管理</h2>
      </div>
      <div className="ProManage-function-bar">
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="inline"
          disabled={loading}>
          <Form.Item label="产品序列号" name="m_id"
            rules={[{ type: 'number', min: 1, message: '请输入有效的产品序列号' }]}>
            <InputNumber placeholder="请输入产品序列号"/>
          </Form.Item>
          <Form.Item label="所属仓库序列号" name="warehouse_m_id"
            rules={[{ type: 'number', min: 1, message: '请输入所属仓库序列号' }]}>
            <InputNumber placeholder="请输入所属仓库序列号"/>
          </Form.Item>
          <Form.Item label="产品名称" name="product_name" 
            rules={[{pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '产品名称只能包含汉字、字母和数字'}]}>
            <Input placeholder="请输入产品名称" className="word-input" />
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
          <Form.Item label={null}>
            <Button type="default" htmlType="submit" className="search-btn">查询</Button>
            <Button type="default" onClick={() => form.resetFields()} className="reset-btn">重置</Button>
          </Form.Item>
        </Form>
        <div className="add-btn">
          <Button type="default" onClick={handleAdd}>新增产品</Button>
        </div>
      </div>
      <ProTable ref={tableRef} querySource={querySource} />
      <AddProductModal ref={addModalRef} visible={visible} handleClose={handleClose} handleRefresh={handleRefresh} />
    </div>
  )
}

export default ProManage
