import { useState, useEffect, useRef } from 'react'

// 值防抖
export const useDebounceValue = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// 函数防抖
type DebouncedFn<T> = T & {
  cancel: () => void
}
// 允许any，适配任意参数类型的代替方案
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounceFn = <T extends (...args: any[]) => void | Promise<void>>
  (fn: T, delay: number): DebouncedFn<T> => {
  const timerRef = useRef<number | null>(null)
  const debouncedFn = ((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      fn(...args)
      timerRef.current = null
    }, delay)
  }) as DebouncedFn<T>

  // 手动取消防抖
  debouncedFn.cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return debouncedFn
}