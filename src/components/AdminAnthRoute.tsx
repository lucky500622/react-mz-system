import { Navigate, Outlet } from 'react-router-dom'

import { getStorage } from '@/utils/storage'

const AdminAnthRoute = () => {
  const role = getStorage('role')
  if (role !== 'sup_admin' && role !== 'com_admin') {
    return <Navigate to="/" replace={true} />
  }
  return <Outlet />
}
export default AdminAnthRoute
