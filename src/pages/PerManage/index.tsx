import { useState, useEffect} from 'react'

import { Table, Tag } from 'antd'

import '@/pages/PerManage/index.scss'
import { submitApply } from '@/api/apply'
import { getUserListService } from '@/api/user'
import type { UserListObj } from '@/api/user'

const PerManage = () => {
  const [userList, setUserList] = useState<UserListObj[]>([])

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
        const role = text === 'sup_admin' ? '超级管理员' : text === 'com_admin' ? '管理员' : '普通用户'
        return <Tag color={text === 'sup_admin' ? 'red' : text === 'com_admin' ? 'blue' : 'green'}>{role}</Tag>
      }
    }
  ]

  // 分页
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
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
      <Table columns={columns} dataSource={userList} pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: userList.length,
        onChange: (page) => {
          setCurrentPage(page)
        }
      }} />
    </div>
  )
}

export default PerManage
