import { useState, useEffect, memo } from 'react'

import { Card, Modal, Input, message, Tag, Button } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import '@/pages/ProUpload/components/messageBoard.scss'
import { addTodo, getTodo, deleteTodo } from '@/api/todo'
import type { Todo } from '@/api/todo'
import { useLoading } from '@/hooks/useLoading'

const MessageBoard = memo(({ id }: { id: number }) => {
  // 待办事项列表
  const [todoList, setTodoList] = useState<Todo[]>([])
  // 刷新状态
  const [refresh, setRefresh] = useState(false)

  // 弹窗状态
  const [open, setOpen] = useState(false)
  // 加载状态
  const { loading: addLoading, run: addRun } = useLoading()
  // 添加待办事项
  const handleAddTodo = async () => {
    setOpen(true)
  }
  // 待办事项内容
  const [todoText, setTodoText] = useState('')
  // 添加待办事项提交
  const handleSubmit = async () => {
    try {   
      await addRun(() => addTodo({
        warehouse_m_id: id,
        todo_content: todoText
      }))
      message.success('添加成功')
      setRefresh(!refresh)
    } finally {
      setOpen(false)
    }
  }

  // 加载状态
  const { loading: deleteLoading, run: deleteRun } = useLoading()
  // 删除待办事项id
  const [deleteMId, setDeleteMId] = useState<number>(0)
  // 删除待办事项
  const handleDelete = async (m_id: number) => {
    setDeleteMId(m_id)
    setOpenDelete(true)
  }
  // 删除待办事项弹窗状态
  const [openDelete, setOpenDelete] = useState(false)
  // 删除待办事项确认
  const handleDeleteConfirm = async () => {
    try {
      await deleteRun(() => deleteTodo({
        warehouse_m_id: id,
        m_id: deleteMId
      }))
      message.success('删除成功')
      setRefresh(!refresh)
    } finally {
      setOpenDelete(false)
    }

  }

  useEffect(() => {
    const getInfo = async () => {
      const res = await getTodo({warehouse_m_id: id})
      setTodoList(res.data?.todoList ?? [])
    }
    getInfo()
  }, [id, refresh])

  return (
    <div className="MessageBoard">
      <Card className="card-label" onClick={handleAddTodo}>
        <span className="label-text">添加待办事项</span>
        <PlusOutlined />
      </Card>
      {todoList.map((item, index) => (
        <Card key={item.m_id}>
          <Tag>待办事项 {index + 1}</Tag>
          <div className="todo-content">
            {item.todo_content}
          </div>

          <div className="todo-cover" onClick={() => handleDelete(item.m_id)}>
            <DeleteOutlined />
          </div>
        </Card>
      ))}

      <Modal
        className="MessageBoard-modal"
        title="添加待办事项"
        open={open}
        onCancel={() => {
          setOpen(false)
        }}
        okButtonProps={{
          disabled: addLoading
        }}
        footer={
          <div>
            <Button type="default" onClick={() => setTodoText('')} style={{marginRight: 10}}>
              清空
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              添加
            </Button>
          </div>
        }
      >
        <Input.TextArea   
          value={todoText}
          onChange={(e) => {
            setTodoText(e.target.value)
          }}
          rows={4} minLength={1} maxLength={200} placeholder="请输入待办事项" />
      </Modal>

      <Modal 
        className="MessageBoard-modal"
        title="删除待办事项"
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false)
        }}
        onOk={handleDeleteConfirm}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{
          disabled: deleteLoading
        }}
      >
      </Modal>
    </div>
  )
})

export default MessageBoard
