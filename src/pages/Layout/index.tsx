import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'

import IndexHeader from './components/IndexHeader'

import './index.scss'
import { getUserInfoService } from '@/api/user'
import type { UserInfo } from '@/pages/Layout/components/IndexHeader'

const LayoutIndex = () => {
  // 导航实例
  const navigate = useNavigate()

  // 用户信息
  const [userInfo, setUserInfo] = useState<UserInfo>({
    user_name: '',
    user_role: ''
  })
  useEffect(() => {
    // 获取用户信息
    const getUserInfo = async () => {
      const res = await getUserInfoService()
      if (res.code === 200) {
        setUserInfo(res.data)
      }
    }
    getUserInfo()
  }, [])

  // 菜单项
  const menuItems = [
    {
      key: '1',
      label: '首页'
    },
    {
      key: '2',
      label: '人员管理'
    },  
    {
      key: '3',
      label: '仓库管理'
    },
    {
      key: '4',
      label: '库存管理'
    },
    {
      key: '5',
      label: '操作信息'
    }
  ]
  // 菜单点击事件
  const handleMenuClick: MenuProps['onClick'] = (item) => {
    if (item.key === '1') {
      navigate('/')
    }
    if (item.key === '2') {
      navigate('/per-manage')
    }
    if (item.key === '3') {
      navigate('/sto-manage')
    } 
    if (item.key === '4') {
      navigate('/pro-manage') 
    }
    if (item.key === '5') {
      navigate('/act-info')
    }
  }

  return (
    <div> 
      <IndexHeader userInfo={userInfo} />
      <Layout className='middle'>
        <Layout.Sider theme='dark' className='sider' width={'260px'}>
          <Menu onClick={(item) => handleMenuClick(item)} theme='dark' mode='inline' className='menu'
            defaultSelectedKeys={['1']} items={menuItems}>
          </Menu>
        </Layout.Sider>
        <Layout.Content className='content'>
          <Outlet />
        </Layout.Content>
      </Layout>
    </div>
  )
}

export default LayoutIndex
