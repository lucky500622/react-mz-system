import { memo, useImperativeHandle } from 'react'

import type { FormProps } from 'antd'
import { Input, Modal, Form, Button, message } from 'antd'

import '@/pages/StoManage/components/styles/addWarehouseModel.scss'
import { addWarehouse } from '@/api/warehouse'

// 新增仓库弹窗引用类型
export type AddWarehouseModalRef = {
  resetFields: () => void
}
// 新增仓库弹窗接收的属性
type AddWarehouseModalProps = {
  visible: boolean,
  handleClose: () => void,
  ref: React.Ref<AddWarehouseModalRef>
}

// 新增仓库弹窗组件
const AddWarehouseModal = memo(({visible, handleClose, ref}: AddWarehouseModalProps) => {
  // 仓库类型
  type FileType = {
    warehouse_name: string,
    warehouse_type: string,
    warehouse_description: string
  }
  // 新增仓库表单
  const [form] = Form.useForm()
  // 新增仓库表单提交
  const onFinish: FormProps<FileType>['onFinish'] = async (values) => {
    try {
      await addWarehouse(values)
    } catch (err) {
      message.error(err.message)
    } finally {
      handleClose()
      form.resetFields()
    }
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
      title="新增仓库" footer={null} 
      open={visible} onCancel={handleClose}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 15 }}
        className="AddWarehouseModal-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}>
        <Form.Item label="仓库名称" name="warehouse_name"
          rules={[{ required: true, min: 2, max: 20, message: '请输入2-20个字符的仓库名称' }]}>
          <Input placeholder="请输入仓库名称" maxLength={20} />
        </Form.Item>
        <Form.Item label="仓库类型" name="warehouse_type"
          rules={[{ min: 2, max: 8, message: '请输入2-8个字符的仓库类型' }]}>
          <Input placeholder="请输入仓库类型" maxLength={8} />
        </Form.Item>
        <Form.Item label="仓库描述" name="warehouse_description"
          rules={[{ min: 0, max: 200, message: '请输入0-200个字符的仓库描述' }]}>
          <Input.TextArea rows={3} placeholder="请输入仓库描述" maxLength={200} />
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

export default AddWarehouseModal