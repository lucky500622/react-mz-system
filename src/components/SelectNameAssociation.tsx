import { useState, useRef } from 'react'

import { AutoComplete } from 'antd'

import type { ApiResponse } from '@/types/apiResponseType'
import { useDebounceFn } from '@/hooks/useDebounce'

const SelectNameAssociation = ({ value, onChange, placeholder, SelectFn} :
  {
    value?: string, 
    onChange?: (text: string) => void, 
    placeholder: string ,
    SelectFn: (text: string) => Promise<ApiResponse<{name: {name: string}[]}>>
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

  return (
    <AutoComplete
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