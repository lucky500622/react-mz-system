import {useState, useEffect} from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'

import '@/components/styles/loading.scss'

const Loading = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 400)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    show && (
      <Result
        className="Loading"
        icon={<SmileOutlined />}
        title="加载中请稍后......"
      />
    )
  )
}

export default Loading
