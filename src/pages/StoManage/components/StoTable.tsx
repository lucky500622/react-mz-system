import {useState, useEffect, useImperativeHandle, memo, useRef} from 'react'

import dayjs from 'dayjs'
import { Table, Button, Modal, Tag, Form, Input, message } from 'antd'
import type { FormProps } from 'antd'

import '@/pages/StoManage/components/styles/stoTable.scss'
import EditDescription from '@/components/EditDescription'
import type { EditDescriptionRef } from '@/components/EditDescription'
import { editWarehouse, editWarehouseDescription } from '@/api/warehouse'
import { useLoading } from '@/hooks/useLoading'
import type { WarehouseInfoData } from '@/api/warehouse'

export type StoTableRef = {
  refreshData: () => void
}
import { getWarehouseInfo, deleteWarehouse } from '@/api/warehouse'

const StoTable = memo(({ref, queryDataSource}
  : {ref: React.Ref<StoTableRef>, queryDataSource?: WarehouseInfoData[] | null}) => {
  // 表格列配置
  const columns = [
    {
      title: '序列号',
      dataIndex: 'm_id',
      key: 'm_id',
      width: 100
    },
    {
      title: '仓库原名',
      dataIndex: 'warehouse_name_ed',
      key: 'warehouse_name_ed',
      render: (val: string | null) => {
        if (!val) return '/'
        return val
      }
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouse_name',
      key: 'warehouse_name'
    },
    {
      title: '仓库类型',
      dataIndex: 'warehouse_type',
      key: 'warehouse_type',
      render: ({ warehouse_type }: { warehouse_type: string }) => {
        return (
          <Tag color={'blue'}>{warehouse_type}</Tag>
        )
      }
    },
    {
      title: '仓库状态',
      dataIndex: 'exists_list_product',
      key: 'exists_list_product',
      render: ({ exists_list_product, exists_user_handle }:
         { exists_list_product: boolean, exists_user_handle: boolean }) => {
        return (
          <div>
            <Tag style={{margin: '0 5px 5px 0'}} color={exists_list_product? 'black' : 'gray'}>
              {exists_list_product? '存在上架产品' : '不存在上架产品'}
            </Tag>
            <Tag color={exists_user_handle? 'black' : 'gray'}>
              {exists_user_handle? '存在经手成员' : '不存在经手成员'}
            </Tag>
          </div>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: '创建时间',
      dataIndex: 'warehouse_create_time',
      key: 'warehouse_create_time',
      render: (val: string) => {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '仓库描述',
      key: 'warehouse_description',
      width: 100,
      render: ({ warehouse_description, m_id }: { warehouse_description: string, m_id: number }) => {
        return (
          <div>
            <Button type="link" size="small" 
              onClick={() => handleDetail(warehouse_description, m_id)}>详情</Button>
          </div>
        )
      } 
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: ({ exists_list_product, exists_user_handle, m_id }: 
        { exists_list_product: boolean, exists_user_handle: boolean, m_id: number }) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => handleEdit(m_id)}>编辑</Button>
            <Button type="link" size="small" disabled={exists_list_product || exists_user_handle}
              onClick={() => handleDelete(m_id)}>删除</Button>
          </div>
        )
      } 
    }
  ]
  // 表格分页配置
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // 表格数据
  const [dataSource, setDataSource] = useState<WarehouseInfoData[]>([])

  // 编辑描述弹窗引用
  const editDescriptionRef = useRef<EditDescriptionRef>(null)
  // 详情点击事件
  const handleDetail = (item: string, id: number) => {
    editDescriptionRef.current?.open(item, id)
  }
  // 编辑描述成功事件
  const handleEditSuccess = () => {
    message.success('编辑成功')
    setRefresh(!refresh)
  }
  
  // 编辑点击事件
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editId, setEditId] = useState(0)
  const handleEdit = (id: number) => {
    setEditId(id)
    setEditModalOpen(true)
  }
  // 编辑表单loading状态
  const {loading: editLoading, run: editRun} = useLoading()
  // 编辑表单提交事件
  type FieldType = {
    warehouse_name: string
  }
  const [form] = Form.useForm()
  const onEditFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const data = {
      m_id: editId,
      warehouse_name: values.warehouse_name
    }
    try {
      const res = await editRun(() => editWarehouse(data))
      // 仓库名已存在
      if (res.code === 4011) {
        message.error(res.message)
        return
      }
      // 仓库名已被编辑过
      if (res.code === 4012) {
        message.error(res.message)
        return
      }
      message.success('编辑成功')
      setRefresh(!refresh)
    } finally {
      setEditId(0)
      form.resetFields()
      setEditModalOpen(false)
    }
  }
  const onEditFinishFailed: FormProps<FieldType>['onFinishFailed'] = (values) => {
    console.log(values)
  }

  // 删除点击事件
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const handleDelete = (id: number) => {
    setDeleteModalOpen(true)
    setDeleteId(id)
  }
  // 删除确认事件
  const {loading: deleteLoading, run: deleteRun} = useLoading()
  const handleDeleteConfirm = async () => {
    // 提交删除请求
    try {
      const res = await deleteRun(() => deleteWarehouse({m_id: deleteId}))
      if (res.code == 4013) {
        message.error(res.message)
        return
      }
      if (res.code == 4014) {
        message.error(res.message)
        return
      }
      message.success('删除成功')
    } finally {
      setRefresh(!refresh)
      setDeleteModalOpen(false)
      setDeleteId(0)
    }
  }

  // 刷新表格状态
  const [refresh, setRefresh] = useState(false)
  // 向外暴露刷新表格数据方法
  useImperativeHandle(ref, () => ({
    refreshData: () => {
      setRefresh(!refresh)
    }
  }))
  
  useEffect(() => {
    const getInfo = async () => {
      const res = await getWarehouseInfo()
      setDataSource(res.data?.warehouseInfo ?? [])
    }
    getInfo()
  }, [refresh])

  useEffect(() => {
    setDataSource(queryDataSource ?? [])
  }, [queryDataSource])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(record) => record.m_id} pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: dataSource.length,
        onChange: (page) => {
          setCurrentPage(page)
        }
      }} />
      <EditDescription ref={editDescriptionRef} editFn={editWarehouseDescription}
        successCallback={handleEditSuccess} title="仓库" />
      <Modal 
        className="StoTable-edit-modal"
        title="仓库编辑"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <p className="warning-name-edit">**注：仓库名仅可修改一次**</p>
        <Form
          form={form}
          className="form"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
          style={{ maxWidth: 600 }}
          onFinish={onEditFinish}
          onFinishFailed={onEditFinishFailed}
          disabled={editLoading}
          autoComplete="off"
        >
          <Form.Item<FieldType> 
            name="warehouse_name" label="仓库重命名"
            rules={[{ required: true, min: 2, max: 20, message: '请输入2-20个字符的仓库名称' },
              {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '仓库名称只能包含汉字、字母和数字'}]}>
            <Input placeholder="请输入仓库名称" />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        className="StoTable-delete-modal"
        title="删除仓库"
        okText="确认删除"
        cancelText="取消"
        open={deleteModalOpen}
        onOk={() => handleDeleteConfirm()}
        onCancel={() => setDeleteModalOpen(false)}
        loading={deleteLoading}
      >
        <p>**注：删除后该仓库下的所有产品也将被删除，且无法恢复!**</p>
      </Modal>
    </div>
  )
})

export default StoTable
