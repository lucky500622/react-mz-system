// 请求拦截器

import axios from 'axios'

import { message } from 'antd'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT)
})

request.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  if (error.response.status === 500) {
    console.log('服务器错误')
    message.error('服务器错误')
  }
  if (error.response.status === 404) {
    console.log('资源不存在')
    message.error('服务接口问题')
  }
  return Promise.reject(error)
})

export default request
