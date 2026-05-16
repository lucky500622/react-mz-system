import '@/pages/Login/index.scss'
import { useState } from 'react'

import type { FormProps } from 'antd'
import { Button, Form, Input } from 'antd'
import { SwapOutlined } from '@ant-design/icons'

const Login = () => {
  // 切换登录注册
  const [isLogin, setIsLogin] = useState(true)
  // 登录注册切换处理函数
  const toggleLogin = () => {
    setIsLogin(!isLogin)
    form.resetFields()
  }

  // 登录表单类型
  type FieldType = {
    username?: string;
    password?: string;
  }
  // 登录表单实例
  const [form] = Form.useForm<FieldType>()
  // 登录表单提交处理函数
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log(values)
  }
  // 登录表单提交失败处理函数
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (info) => {
    console.log(info)
  }

  return (
    <div className="main-box">

      <div className="login-box">
        {/* 登录/注册标题 */}
        <div className='login-title'>
          <span className="title">{isLogin ? '用户登录' : '用户注册'}</span>
        </div>

        {/* 登录/注册表单 */}
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="login-form">
          <Form.Item<FieldType> name="username" label="账户" rules={[{ required: true, message: '请输入账户' }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType> label={null}>
            <div className='function-box'>
              <div className="toggle-btn" onClick={toggleLogin}>
                {isLogin ? '切换到注册' : '切换到登录'}
                <SwapOutlined />
              </div>
              <Button type="primary" htmlType="submit" className="login-btn">
                {isLogin ? '登录' : '注册'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
