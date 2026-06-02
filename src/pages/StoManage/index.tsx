import {useState, useCallback, useRef} from 'react'

import { Button, Input, InputNumber, Select } from 'antd'

import '@/pages/StoManage/index.scss'
import StoTable from '@/pages/StoManage/components/StoTable'
import AddWarehouseModal from '@/pages/StoManage/components/AddWarehouseModal'
import type { AddWarehouseModalRef } from '@/pages/StoManage/components/AddWarehouseModal'
import type { StoTableRef } from '@/pages/StoManage/components/StoTable'

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
  // 新增仓库弹窗关闭
  const handleClose = useCallback(() => {
    setVisible(false)
    addModalRef.current?.resetFields()
  }, [setVisible])

  // 新增仓库弹窗引用
  const addModalRef = useRef<AddWarehouseModalRef>(null)
  // 仓库表格引用
  const tableRef = useRef<StoTableRef>(null)
  // 刷新仓库表格数据
  const handleRefresh = useCallback(() => {
    tableRef.current?.refreshData()
  }, [tableRef])

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
          <Select placeholder="请选择仓库类型" className="type-select"
            options={[
              { value: '常温仓', label: '常温仓' },
              { value: '冷藏仓', label: '冷藏仓' },
              { value: '冷冻仓', label: '冷冻仓' },
              { value: '干货仓', label: '干货仓' },
              { value: '百货仓', label: '百货仓' },
              { value: '家电仓', label: '家电仓' },
              { value: '服装仓', label: '服装仓' },
              { value: '其他仓储', label: '其他仓储' }
            ]}
            onChange={(e) => setQueryParams({...queryParams, type: e})}
          />
          <span className="query-btn-span">创建人：</span>
          <Input placeholder="请输入创建人"
            value={queryParams.creator} onChange={(e) => setQueryParams({...queryParams, creator: e.target.value})} />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
        <div className="add-btn">
          <Button type="default" onClick={handleAdd}>新增仓库</Button>
        </div>
      </div>
      <StoTable ref={tableRef} />
      <AddWarehouseModal handleRefresh={handleRefresh}
        visible={visible} handleClose={handleClose} ref={addModalRef} />
    </div>
  )
}

export default StoManage
