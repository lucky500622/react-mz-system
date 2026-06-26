// 请求拦截器
import axios from 'axios'

import { message } from 'antd'

import { getStorage, removeStorage } from '@/utils/storage'

console.log(import.meta.env.VITE_API_BASE_URL)

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    // 内网穿透ngrok时，跳过ngrok警告页
    'ngrok-skip-browser-warning': 'true'
  }
})

request.interceptors.request.use(function (config) {
  // 携带token到请求头
  const token: string | null = getStorage('token') ?? null
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
}, function (error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  if (!error.response) {
    message.error('服务接口问题')
    return Promise.reject(error)
  }
  const { status } = error.response
  if (status === 500) {
    // 服务器错误
    console.log('服务器错误')
    message.error('服务器错误')
  }
  else if (status === 401) {
    // 登录过期，删除token并跳转登录页
    removeStorage('token')
    removeStorage('role')
    console.log('登录过期')
    message.error('登录过期，请重新登录')
    setTimeout(() => {
      window.location.href = '#/login'
    }, 1000)
  }
  else if (status === 402) {
    // 权限不足，不可操作，违规进入页面
    console.log('权限不足，不可操作，违规进入页面')
    message.error('权限不足，不可操作，违规进入页面')
    setTimeout(() => {
      window.location.href = '#/'
    }, 1000)
  }
  else if (status === 403) {
    window.location.href = '#/sto-handle'
  }
  else if (status === 404) {
    // 接口资源不存在
    console.log('资源不存在')
    message.error('服务接口问题')
  }
  return Promise.reject(error)
})

export default request
