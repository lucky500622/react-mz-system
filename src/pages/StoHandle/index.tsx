import { useState, useEffect } from 'react'

import { Card, Modal, List, Typography, Tag, InputNumber, message } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import '@/pages/StoHandle/index.scss'
import { getWarehouseInfo, getHandleWarehouseInfo, addHandleWarehouse } from '@/api/warehouse'
import type { WarehouseInfoData, HandleWarehouseInfo } from '@/api/warehouse'
import { useLoading } from '@/hooks/useLoading'

const StoHandle = () => {
  // 刷新页面状态
  const [refresh, setRefresh] = useState(false)

  // 仓库列表
  const [warehouseList, setWarehouseList] = useState<WarehouseInfoData[]>([])
  // 经手仓库列表
  const [myWarehouseList, setMyWarehouseList] = useState<HandleWarehouseInfo[]>([])

  // 仓库序列号
  const [warehouseId, setWarehouseId] = useState<number>()
  // 添加经手仓库弹窗
  const [visible, setVisible] = useState(false)
  // 添加经手仓库
  const handleAdd = async () => {
    setVisible(true)
  }
  // 加载状态
  const {loading, run} = useLoading()
  // 确认添加经手仓库
  const handleAddConfirm = async () => {
    try {
      const res = await run(() => addHandleWarehouse({
        m_id: warehouseId
      }))
      if (res.code === 4015 || res.code === 4014) {
        message.error(res.message)
        return
      }
      message.success('添加成功')
      setRefresh(!refresh)
    } finally {
      setVisible(false)
      setWarehouseId(undefined)
    }
  }

  // 点击进入仓库事件
  const handleClick = (item: HandleWarehouseInfo) => {
    window.open(
      `/pro-upload/${item.m_id}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  useEffect(() => {
    // 初始化仓库、经手仓库列表
    const getInfo = async () => {
      const res = await getWarehouseInfo()
      const handleRes = await getHandleWarehouseInfo()
      setWarehouseList(res.data.warehouseInfo.filter(item => !item.exists_user_handle) || [])
      setMyWarehouseList(handleRes.data.handleWarehouseInfo || [])
    }
    getInfo()
    // 实例化广播通道
    const channel = new BroadcastChannel('channel-pro-upload')
    // 监听广播通道消息
    channel.onmessage = (event) => {
      if (event.data === 'exit-success') {
        setRefresh(!refresh)
      }
    }
    return () => {
      channel.close()
    }
  }, [refresh])
  
  return (
    <div className='ProUpload'>
      <div className="top-bar">
        <h2>产品上架</h2>
      </div>

      <div className="list">
        <List
          className="warehouse-ant-list"
          pagination={{ position: 'bottom', pageSize: 4 }}
          header={<div>无成员经手仓库列表</div>}
          bordered
          dataSource={warehouseList}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>[序列号：{item.m_id}]</Typography.Text>
              <Typography.Text mark>[仓库名：{item.warehouse_name}]</Typography.Text>
              <Typography.Text mark>[仓库类型：{item.warehouse_type}]</Typography.Text>
            </List.Item>
          )}
        />
        <List
          className="my-warehouse-ant-list"
          pagination={{ position: 'bottom', pageSize: 4 }}
          header={<div>经手仓库列表</div>}
          bordered
          dataSource={myWarehouseList}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>[序列号：{item.m_id}]</Typography.Text>
              <Typography.Text mark>[仓库名：{item.warehouse_name}]</Typography.Text>
              <Typography.Text mark>[仓库类型：{item.warehouse_type}]</Typography.Text>
            </List.Item>
          )}
        />
      </div>

      <div className="warehouse-card">
        <div className="warehouse-card-content">
          <Card title="添加经手仓库" variant="borderless" onClick={handleAdd}>
            <PlusCircleOutlined />
          </Card>
          {myWarehouseList.map((item) => {
            return (
              <Card key={item.m_id} title="仓库" variant="borderless" onClick={() => handleClick(item)}>
                <p>序列号:<Tag color="blue">{item.m_id}</Tag></p>
                <p>仓库名:<Tag color="blue">{item.warehouse_name}</Tag></p>
                <p>仓库类型:<Tag color="blue">{item.warehouse_type}</Tag></p>
              </Card>
            )
          })}
        </div>
      </div>

      <Modal
        className="ProUpload-modal"
        title="添加经手仓库"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleAddConfirm}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ 
          disabled: loading
        }}
      >
        <div className="modal-item">
          <span>仓库序列号：</span>
          <InputNumber placeholder="请输入仓库的序列号" value={warehouseId} onChange={(value) => setWarehouseId(value)} />
        </div>
      </Modal>
    </div>
  )
}

export default StoHandle
