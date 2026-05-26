import { Navigate, Outlet } from 'react-router-dom'

import { getStorage } from '@/utils/storage'

const AuthRoute = () => {
  const token = getStorage('token')
  if (token) {
    return <Outlet />
  }
  return <Navigate to="/login" replace={true} />
}
export default AuthRoute
