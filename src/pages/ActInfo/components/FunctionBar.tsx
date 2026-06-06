import { Input, Button, InputNumber, Select, Form } from 'antd'
import type { FormProps } from 'antd/es/form'

import '@/pages/ActInfo/components/styles/functionBar.scss'

type FunctionBarConfig = {
  issue_m_id: string,
  m_id: string,
  name: string,
  user_name: string,
  type: string
}

const FunctionBar = ({config, options} : {config: FunctionBarConfig, options: string[]}) => {
  // 新增仓库表单字段类型
  type FieldType = {
    issue_m_id?: number;
    m_id?: number;
    name?: string;
    type?: string;
    user_name?: string;
  }
  // 新增仓库表单提交
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }
  // 新增仓库表单提交失败
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className="FunctionBar-function-bar">
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="inline">
          <Form.Item label={config.issue_m_id} name="issue_m_id"
            rules={[{ type: 'number', min: 1, message: `请输入有效的${config.issue_m_id}` }]}>
            <InputNumber placeholder="请输入序列号"/>
          </Form.Item>
          <Form.Item label={config.m_id} name="m_id"
            rules={[{ type: 'number', min: 1, message: `请输入有效的${config.m_id}` }]}>
            <InputNumber placeholder="请输入仓库序列号"/>
          </Form.Item>
          <Form.Item label={config.name} name="name" 
            rules={[{pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: `${config.name}只能包含汉字、字母和数字` }]}>
            <Input placeholder="请输入名称" className="word-input" />
          </Form.Item>
          <Form.Item label={config.type} name="type" 
            rules={[{ pattern: /^[\u4e00-\u9fa5]+$/, message: `${config.type}只能包含汉字` }]}>
            <Select placeholder="请选择类型" className="type-select"
              options={options.map((item) => ({ value: item, label: item }))}
            />
          </Form.Item>
          <Form.Item label={config.user_name} name="user_name"
            rules={[{ pattern: /^[a-zA-Z0-9]+$/, message: `${config.user_name}只能包含字母和数字` }]}>
            <Input placeholder="请输入操作人" className="word-input"  />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="default" htmlType="submit">查询</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default FunctionBar