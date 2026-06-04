import { memo, useImperativeHandle, useEffect, useRef } from 'react'

import type { FormProps } from 'antd'
import { Input, Modal, Form, Button, message, Select } from 'antd'

import { useThrottleFn } from '@/hooks/useThrottle'
import '@/pages/StoManage/components/styles/addWarehouseModel.scss'
import { addWarehouse } from '@/api/warehouse'
import type { AddWarehouseData } from '@/api/warehouse'

// 新增仓库弹窗引用类型
export type AddWarehouseModalRef = {
  resetFields: () => void,
}
// 新增仓库弹窗接收的属性
type AddWarehouseModalProps = {
  visible: boolean,
  handleClose: () => void,
  handleRefresh: () => void,
  ref: React.Ref<AddWarehouseModalRef>
}

// 新增仓库弹窗组件
const AddWarehouseModal = memo(({handleRefresh, visible, handleClose, ref}: AddWarehouseModalProps) => {
  // 仓库类型
  type FileType = {
    warehouse_name: string,
    warehouse_type: string,
    warehouse_description: string
  }
  // 新增仓库表单
  const [form] = Form.useForm()
  // 节流函数
  const throttleRef = useRef(useThrottleFn(async (values: AddWarehouseData) => {
    try {
      const res = await addWarehouse(values)
      if (res.code === 4002) {
        message.error(res.message)
        return
      }
      message.success('新增仓库成功')
      handleRefresh()
    } catch {
      message.error('新增仓库失败')
    } finally {
      handleClose()
      form.resetFields()
    }
  }, 1000))
  // 新增仓库表单提交
  const onFinish: FormProps<FileType>['onFinish'] = (values) => throttleRef.current(values)
  // 新增仓库表单提交失败
  const onFinishFailed: FormProps<FileType>['onFinishFailed'] = (info) => {
    console.log(info)
  }

  // 向外暴露新增仓库弹窗引用
  useImperativeHandle(ref, () => ({
    resetFields: () => form.resetFields()
  }))

  useEffect(() => {
    const cancel = throttleRef.current.cancel
    return () => {
      // 组件卸载时取消节流函数
      cancel()
    }
    
  }, [])

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
          rules={[{ required: true, min: 2, max: 20, message: '请输入2-20个字符的仓库名称' },
            {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '仓库名称只能包含汉字、字母和数字'}]} >
          <Input placeholder="请输入仓库名称" maxLength={20} />
        </Form.Item>
        <Form.Item label="仓库类型" name="warehouse_type"
          rules={[{ pattern: /^[\u4e00-\u9fa5]+$/, message: '仓库类型只能包含汉字'}]} >
          <Select placeholder="请选择仓库类型" className="type-select" 
            options={[
              { value: '常温仓', label: '常温仓' },
              { value: '冷藏仓', label: '冷藏仓' },
              { value: '冷冻仓', label: '冷冻仓' },
              { value: '干货仓', label: '干货仓' },
              { value: '百货仓', label: '百货仓' },
              { value: '家电仓', label: '家电仓' },
              { value: '服装仓', label: '服装仓' },
              { value: '其他仓储', label: '其他仓储' }
            ]}
          />
        </Form.Item>
        <Form.Item label="仓库描述" name="warehouse_description"
          rules={[{ min: 0, max: 200, message: '请输入0-200个字符的仓库描述' }]} >
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