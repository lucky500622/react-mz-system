import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SolutionOutlined, UserOutlined, IdcardOutlined, RobotOutlined } from '@ant-design/icons'

import './IndexHeader.scss'
import { getInitial, turnRoleToChinese } from '@/utils/handleWord'
import type { RootState, AppDispatch } from '@/store/index'
import { fetchUserInfo } from '@/store/modules/userStore'

const IndexHeader = () => {
  // 导航实例
  const navigate = useNavigate()
  // 获取用户信息
  const dispatch = useDispatch<AppDispatch>()
  const userInfo = useSelector((state: RootState) => state.userStore.userInfo)
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])
  
  return (
    <div className="header">
      <div className="left">
        <div className="logo" onClick={() => navigate('/')}><RobotOutlined className="icon" />Mz System</div>
        <div className="request-info">
          <div className="text">待处理申请</div>
          <SolutionOutlined className="icon" />
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
    </div>
  )
}

export default IndexHeader