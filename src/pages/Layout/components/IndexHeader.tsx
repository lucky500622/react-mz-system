import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'

import { SolutionOutlined, UserOutlined, IdcardOutlined, RobotOutlined, LogoutOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

import '@/pages/Layout/components/styles/indexHeader.scss'
import { getInitial, turnRoleToChinese } from '@/utils/handleWord'
import type { RootState } from '@/store/index'
import { getStorage } from '@/utils/storage'
import UserCenter from '@/pages/Layout/components/UserInfoManage'
import { removeStorage } from '@/utils/storage'
import { logoutService } from '@/api/user'

const IndexHeader = () => {
  // 个人中心弹窗状态
  const [visible, setVisible] = useState(false)
  // 导航实例
  const navigate = useNavigate()
  // 获取用户信息
  const userInfo = useSelector((state: RootState) => state.userStore.userInfo)

  // 退出登录弹窗状态
  const [logoutVisible, setLogoutVisible] = useState(false)
  // 退出登录点击事件
  const handleLogoutClick = () => {
    setLogoutVisible(true)
  }
  // 退出登录确认事件
  const logoutConfirm = async () => {
    await logoutService()
    removeStorage('token')
    removeStorage('role')
    navigate('/login', { replace: true })
  }
  
  return (
    <div className="IndexHeader-header">
      <div className="left">
        <div className="logo" onClick={() => navigate('/')}><RobotOutlined className="icon" />Mz System</div>
        <div className="function">
          {getStorage('role') === 'sup_admin' ? <div className="fun-btn request-info">
            <div className="text">待处理申请</div>
            <SolutionOutlined className="icon" />
          </div> : null}
          <div className="fun-btn manage-user-info" onClick={() => setVisible(true)}>
            <div className="text"> 个人信息管理</div>
            <UserOutlined className="icon" />
          </div>
          <div className="fun-btn out" onClick={handleLogoutClick}>
            <div className="text"> 退出登录</div>
            <LogoutOutlined className="icon" />
          </div>
        </div>
      </div>
      <div className="right">
        <div className="user-info">
          <span className="user-role"><IdcardOutlined className="icon" />
            {turnRoleToChinese(userInfo.user_role) || '成员'}</span>
          <span className="user-name"><UserOutlined className="icon" />
            {userInfo.user_name || '用户'}</span>
        </div>
        <div className="user-avatar">{getInitial(userInfo.user_name) || 'U'}</div>
      </div>
      <UserCenter visible={visible} setVisible={setVisible} />
      <Modal
        title="确认退出登录吗？"
        open={logoutVisible}
        onOk={logoutConfirm}
        okText="确认退出"
        cancelText="取消"
        onCancel={() => setLogoutVisible(false)}
      >
      </Modal>
    </div>
  )
}

export default IndexHeader