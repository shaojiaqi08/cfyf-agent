import axios from 'axios'
// import store from '../store'
import { statusCode, responseCode, notification } from './code'
import { addPending, removePending, REPEATSYMBOL } from './cancel-token-helper'

let overdueFlag = false

const service = axios.create({
  timeout: 60 * 1000,
  baseURL: process.env.VUE_APP_API_URL
})

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

service.interceptors.request.use(config => {
  const token = window.localStorage.getItem('Agent-Authorization')
  if (token) {
    config.headers['Agent-Authorization'] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.request.use(config => {
  // if (store.state.userInfo.token) {
  //   config.headers['token'] = store.state.userInfo.token
  //   // config.headers['Agent-Authorization'] = store.state.userInfo.agent_token
  // }

  removePending(config, () => addPending(config))
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  removePending(response.config)
  const resCode = response.status
  if (resCode === responseCode.SUCCESS) {
    const code = response.data.code
    const data = response.data
    const message = response.data.message
    switch (code) {
      case statusCode.PASS:
      case statusCode.NOCONTENT:
        return Promise.resolve(data.data)
      case statusCode.OVERDUE:
        if (!overdueFlag) {
          overdueFlag = true
          notification('OVERDUE')
          setTimeout(() => overdueFlag = false, 1000)
        }
        break
      case statusCode.CODE_ERROR:
        notification('ERROR', message)
        break
      case statusCode.PROPOSAL_ERROR_1:
      case statusCode.PROPOSAL_ERROR_2:
        console.log('proposal error')
        break
      default:
        notification('ERROR', message)
    }
    return Promise.reject(response.data)
  }
},
error => {
  if (!error.response) {
    if (error.message === REPEATSYMBOL) {
      return console.log('取消重复请求')
    }
    if (error.message.includes('timeout')) {
      notification('TIMEOUT')
    } else {
      notification('DISNET')
    }
    return Promise.reject(error)
  }

  const status = error.response.status
  switch (status) {
    case responseCode.SERVERERROR:
      notification('SERVERERROR')
      break
    case responseCode.NOTFOUND:
      notification('NOTFOUND')
      break
    default:
      notification('ERROR', error)
  }
  return Promise.reject(error)
})

export default service