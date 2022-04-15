// @ts-nocheck
import axios from 'axios'
import { Toast } from 'react-vant'

const MODE = import.meta.env.MODE // 环境变量

axios.defaults.baseURL =
  MODE === 'development' ? '/api' : 'monkee.online:7009/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${
  localStorage.getItem('token') || null
}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use((res) => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code !== 200) {
    if (res.data.msg) Toast.info(res.data.msg)
    if (res.data.code === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }
  return res.data
})

export default axios
