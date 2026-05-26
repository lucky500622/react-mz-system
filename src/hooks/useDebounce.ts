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
export const useDebounceFn = <T extends (...args: unknown[]) => void>(fn: T, delay: number): DebouncedFn<T> => {
  const timerRef = useRef<number | null>(null)
  const debouncedFn = ((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      fn.apply(this, args)
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