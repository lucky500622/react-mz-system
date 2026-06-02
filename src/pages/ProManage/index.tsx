import {useState, useCallback, useRef} from 'react'

import { Button, Input, InputNumber, Select } from 'antd'

import '@/pages/ProManage/index.scss'
import ProTable from '@/pages/ProManage/components/ProTable'
import AddProductModal from '@/pages/ProManage/components/AddProductModal'
import type { AddProductModalRef } from '@/pages/ProManage/components/AddProductModal'
import type { ProTableRef } from '@/pages/ProManage/components/ProTable'

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

  // 产品弹窗状态
  const [visible, setVisible] = useState(false)
  // 新增产品
  const handleAdd = () => {
    setVisible(true)
  }
  // 新增产品弹窗关闭
  const handleClose = useCallback(() => {
    setVisible(false)
    addModalRef.current?.resetFields()
  }, [setVisible])

  // 新增产品弹窗引用
  const addModalRef = useRef<AddProductModalRef>(null)
  // 产品表格引用
  const tableRef = useRef<ProTableRef>(null)
  // 刷新表格数据
  const handleRefresh = useCallback(() => {
    tableRef.current?.handleRefresh()
  }, [tableRef])
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
          <Select placeholder="请选择产品类型" className="type-select"
            options={[
              { value: '食品生鲜', label: '食品生鲜' },
              { value: '日用百货', label: '日用百货' },
              { value: '家电数码', label: '家电数码' },
              { value: '服饰鞋帽', label: '服饰鞋帽' },
              { value: '母婴用品', label: '母婴用品' },
              { value: '美妆护肤', label: '美妆护肤' },
              { value: '家居家纺', label: '家居家纺' },
              { value: '文体玩具', label: '文体玩具' },
              { value: '医疗器械', label: '医疗器械' },
              { value: '其他商品', label: '其他商品' }
            ]}
            onChange={(e) => setQueryParams({...queryParams, type: e})}
          />
          <Button type="default" onClick={handleQuery}>查询</Button>
        </div>
        <div className="add-btn">
          <Button type="default" onClick={handleAdd}>新增产品</Button>
        </div>
      </div>
      <ProTable ref={tableRef} />
      <AddProductModal ref={addModalRef} visible={visible} handleClose={handleClose} handleRefresh={handleRefresh} />
    </div>
  )
}

export default ProManage
