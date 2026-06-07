import { useState, useImperativeHandle } from 'react'

import { Modal, Button, Input } from 'antd'

import '@/components/styles/editDescription.scss'
import { useLoading } from '@/hooks/useLoading'
import type { ApiResponse } from '@/types/apiResponseType'

export type EditDescriptionRef = {
  open: (content: string, m_id: number) => void
}
const EditDescription = ({ref ,editFn, successCallback, title } : 
  {
    ref: React.Ref<EditDescriptionRef>,
    editFn: (data: {m_id: number, description: string}) => Promise<ApiResponse<null>>,
    successCallback: () => void,
    title: string,
  }) => {
  // 详情弹窗配置
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 详情弹窗内容
  const [detailContent, setDetailContent] = useState('')

  // 编辑描述弹窗配置
  const [editDescriptionModalOpen, setEditDescriptionModalOpen] = useState(false)
  const [detailId, setDetailId] = useState(0)
  const handleEditDescriptionClick = async () => {
    setEditDescriptionModalOpen(true)
  }
  // 编辑描述弹窗内容
  const [editDetailContent, setEditDetailContent] = useState('')
  // 编辑描述弹窗提交事件
  const {loading: editDescriptionLoading, run: editDescriptionRun} = useLoading()
  const handleEditDescriptionSubmit = async () => {
    try {
      await editDescriptionRun(() => {
        return editFn({ m_id: detailId, description: editDetailContent })
      })
      successCallback()
    } finally {
      setEditDetailContent('')
      setEditDescriptionModalOpen(false)
      setIsModalOpen(false)
    }
  }

  // 向外暴露打开方法
  useImperativeHandle(ref, () => ({
    open: (content: string, m_id: number) => {
      setDetailContent(content)
      setDetailId(m_id)
      setIsModalOpen(true)
    }
  }))

  return (
    <div>
      <Modal
        title={`${title}描述`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="EditDescription-detail-modal"
      >
        <p>{detailContent || `暂无${title}描述`}
          <Button size="small" type="dashed" className="edit-btn"
            onClick={handleEditDescriptionClick}>编辑描述</Button>
        </p>
      </Modal>
      <Modal
        title={`编辑${title}描述`}
        open={editDescriptionModalOpen}
        onCancel={() => setEditDescriptionModalOpen(false)}
        footer={null}
        className="EditDescription-edit-modal"
      >
        <Input.TextArea value={editDetailContent} onChange={(e) => setEditDetailContent(e.target.value)}
          rows={3} placeholder={`请输入${title}描述`} maxLength={200} disabled={editDescriptionLoading} />
        <Button type="primary" onClick={() => handleEditDescriptionSubmit()}>提交</Button>
      </Modal>
    </div>
  )
}

export default EditDescription
