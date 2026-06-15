import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { SolutionOutlined, UserOutlined, IdcardOutlined, RobotOutlined, LogoutOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'

import '@/pages/Layout/components/styles/indexHeader.scss'
import { getInitial, turnRoleToChinese } from '@/utils/handleWord'
import type { RootState, AppDispatch } from '@/store/index'
import { getStorage } from '@/utils/storage'
import UserCenter from '@/pages/Layout/components/UserInfoManage'
import { removeStorage } from '@/utils/storage'
import { logoutService } from '@/api/user'
import { getRequestApply, handleApply } from '@/api/apply'
import type { ApplyObj } from '@/api/apply'
import useSse from '@/hooks/useSse'
import { useLoading } from '@/hooks/useLoading'
import { setExistApply } from '@/store/modules/userStore'

const IndexHeader = () => {
  // dispatch 实例
  const dispatch = useDispatch<AppDispatch>()
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

  // 待处理弹窗状态
  const [requestVisible, setRequestVisible] = useState(false)
  // 加载状态
  const {loading, run} = useLoading()
  // 处理申请点击事件
  const handleApplyClick = async (status: number, m_id: number, apply_role: string, user_name: string) => {
    if (loading) {
      return
    }
    await run(() => handleApply({ m_id, apply_status: status, apply_role, user_name }))
    const res = await getRequestApply()
    setApplyList(res.data.applyList)
  }

  // 申请列表数据
  const [applyList, setApplyList] = useState<ApplyObj[]>([])
  // 消息状态
  type MessageObj = {
    msg: {
      time: string,
      content: string
    }
  } | {msg: string} | null
  const [messages, setMessages] = useState<MessageObj>()
  // 消息处理函数
  useSse({onMessage: setMessages})
  
  useEffect(() => {
    // 初始化与用户提起申请触发消息处理
    if (userInfo.user_role === 'sup_admin' && messages) {
      const getInfo = async () => {
        const res = await getRequestApply()
        setApplyList(res.data.applyList)
      }
      getInfo()
    }
    // 处理申请后触发消息处理
    if (userInfo.user_role === 'com_admin' || userInfo.user_role === 'staff' && messages?.msg !== '连接成功' && messages) {
      dispatch(setExistApply(false))
      message.success('申请已被处理')
    }
  }, [messages, userInfo.user_role, dispatch])

  return (
    <div className="IndexHeader-header">
      <div className="left">
        <div className="logo" onClick={() => navigate('/')}><RobotOutlined className="icon" />Mz System</div>
        <div className="function">
          {getStorage('role') === 'sup_admin' ? <div className="fun-btn request-info"
            onClick={() => setRequestVisible(true)}>
            <div className="text">待处理申请</div>
            <SolutionOutlined className="icon" />
            {applyList.length > 0 ? <div className="apply-count">{applyList.length}</div> : null}
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
      <Modal
        className="IndexHeader-request-modal"
        title="待处理申请"
        open={requestVisible}
        onCancel={() => setRequestVisible(false)}
        footer={null}
      >
        {applyList.length > 0 ? (
          applyList.map((item) => (
            <div key={item.user_name}>
              <div className="apply-item">
                <div className="apply-content">
                  <div className="apply-user">申请人：{item.user_name}</div>
                  <div className="apply-role">申请角色：{turnRoleToChinese(item.apply_role) || '成员'}</div>
                  <div className="apply-time">申请时间：{dayjs(item.apply_create_time).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                <div className="apply-btn">
                  <div className="btn anticon-check" 
                    onClick={() => handleApplyClick(1, item.m_id, item.apply_role, item.user_name)}>通过</div>
                  <div className="btn anticon-close" 
                    onClick={() => handleApplyClick(2, item.m_id, item.apply_role, item.user_name)}>拒绝</div>
                </div>
              </div>
            </div>
          ))) : <div className="no-apply">暂无待处理申请</div>}
      </Modal>
    </div>
  )
}

export default IndexHeader