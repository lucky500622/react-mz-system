import { useEffect, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { getStorage } from '@/utils/storage'
import { message } from 'antd'

// 重连延迟时间配置
const BASE_DELAY = 1000  
const MAX_DELAY = 30000  

const useSse = <T>({ onMessage }: { onMessage: Dispatch<SetStateAction<T>> }) => {
  const sourceRef = useRef<EventSource | null>(null)
  const timerRef = useRef<number | null>(null)
  const retryCountRef = useRef<number>(0)

  useEffect(() => {
    // 初始化连接
    const createSSE = () => {
      const source = new EventSource(
        `${import.meta.env.VITE_API_BASE_URL}/sse?user_name=${getStorage('user_name')}`
      )
      sourceRef.current = source
      
      sourceRef.current.onopen = () => {
        retryCountRef.current = 0
        console.log('SSE连接成功，重试计数已重置')
      }

      sourceRef.current.onmessage = (e) => {
        if (e.data === 'ping') {
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

        // 计算重连延迟时间
        const exponentialDelay = BASE_DELAY * Math.pow(2, retryCountRef.current)
        retryCountRef.current += 1
        const jitter = Math.random() * 1000
        const delay = Math.min(exponentialDelay + jitter, MAX_DELAY)
        if (delay === MAX_DELAY) {
          message.error('SSE连接异常，请您稍后重试或刷新网页，抱歉')
        }
        console.log(`SSE第${retryCountRef.current}次重连，等待${(delay / 1000).toFixed(1)}秒`)
        // 设置重连定时器
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(createSSE, delay)
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