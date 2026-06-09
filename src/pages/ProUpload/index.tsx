import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const ProUpload = () => {
  // 从路由参数中获取仓库序列号
  const { m_id } = useParams()


  useEffect(() => {
    console.log(m_id)
  }, [m_id])

  return (
    <div>
      <h1>产品上架</h1>
    </div>
  )
}

export default ProUpload
