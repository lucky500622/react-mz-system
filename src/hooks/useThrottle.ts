import { useRef } from 'react'

// 函数节流
type ThrottledFn<T> = T & {
  cancel: () => void
}
export const useThrottleFn = <T extends (...args: unknown[]) => void>(fn: T, delay: number): ThrottledFn<T> => {
  const timerRef = useRef<number | null>(null)
  const throttledFn = ((...args: Parameters<T>) => {
    if (timerRef.current) return                           
    fn.apply(this, args)
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