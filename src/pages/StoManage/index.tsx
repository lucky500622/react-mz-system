import {useState, useCallback, useRef} from 'react'

import { Button, Input, InputNumber } from 'antd'

import '@/pages/StoManage/index.scss'
import StoTable from '@/pages/StoManage/components/StoTable'
import AddWarehouseModal from '@/pages/StoManage/components/AddWarehouseModal'
import type { AddWarehouseModalRef } from '@/pages/StoManage/components/AddWarehouseModal'

const StoManage = () => {
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    m_id: null,
    name: '',
    type: '',
    creator: ''
  })
  // 查询
  const handleQuery = () => {
    console.log(queryParams)
  }

  // 仓库弹窗变量
  const [visible, setVisible] = useState(false)
  // 新增仓库
  const handleAdd = () => {
    setVisible(true)
  }
  // 取消新增仓库弹窗
  const handleCancel = useCallback(() => {
    setVisible(false)
    addModalRef.current?.resetFields()
  }, [setVisible])
  // 确认新增仓库弹窗
  const handleOk = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  // 新增仓库弹窗引用
  const addModalRef = useRef<AddWarehouseModalRef>(null)

  return (
    <div>
      <div className="StoManage-top-bar">
        <h2>仓库管理</h2>
      </div>
      <div className="StoManage-function-bar">
        <div className="query-btn">
          <span className="query-btn-span">仓库序列号：</span>
          <InputNumber placeholder="请输入仓库序列号"
            value={queryParams.m_id} onChange={(e) => setQueryParams({...queryParams, m_id: e})} />
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
          <Button type="default" onClick={handleAdd}>新增仓库</Button>
        </div>
      </div>
      <StoTable />
      <AddWarehouseModal visible={visible} handleCancel={handleCancel} handleOk={handleOk} ref={addModalRef} />
    </div>
  )
}

export default StoManage
