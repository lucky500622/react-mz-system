import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import type { FormProps } from 'antd'
import { Button, Form, Input, message } from 'antd'
import { SwapOutlined } from '@ant-design/icons'

import '@/pages/Login/index.scss'
import { useLoading } from '@/hooks/useLoading'
import { registerService, loginService } from '@/api/user'
import { setStorage } from '@/utils/storage'
import { fetchUserInfo } from '@/store/modules/userStore'
import type { AppDispatch } from '@/store/index'

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  // 导航实例
  const navigate = useNavigate()

  // 切换登录注册
  const [isLogin, setIsLogin] = useState(true)
  // 登录注册切换处理函数
  const toggleLogin = () => {
    setIsLogin(!isLogin)
    form.resetFields()
  }

  // 登录表单类型
  type FieldType = {
    username: string;
    password: string;
    confirmPassword?: string;
  }
  // 登录表单实例
  const [form] = Form.useForm<FieldType>()
  
  // 登录表单提交处理函数
  const { loading, run } = useLoading()
  // 登录表单提交处理函数
  const onFinish: FormProps<FieldType>['onFinish'] =  async (values: {
    username: string,
    password: string
  }) => {
    // 注册处理
    const data = {
      user_name: values.username,
      user_password: values.password
    }
    if (!isLogin) {
      // 注册用户
      const res = await run(() => registerService(data))
      if (res.code === 4002) {
        return message.error(res.message)
      }
      message.success('注册成功')
      toggleLogin()
    }
    // 登录处理
    else {
      const res = await run(() => loginService(data))
      if (res.code === 4001) {
        return message.error(res.message)
      } else if (res.code === 200) {
        message.success('登录成功')
        // 存储唯一会话标识
        setStorage('token', res?.data?.token ?? '')
        // 获取用户信息
        await dispatch(fetchUserInfo())
        // 跳转到首页
        navigate('/', { replace: true })
      }
    }
  }
  // 登录表单提交失败处理函数
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (info) => {
    console.log(info)
  }

  return (
    <div className="Login-login-box">
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
        className="login-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        disabled={loading} >
        <Form.Item<FieldType>
          name="username" label="用户名" rules={[{ required: true, min: 3, max: 20, message: '请输入3-20个字符的用户名' },
            {pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字'}]}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          name="password" label="密码" rules={[{ required: true, min: 6, max: 12, message: '请输入6-12个字符的密码' },
            {pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字'}]}>
          <Input.Password />
        </Form.Item>

        {/* 注册时确认密码项 */}
        {!isLogin && (
          <Form.Item<FieldType>
            dependencies={['password']}
            name="confirmPassword" label="确认密码" rules={[{ required: true, message: '请输入确认密码' },
              ({ getFieldValue }) => ({
                validator(_, val) {
                  if (!val || getFieldValue('password') === val) {
                    return Promise.resolve()
                  }
                  return Promise.reject('两次输入密码不一致')
                }
              })
            ]}>
            <Input.Password />
          </Form.Item>
        )}

        <div className="function-box">
          <div className="toggle-btn" onClick={toggleLogin}>
            {isLogin ? '切换到注册' : '切换到登录'}
            <SwapOutlined />
          </div>
          <Form.Item<FieldType> label={null}>
            <Button type="primary" htmlType="submit" className="login-btn">
              {isLogin ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default Login
