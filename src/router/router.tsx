import { lazy } from 'react'

export const Login = lazy(() => import('@/pages/Login'))
export const LayoutIndex = lazy(() => import('@/pages/Layout/index'))
export const Home = lazy(() => import('@/pages/Home'))
export const StoManage = lazy(() => import('@/pages/StoManage'))
export const ProManage = lazy(() => import('@/pages/ProManage'))
export const PerManage = lazy(() => import('@/pages/PerManage'))
export const ActInfo = lazy(() => import('@/pages/ActInfo'))
export const StoHandle = lazy(() => import('@/pages/StoHandle'))
export const ProUpload = lazy(() => import('@/pages/ProUpload'))