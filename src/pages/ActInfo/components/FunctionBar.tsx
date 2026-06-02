import { useState } from 'react'

import { Input, Button, InputNumber } from 'antd'

import '@/pages/ActInfo/components/styles/functionBar.scss'

type FunctionBarConfig = {
  issue_m_id: string,
  m_id: string,
  name: string,
  operator: string,
  type: string
}

const FunctionBar = ({config} : {config: FunctionBarConfig}) => {
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    issue_m_id: null,
    m_id: null,
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
          <span className="query-btn-span">{config.issue_m_id}：</span>
          <InputNumber placeholder={`请输入${config.issue_m_id}`} value={queryParams.issue_m_id}
            onChange={(e) => setQueryParams({...queryParams, issue_m_id: e})} />
          <span className="query-btn-span">{config.m_id}：</span>
          <InputNumber placeholder={`请输入${config.m_id}`} value={queryParams.m_id}
            onChange={(e) => setQueryParams({...queryParams, m_id: e})} />
          <span className="query-btn-span">{config.name}：</span>
          <Input placeholder={`请输入${config.name}`} value={queryParams.name}
            onChange={(e) => setQueryParams({...queryParams, name: e.target.value})} />
          <span className="query-btn-span">{config.operator}：</span>
          <Input placeholder={`请输入${config.operator}`} value={queryParams.operator}
            onChange={(e) => setQueryParams({...queryParams, operator: e.target.value})} />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
      </div>
    </div>
  )
}

export default FunctionBar