import { memo, useImperativeHandle, useEffect, useRef } from 'react'

import type { FormProps } from 'antd'
import { Input, Modal, Form, Button, InputNumber, Select, message } from 'antd'

import '@/pages/ProManage/components/styles/addProductModel.scss'
import { useThrottleFn } from '@/hooks/useThrottle'
import { addProduct } from '@/api/product'
import type { AddProductData } from '@/api/product'

// 新增产品弹窗引用类型
export type AddProductModalRef = {
  resetFields: () => void
}
// 新增产品弹窗接收的属性
type AddProductModalProps = {
  visible: boolean,
  handleClose: () => void,
  handleRefresh: () => void,
  ref: React.Ref<AddProductModalRef>
}

// 新增产品弹窗组件
const AddProductModal = memo(({visible, handleClose, handleRefresh, ref}: AddProductModalProps) => {
  // 产品类型
  type FileType = {
    name: string,
    belong_id: number,
    type: string,
    count: number,
    description: string
  }
  // 新增产品表单
  const [form] = Form.useForm()
  // 节流函数
  const throttleRef = useRef(useThrottleFn(async (values) => {
    try {
      const res = await addProduct(values as AddProductData)
      if (res.code === 4003) {
        message.error(res.message)
        return
      }
      message.success('新增产品成功')
      handleRefresh()
    } catch {
      message.error('新增产品失败')
    } finally {
      handleClose()
      form.resetFields()
    }
  }, 1000))
  // 新增产品表单提交
  const onFinish: FormProps<FileType>['onFinish'] = (values) => throttleRef.current(values)
  // 新增产品表单提交失败
  const onFinishFailed: FormProps<FileType>['onFinishFailed'] = (info) => {
    console.log(info)
  }

  // 向外暴露新增产品弹窗引用
  useImperativeHandle(ref, () => ({
    resetFields: () => form.resetFields()
  }))

  useEffect(() => {
    const { cancel } = throttleRef.current
    return () => {
      // 组件卸载时取消节流函数
      cancel()
    }
  }, [])

  return(
    <Modal
      title="新增产品" footer={null} 
      open={visible} onCancel={handleClose}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 15 }}
        className="AddProductModal-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}>
        <Form.Item label="仓库序列号" name="m_id"
          rules={[{ required: true, type: 'number', message: '请输入有效的仓库序列号' }]}>
          <InputNumber placeholder="请输入仓库序列号" />
        </Form.Item>
        <Form.Item label="产品名称" name="product_name"
          rules={[{ required: true, min: 2, max: 20, message: '请输入2-20个字符的产品名称' },
            {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '产品名称只能包含中文、字母、数字'}
          ]}>
          <Input placeholder="请输入产品名称" maxLength={20} />
        </Form.Item>
        <Form.Item label="产品类型" name="product_type"
          rules={[{pattern: /^[\u4e00-\u9fa5]+$/, message: '产品类型只能包含中文'}]}>
          <Select
            placeholder="请选择产品类型"
            className="type-select"
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
              { value: '其他商品', label: '其他商品' }
            ]}
          />
        </Form.Item>
        <Form.Item label="产品数量" name="product_num" rules={[{ required: true, type: 'number', message: '请输入有效的产品数量' }]}>
          <InputNumber placeholder="请输入产品数量" />
        </Form.Item>
        <Form.Item label="产品描述" name="product_description"
          rules={[{ min: 0, max: 200, message: '请输入0-200个字符的产品描述' }]}>
          <Input.TextArea rows={3} placeholder="请输入产品描述" maxLength={200} />
        </Form.Item>
        <Form.Item label={null} className="submit-btn">
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default AddProductModal
