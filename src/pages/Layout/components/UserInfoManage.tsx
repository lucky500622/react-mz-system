import {Modal, Form, Input, Button, message} from 'antd'
import type { FormProps } from 'antd'

import '@/pages/Layout/components/styles/userInfoManage.scss'
import { updatePasswordService } from '@/api/user'
import { useLoading } from '@/hooks/useLoading'

const UserInfoManage = ({
  visible,
  setVisible
} : {
  visible: boolean,
  setVisible: (visible: boolean) => void,
}) => {

type FieldType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// 加载状态
const { loading, run } = useLoading()

// 更新用户密码
const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
  try {
    const res = await run(() => updatePasswordService({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    }))
    if (res.code === 4001) {
      message.error(res.message)
      return
    }
    message.success('密码更新成功')
  } finally {
    setVisible(false)
  }
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}
  

return (
  <Modal
    title="个人信息管理"
    open={visible}
    onCancel={() => setVisible(false)}
    onOk={() => setVisible(false)}
    className="UserCenter-modal"
    footer={null}
  >
    <Form 
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      disabled={loading}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        name="oldPassword" label="旧密码" rules={[{ required: true, min: 6, max: 12, message: '请输入6-12个字符的密码' },
          {pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字'}]}>
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword" label="新密码" rules={[{ required: true, min: 6, max: 12, message: '请输入6-12个字符的密码' },
          {pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字'}]}>
        <Input.Password />
      </Form.Item>
      
      <Form.Item
        dependencies={['newPassword']}
        name="confirmPassword" label="确认密码" rules={[{ required: true, message: '请输入确认密码' },
          ({ getFieldValue }) => ({
            validator(_, val) {
              if (!val || getFieldValue('newPassword') === val) {
                return Promise.resolve()
              }
              return Promise.reject('两次输入密码不一致')
            }
          })
        ]}>
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
      
  </Modal>
)
}

export default UserInfoManage
