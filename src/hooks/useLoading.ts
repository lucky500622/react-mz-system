import { useState, useCallback } from 'react'

export const useLoading = () => {
  const [loading, setLoading] = useState(false)
  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true)
    try { 
      return await fn()
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    run
  }
}