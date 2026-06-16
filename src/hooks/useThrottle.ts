import { useRef } from 'react'

// 函数节流
type ThrottledFn<T> = T & {
  cancel: () => void
}
// 允许any，适配任意参数类型的代替方案
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottleFn = <T extends (...args: any[]) => void>(fn: T, delay: number): ThrottledFn<T> => {
  const timerRef = useRef<number | null>(null)
  const throttledFn = ((...args: Parameters<T>) => {
    if (timerRef.current) return                           
    fn(...args)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
    }, delay)
  }) as ThrottledFn<T>

  // 手动取消节流
  throttledFn.cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return throttledFn
}