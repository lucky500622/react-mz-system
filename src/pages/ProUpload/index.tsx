import { useState, useEffect } from 'react'

import { Card, Modal, List, Typography, Tag } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import '@/pages/ProUpload/index.scss'
import { getWarehouseInfo, getHandleWarehouseInfo } from '@/api/warehouse'
import type { WarehouseInfoData, HandleWarehouseInfo } from '@/api/warehouse'

const ProUpload = () => {
  const [visible, setVisible] = useState(false)
  const [warehouseList, setWarehouseList] = useState<WarehouseInfoData[]>([])
  const [myWarehouseList, setMyWarehouseList] = useState<HandleWarehouseInfo[]>([])

  // 添加经手仓库
  const handleAdd = () => {

  }

  // 点击进入仓库事件
  const handleClick = (item: HandleWarehouseInfo) => {
    console.log(item)
  }

  useEffect(() => {
    // 初始化仓库、经手仓库列表
    const getInfo = async () => {
      const res = await getWarehouseInfo()
      const handleRes = await getHandleWarehouseInfo()
      setWarehouseList(res.data.warehouseInfo.filter(item => !item.warehouse_user_id) || [])
      setMyWarehouseList(handleRes.data.handleWarehouseInfo || [])
    }
    getInfo()
  }, [])
  
  return (
    <div className='ProUpload'>
      <div className="top-bar">
        <h2>产品上架</h2>
      </div>

      <div className="list">
        <List
          className="warehouse-ant-list"
          pagination={{ position: 'bottom', pageSize: 4 }}
          header={<div>仓库列表</div>}
          bordered
          dataSource={warehouseList}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>[序列号:{item.m_id}]</Typography.Text>
              <Typography.Text mark>[仓库名:{item.warehouse_name}]</Typography.Text>
              <Typography.Text mark>[仓库类型:{item.warehouse_type}]</Typography.Text>
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
              <Typography.Text mark>[序列号:{item.m_id}]</Typography.Text>
              <Typography.Text mark>[仓库名:{item.warehouse_name}]</Typography.Text>
              <Typography.Text mark>[仓库类型:{item.warehouse_type}]</Typography.Text>
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
        title="添加仓库"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
      </Modal>
    </div>
  )
}

export default ProUpload
