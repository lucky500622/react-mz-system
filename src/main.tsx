import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@/assets/styles/base.scss'
import router from '@/router/index'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
