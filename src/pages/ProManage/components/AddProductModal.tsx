import { memo, useImperativeHandle } from 'react'

import type { FormProps } from 'antd'
import { Input, Modal, Form, Button, InputNumber } from 'antd'

import '@/pages/ProManage/components/styles/addProductModel.scss'

// 新增产品弹窗引用类型
export type AddProductModalRef = {
  resetFields: () => void
}
// 新增产品弹窗接收的属性
type AddProductModalProps = {
  visible: boolean,
  handleCancel: () => void,
  handleOk: () => void,
  ref: React.Ref<AddProductModalRef>
}

// 新增产品弹窗组件
const AddProductModal = memo(({visible, handleCancel, handleOk, ref}: AddProductModalProps) => {
  // 产品类型
  type FileType = {
    name: string,
    belong_id: number,
    type: string,
    count: number,
    description: string
  }
  // 新增仓库表单
  const [form] = Form.useForm()
  // 新增仓库表单提交
  const onFinish: FormProps<FileType>['onFinish'] = (values) => {
    console.log(values)
    form.resetFields()
  }
  // 新增仓库表单提交失败
  const onFinishFailed: FormProps<FileType>['onFinishFailed'] = (info) => {
    console.log(info)
  }

  // 向外暴露新增仓库弹窗引用
  useImperativeHandle(ref, () => ({
    resetFields: () => form.resetFields()
  }))

  return(
    <Modal
      title="新增产品" footer={null} 
      open={visible} onCancel={handleCancel} onOk={handleOk}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 15 }}
        className="AddProductModal-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}>
        <Form.Item label="产品名称" name="name" rules={[{ required: true, min: 2, max: 20, message: '请输入2-20个字符的产品名称' }]}>
          <Input placeholder="请输入产品名称" maxLength={20} />
        </Form.Item>
        <Form.Item label="仓库序列号" name="belong_id" rules={[{ required: true, type: 'number', message: '请输入有效的仓库序列号' }]}>
          <InputNumber placeholder="请输入仓库序列号" />
        </Form.Item>
        <Form.Item label="产品类型" name="type" rules={[{ min: 2, max: 8, message: '请输入2-8个字符的产品类型' }]}>
          <Input placeholder="请输入产品类型" maxLength={8} />
        </Form.Item>
        <Form.Item label="产品数量" name="count" rules={[{ required: true, type: 'number', message: '请输入有效的产品数量' }]}>
          <InputNumber placeholder="请输入产品数量" />
        </Form.Item>
        <Form.Item label="产品描述" name="description" rules={[{ min: 0, max: 200, message: '请输入0-200个字符的产品描述' }]}>
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
