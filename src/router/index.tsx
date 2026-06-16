import { createHashRouter  } from 'react-router-dom'
import { Suspense } from 'react'
import AuthRoute from '../components/AuthRoute'
import StaffAnthRoute from '@/components/StaffAnthRoute'
import AdminAnthRoute from '@/components/AdminAnthRoute'

import {
  Login, LayoutIndex, Home, StoManage, ProManage, PerManage, ActInfo, StoHandle, ProUpload
} from '@/router/router'
import Loading from '@/components/Loading'

const router = createHashRouter([
  {
    element: <AuthRoute />,
    children: [{
      path: '/',
      element: (
        <Suspense fallback={<Loading />}>
          <LayoutIndex />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          element: <AdminAnthRoute />,
          children: [
            {
              path: '/sto-manage',
              element: <StoManage />
            },
            {
              path: '/pro-manage',
              element: <ProManage />
            }
          ]
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
          element: <StaffAnthRoute />,
          children: [
            {
              path: '/sto-handle',
              element: <StoHandle />
            }
          ]
        }
      ]
    },
    {
      element: <StaffAnthRoute />,
      children: [
        {
          path: '/pro-upload/:id',
          element: (
            <Suspense fallback={<Loading />}>
              <ProUpload />
            </Suspense>
          )
        }
      ]
    }]
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    )
  }
])

export default router