import { createBrowserRouter } from 'react-router-dom'
import AuthRoute from '../components/AuthRoute'
import Login from '@/pages/Login'
import LayoutIndex from '@/pages/Layout/index'
import Home from '@/pages/Home'
import StoManage from '@/pages/StoManage'
import ProManage from '@/pages/ProManage'
import PerManage from '@/pages/PerManage'
import ActInfo from '@/pages/ActInfo'


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
        }
      ]
    }]
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router
