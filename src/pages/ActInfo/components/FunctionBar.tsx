import { useState } from 'react'

import { Input, Button } from 'antd'

import '@/pages/ActInfo/components/styles/functionBar.scss'

type FunctionBarConfig = {
  name: string,
  operator: string,
  type: string
}

const FunctionBar = ({config} : {config: FunctionBarConfig}) => {
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    name: '',
    operator: '',
    type: ''
  })
  // 查询
  const handleQuery = () => {
    console.log(queryParams)
  }

  return (
    <div>
      <div className="FunctionBar-function-bar">
        <div className="query-btn">
          <span className="query-btn-span">{config.name}：</span>
          <Input placeholder={`请输入${config.name}`} value={queryParams.name}
            onChange={(e) => setQueryParams({...queryParams, name: e.target.value})} />
          <span className="query-btn-span">{config.operator}：</span>
          <Input placeholder={`请输入${config.operator}`} value={queryParams.operator}
            onChange={(e) => setQueryParams({...queryParams, operator: e.target.value})} />
          <span className="query-btn-span">{config.type}：</span>
          <Input placeholder={`请输入${config.type}`} value={queryParams.type}
            onChange={(e) => setQueryParams({...queryParams, type: e.target.value})} />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
      </div>
    </div>
  )
}

export default FunctionBar