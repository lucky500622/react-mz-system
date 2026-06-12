import { createBrowserRouter } from 'react-router-dom'
import AuthRoute from '../components/AuthRoute'
import Login from '@/pages/Login'
import LayoutIndex from '@/pages/Layout/index'
import Home from '@/pages/Home'
import StoManage from '@/pages/StoManage'
import ProManage from '@/pages/ProManage'
import PerManage from '@/pages/PerManage'
import ActInfo from '@/pages/ActInfo'
import StoHandle from '@/pages/StoHandle' 
import ProUpload from '@/pages/ProUpload'
import UserCenter from '@/pages/UserCenter'

const router = createBrowserRouter([
  {
    element: <AuthRoute />,
    children: [{
      path: '/',
      element: <LayoutIndex />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: '/sto-manage',
          element: <StoManage />
        },
        {
          path: '/pro-manage',
          element: <ProManage />
        },
        {
          path: '/per-manage',
          element: <PerManage />
        },
        {
          path: '/act-info',
          element: <ActInfo />
        },
        {
          path: '/sto-handle',
          element: <StoHandle />
        },
        {
          path: '/user-center',
          element: <UserCenter />
        }
      ]
    },
    {
      path: '/pro-upload/:id',
      element: <ProUpload />
    }]
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router
