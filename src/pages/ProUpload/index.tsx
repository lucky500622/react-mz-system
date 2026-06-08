import { Button } from 'antd'

import '@/pages/ProUpload/index.scss'

const ProUpload = () => {
  return (
    <div className='ProUpload'>
      <div className="top-bar">
        <h2>产品上架</h2>
      </div>
      <div className="function-bar">
        <Button type="default">添加仓库</Button>
      </div>
    </div>
  )
}

export default ProUpload
