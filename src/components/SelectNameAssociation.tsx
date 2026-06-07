import { useState, useRef, useEffect, use } from 'react'

import { AutoComplete } from 'antd'

import type { ApiResponse } from '@/types/apiResponseType'
import { useDebounceFn } from '@/hooks/useDebounce'

// 若该组件外层为ant的form.Item，需要设置id属性，故添加id属性
const SelectNameAssociation = ({ value, onChange, placeholder, SelectFn, id = 'select'} :
  {
    value?: string, 
    onChange?: (text: string) => void, 
    placeholder: string ,
    SelectFn: (text: string) => Promise<ApiResponse<{name: {name: string}[]}>>
    id?: string
  }) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<{ label: string, value: string }[]>([])

  // 刷新事件
  const handleChange = async (text: string) => {
    if (!text) {
      setOptions([])
      return
    }
    const res = await SelectFn(text)
    setOptions(res.data.name.map(item => ({ label: item.name, value: item.name })))
  }
  // 防抖刷新事件
  const debounceRef = useRef(useDebounceFn(handleChange, 500))

  useEffect(() => {
    const cancel = debounceRef.current.cancel
    return () => {
      cancel()
    }
  }, [])

  return (
    <AutoComplete
      id={id}
      style={{ width: '130px' }}
      value={value}
      onChange={onChange}
      onSearch={(text) => debounceRef.current(text)}
      open={open}
      onOpenChange={setOpen}
      options={options}
      placeholder={placeholder}
    />
  )
}

export default SelectNameAssociation