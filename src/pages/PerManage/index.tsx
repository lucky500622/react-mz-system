import { useState, useEffect, useMemo} from 'react'
import { useSelector } from 'react-redux'

import { Table, Tag, Modal, Form, Select, Button, message } from 'antd'
import type { FormProps } from 'antd'

import '@/pages/PerManage/index.scss'
import { submitApply } from '@/api/apply'
import { getUserListService } from '@/api/user'
import type { UserListObj } from '@/api/user'
import { getInitial, turnRoleToChinese } from '@/utils/handleWord'
import type {RootState} from '@/store'
import {useLoading} from '@/hooks/useLoading'

const PerManage = () => {
  // 全部用户列表
  const [userList, setUserList] = useState<UserListObj[]>([])
  // 审批人列表
  const approveUserList = useMemo(() => userList.filter((item) => item.user_role === 'sup_admin'), [userList])
  // 表格配置
  const columns = [
    {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: '用户身份',
      dataIndex: 'user_role',
      key: 'user_role',
      render: (text) => {
        const role = turnRoleToChinese(text)
        return <Tag color={text === 'sup_admin' ? 'red' : text === 'com_admin' ? 'blue' : 'green'}>{role}</Tag>
      }
    }
  ]
  // 分页配置
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8
  // 用户信息
  const userInfo = useSelector((state: RootState) => state.userStore.userInfo)

  // 弹窗配置
  const [visible, setVisible] = useState(false)
  // 点击权限变更申请按钮
  const handleApply = async () => {
    setVisible(true)
  }
  // 表单配置
  type FieldType = {
    apply_role: string;
    approve_user_name: string;
  }
  const [form] = Form.useForm()
  // 加载状态
  const {loading, run} = useLoading()
  // 提交表单
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await run(() => submitApply(values))
      message.success('申请成功')
    } finally {
      form.resetFields()
      setVisible(false)
    }  
  }
  // 提交表单失败
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    // 获取用户列表
    const getInfo = async () => {
      const res = await getUserListService()
      setUserList(res.data.userList)
    }
    getInfo()
  }, [])

  return (
    <div>
      <div className="PerManage-top-bar">
        <h2>成员信息</h2>
      </div>

      <div className="PerManage-info-bar">
        <div className="content">  
          <div className="avatar">{getInitial(userInfo.user_name) || 'U'}</div>
          <div className="user-info">
            <div className="user-name">
              {userInfo.user_name || '未知用户'}
            </div>
            <div className="user-role">
              {turnRoleToChinese(userInfo.user_role)}
            </div>
          </div>
        </div>
        {
          userInfo.user_role !== 'sup_admin' && (
            <div className="apply-btn" onClick={handleApply} >
          权限变更申请
            </div>)
        }
      </div>

      <Table columns={columns} dataSource={userList} rowKey={(record) => record.user_name} pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: userList.length,
        onChange: (page) => {
          setCurrentPage(page)
        }
      }} />

      <Modal title="权限变更申请" open={visible} onCancel={() => setVisible(false)} footer={null}
        className="PerManage-modal">
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          disabled={loading} >
          <Form.Item<FieldType> label="申请身份" name="apply_role"
            rules={[{ required: true, message: '请选择申请身份' }]}>
            <Select options={[
              { label: '仓库管理员', value: 'com_admin' },
              { label: '上架管理员', value: 'staff' }
            ]} />
          </Form.Item>
          <Form.Item<FieldType> label="审批人" name="approve_user_name"
            rules={[{ required: true, message: '请选择审批人' }]}>
            <Select options={approveUserList.map((item) => ({
              label: item.user_name,
              value: item.user_name
            }))} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">提交申请</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PerManage
