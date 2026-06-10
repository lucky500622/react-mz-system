// 请求拦截器

import axios from 'axios'

import { message } from 'antd'

import { getStorage, removeStorage } from '@/utils/storage'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT)
})

request.interceptors.request.use(function (config) {
  // 携带token到请求头
  const token: string | null = getStorage('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
}, function (error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  if (error.response.status === 500) {
    // 服务器错误
    console.log('服务器错误')
    message.error('服务器错误')
  }
  if (error.response.status === 401) {
    // 登录过期，删除token并跳转登录页
    removeStorage('token')
    window.location.href = '/login'
    console.log('登录过期')
    message.error('登录过期，请重新登录')
  }
  if (error.response.status === 403) {
    window.location.href = '/sto-handle'
  }
  if (error.response.status === 404) {
    // 接口资源不存在
    console.log('资源不存在')
    message.error('服务接口问题')
  }
  return Promise.reject(error)
})

export default request
