import { Input, Button, InputNumber, Select, Form } from 'antd'
import type { FormProps } from 'antd/es/form'

import '@/pages/ActInfo/components/styles/functionBar.scss'
import type { warehouseConfig, productConfig } from '@/pages/ActInfo/components/ActTabs'

type LabelConfig = {
  config_type: string
}
const FunctionBar = ({labelConfig, options, onSearch, loading} : {labelConfig: LabelConfig, options: string[],
  onSearch: (values: warehouseConfig | productConfig, config_type: string) => void, loading: boolean}) => {
  const [form] = Form.useForm()
  // 新增仓库表单提交
  const onFinish: FormProps<warehouseConfig | productConfig>['onFinish'] = (values) => {
    onSearch(values, labelConfig.config_type)
  }
  // 新增仓库表单提交失败
  const onFinishFailed: FormProps<warehouseConfig | productConfig>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className="FunctionBar-function-bar">
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="inline"
          disabled={loading}>
          <Form.Item label="操作序列号" name="m_id"
            rules={[{ type: 'number', min: 1, message: '请输入有效的序列号' }]}>
            <InputNumber placeholder="请输入序列号"/>
          </Form.Item>

          <Form.Item label={labelConfig.config_type === 'warehouse' ? '仓库序列号' : '产品序列号'}
            name={labelConfig.config_type === 'warehouse' ? 'warehouse_m_id' : 'product_m_id'}
            rules={[{ type: 'number', min: 1, message: '请输入有效的序列号' }]}>
            <InputNumber placeholder="请输入序列号"/>
          </Form.Item>

          <Form.Item label={labelConfig.config_type === 'warehouse' ? '仓库名称' : '产品名称'}
            name={labelConfig.config_type === 'warehouse' ? 'warehouse_name' : 'product_name'}
            rules={[{pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '名称只能包含汉字、字母和数字' }]}>
            <Input placeholder="请输入名称" className="word-input" />
          </Form.Item>

          <Form.Item label={labelConfig.config_type === 'warehouse' ? '仓库操作类型' : '产品操作类型'} name="action_type">
            <Select placeholder="请选择类型" className="type-select"
              options={options.map((item, index) => ({ value: index + 1, label: item }))}
            />
          </Form.Item>

          <Form.Item label={labelConfig.config_type === 'warehouse' ? '仓库操作人' : '产品操作人'} name="user_name"
            rules={[{ pattern: /^[a-zA-Z0-9]+$/, 
              message: '操作人只能包含字母和数字' }]}>
            <Input placeholder="请输入操作人" className="word-input"  />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="default" htmlType="submit">查询</Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="default" onClick={() => form.resetFields()}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default FunctionBar