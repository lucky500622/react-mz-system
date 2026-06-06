import {useState, useCallback, useRef} from 'react'

import { Button, Input, InputNumber, Select, Form } from 'antd'
import type { FormProps } from 'antd/es/form'

import '@/pages/StoManage/index.scss'
import StoTable from '@/pages/StoManage/components/StoTable'
import AddWarehouseModal from '@/pages/StoManage/components/AddWarehouseModal'
import type { AddWarehouseModalRef } from '@/pages/StoManage/components/AddWarehouseModal'
import type { StoTableRef } from '@/pages/StoManage/components/StoTable'
import { useLoading } from '@/hooks/useLoading'
import { getWarehouseInfo } from '@/api/warehouse'
import type { WarehouseInfoData } from '@/api/warehouse'

const StoManage = () => {
  const [form] = Form.useForm()
  // 新增仓库表单提交loading状态
  const { loading, run } = useLoading()
  // 新增仓库表单字段类型
  type FieldType = {
    m_id?: number;
    warehouse_name?: string;
    warehouse_type?: string;
    user_name?: string;
  }
  // 新增仓库表单字段列表
  const [formList, setFormList] = useState<WarehouseInfoData[]>()
  // 新增仓库表单提交
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await run(() => {
      return getWarehouseInfo(0, 999, values)
    })
    setFormList(res.data.warehouseInfo)
  }
  // 新增仓库表单提交失败
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // 仓库弹窗变量
  const [visible, setVisible] = useState(false)
  // 新增仓库
  const handleAdd = () => {
    setVisible(true)
  }
  // 新增仓库弹窗关闭
  const handleClose = useCallback(() => {
    setVisible(false)
    addModalRef.current?.resetFields()
  }, [setVisible])

  // 新增仓库弹窗引用
  const addModalRef = useRef<AddWarehouseModalRef>(null)
  // 仓库表格引用
  const tableRef = useRef<StoTableRef>(null)
  // 刷新仓库表格数据
  const handleRefresh = useCallback(() => {
    tableRef.current?.refreshData()
  }, [tableRef])

  return (
    <div>
      <div className="StoManage-top-bar">
        <h2>仓库管理</h2>
      </div>
      <div className="StoManage-function-bar">
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="inline"
          disabled={loading}>
          <Form.Item label="仓库序列号" name="m_id"
            rules={[{ type: 'number', min: 1, message: '请输入有效的仓库序列号' }]}>
            <InputNumber placeholder="请输入仓库序列号"/>
          </Form.Item>
          <Form.Item label="仓库名称" name="warehouse_name" 
            rules={[{pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '仓库名称只能包含汉字、字母和数字'}]}>
            <Input placeholder="请输入仓库名称" className="word-input" />
          </Form.Item>
          <Form.Item label="仓库类型" name="warehouse_type" 
            rules={[{ pattern: /^[\u4e00-\u9fa5]+$/, message: '仓库类型只能包含汉字'}]}>
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
          <Form.Item label="创建人" name="user_name"
            rules={[{ pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字'}]}>
            <Input placeholder="请输入创建人" className="word-input"  />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="default" htmlType="submit">查询</Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="default" onClick={() => form.resetFields()}>重置</Button>
          </Form.Item>
        </Form>
        <div className="add-btn">
          <Button type="default" onClick={handleAdd}>新增仓库</Button>
        </div>
      </div>
      <StoTable ref={tableRef} queryDataSource={formList} />
      <AddWarehouseModal handleRefresh={handleRefresh}
        visible={visible} handleClose={handleClose} ref={addModalRef} />
    </div>
  )
}

export default StoManage
