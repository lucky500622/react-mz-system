import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'

import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'

import IndexHeader from '@/pages/Layout/components/IndexHeader'
import { getStorage } from '@/utils/storage'
import type { AppDispatch } from '@/store/index'
import { fetchUserInfo } from '@/store/modules/userStore'
import useSse from '@/hooks/useSse'

import '@/pages/Layout/index.scss'

const LayoutIndex = () => {
  // 消息状态
  const [messages, setMessages] = useState([])
  // 消息处理函数
  useSse({onMessage: setMessages})
  // 导航实例
  const navigate = useNavigate()
  // 获取用户角色
  const role = getStorage('role')

  // 菜单项
  const menuItems = [
    {
      key: '1',
      label: '首页'
    },
    {
      key: '2',
      label: '成员信息'
    },  
    {
      key: '3',
      label: '仓库管理',
      disabled: role !== 'sup_admin' && role !== 'com_admin'
    },
    {
      key: '4',
      label: '库存管理',
      disabled: role !== 'sup_admin' && role !== 'com_admin'
    },
    {
      key: '5',
      label: '产品上架',
      disabled: role !== 'sup_admin' && role !== 'staff'
    },
    {
      key: '6',
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
      navigate('/sto-handle')
    }
    if (item.key === '6') {
      navigate('/act-info')
    }
  }
  const pathToKeyMap: Record<string, string> = {
    '/': '1',
    '/per-manage': '2',
    '/sto-manage': '3',
    '/pro-manage': '4',
    '/sto-handle': '5',
    '/act-info': '6'
  }
  const currentKey = pathToKeyMap[location.pathname] || '1'

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <div> 
      <IndexHeader />
      <Layout className='Layout-middle'>
        <Layout.Sider theme='dark' className='sider' width={'260px'}>
          <Menu onClick={(item) => handleMenuClick(item)} theme='dark' mode='inline' className='menu'
            defaultSelectedKeys={[currentKey]} items={menuItems}>
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
