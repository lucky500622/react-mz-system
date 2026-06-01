import {useState} from 'react'

import { Button, Input } from 'antd'

import '@/pages/ProManage/index.scss'
import ProTable from '@/pages/ProManage/components/ProTable'

const ProManage = () => {
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    name: '',
    type: ''
  })
  // 查询
  const handleQuery = () => {
    console.log(queryParams)
  }

  return (
    <div>
      <div className="ProManage-top-bar">
        <h2>产品管理</h2>
      </div>
      <div className="ProManage-function-bar">
        <div className="query-btn">
          <span className="query-btn-span">产品名称：</span>
          <Input placeholder="请输入产品名称"
            value={queryParams.name} onChange={(e) => setQueryParams({...queryParams, name: e.target.value})} />
          <span className="query-btn-span">产品类型：</span>
          <Input placeholder="请输入产品类型"
            value={queryParams.type} onChange={(e) => setQueryParams({...queryParams, type: e.target.value})} />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
        <div className="add-btn">
          <Button type="default">新增产品</Button>
        </div>
      </div>
      <ProTable />
    </div>
  )
}

export default ProManage
