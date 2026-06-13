import { Navigate, Outlet } from 'react-router-dom'

import { getStorage } from '@/utils/storage'

const StaffAnthRoute = () => {
  const role = getStorage('role')
  if (role !== 'sup_admin' && role !== 'staff') {
    return <Navigate to="/" replace={true} />
  }
  return <Outlet />
}
export default StaffAnthRoute
