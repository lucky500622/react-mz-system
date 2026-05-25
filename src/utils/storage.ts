// 本地存储工具

// 设置本地存储
export const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

// 获取本地存储
export const getStorage = <T>(key: string) => {
  const item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item) as T
  }
}

// 删除本地存储
export const removeStorage = (key: string) => {
  const item = localStorage.getItem(key)
  if (item) {
    localStorage.removeItem(key)
  }
}
