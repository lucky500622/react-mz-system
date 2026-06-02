import {useState, useCallback, useRef} from 'react'

import { Button, Input, InputNumber } from 'antd'

import '@/pages/ProManage/index.scss'
import ProTable from '@/pages/ProManage/components/ProTable'
import AddProductModal from '@/pages/ProManage/components/AddProductModal'
import type { AddProductModalRef } from '@/pages/ProManage/components/AddProductModal'

const ProManage = () => {
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    m_id: null,
    name: '',
    type: ''
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

  // 新增产品弹窗引用
  const addModalRef = useRef<AddProductModalRef>(null)

  return (
    <div>
      <div className="ProManage-top-bar">
        <h2>产品管理</h2>
      </div>
      <div className="ProManage-function-bar">
        <div className="query-btn">
          <span className="query-btn-span">产品序列号：</span>
          <InputNumber placeholder="请输入产品序列号"
            value={queryParams.m_id} onChange={(e) => setQueryParams({...queryParams, m_id: e})} />
          <span className="query-btn-span">产品名称：</span>
          <Input placeholder="请输入产品名称"
            value={queryParams.name} onChange={(e) => setQueryParams({...queryParams, name: e.target.value})} />
          <span className="query-btn-span">产品类型：</span>
          <Input placeholder="请输入产品类型"
            value={queryParams.type} onChange={(e) => setQueryParams({...queryParams, type: e.target.value})} />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
        <div className="add-btn">
          <Button type="default" onClick={handleAdd}>新增产品</Button>
        </div>
      </div>
      <ProTable />
      <AddProductModal ref={addModalRef} visible={visible} handleCancel={handleCancel} handleOk={handleOk} />
    </div>
  )
}

export default ProManage
