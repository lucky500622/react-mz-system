import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/pages/Layout/index'
import Home from '@/pages/Layout/home'
import Login from '@/pages/Login/index'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export default router
