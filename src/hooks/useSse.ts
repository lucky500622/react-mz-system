import { useEffect, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { getStorage } from '@/utils/storage'

const useSse = <T>({ onMessage }: { onMessage: Dispatch<SetStateAction<T>> }) => {
  const sourceRef = useRef<EventSource | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // 初始化连接
    const createSSE = () => {
      const source = new EventSource(
        `${import.meta.env.VITE_API_BASE_URL}/sse?user_name=${getStorage('user_name')}`
      )
      sourceRef.current = source

      sourceRef.current.onmessage = (e) => {
        if (e.data === 'ping') {
          console.log('SSE心跳正常，无需处理')
          return
        }
        try {
          const data = JSON.parse(e.data)
          onMessage(data)
        } catch (err) {
          console.error('SSE 解析失败', err)
        }
      }

      // 出错自动重连
      sourceRef.current.onerror = () => {
        console.log('SSE连接异常，准备重连')
        sourceRef.current.close()
        // 3秒后重连
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(createSSE, 3000)
      }
    }

    // 初始化连接
    if (!sourceRef.current) {
      createSSE()
      console.log('SSE连接已创建')
    }

    return () => {
      clearTimeout(timerRef.current)
      sourceRef.current?.close()
      sourceRef.current = null
    }
  }, [onMessage])
}

export default useSse