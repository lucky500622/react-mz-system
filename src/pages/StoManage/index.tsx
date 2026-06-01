import {useState} from 'react'

import { Button, Input } from 'antd'

import '@/pages/StoManage/index.scss'
import StoTable from '@/pages/StoManage/components/StoTable'

const StoManage = () => {
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    name: '',
    type: '',
    creator: ''
  })
  // 查询
  const handleQuery = () => {
    console.log(queryParams)
  }

  return (
    <div>
      <div className="StoManage-top-bar">
        <h2>仓库管理</h2>
      </div>
      <div className="StoManage-function-bar">
        <div className="query-btn">
          <span className="query-btn-span">仓库名称：</span>
          <Input placeholder="请输入仓库名称"
            value={queryParams.name} onChange={(e) => setQueryParams({...queryParams, name: e.target.value})} />
          <span className="query-btn-span">仓库类型：</span>
          <Input placeholder="请输入仓库类型"
            value={queryParams.type} onChange={(e) => setQueryParams({...queryParams, type: e.target.value})} />
          <span className="query-btn-span">创建人：</span>
          <Input placeholder="请输入创建人"
            value={queryParams.creator} onChange={(e) => setQueryParams({...queryParams, creator: e.target.value})} />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
        <div className="add-btn">
          <Button type="default">新增仓库</Button>
        </div>
      </div>
      <StoTable />
    </div>
  )
}

export default StoManage
