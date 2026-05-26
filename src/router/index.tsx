import { createBrowserRouter } from 'react-router-dom'
import AuthRoute from '../components/AuthRoute'
import LayoutIndex from '@/pages/Layout/index'
import Home from '@/pages/Layout/Home/Home'
import Login from '@/pages/Login/index'

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
