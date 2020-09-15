// 在同一个相同请求还没返回之前再次请求，通过拦截器取消前一次请求，只保留最后一次请求
// 通过 pendingRequest 数组进行管理，每个数组对象包括key唯一请求标识以及 func 保存着该次请求所缓存的 cancelToken 取消请求函数
// 在发出相同请求或者请求成功后，把当前请求从 pendingRequest 数组中剔除

import axios from 'axios'

const CancelToken = axios.CancelToken
let pendingRequest = []
export const REPEATSYMBOL = 'repeatRequest'

export function keyFactory(config) {
  let { method, params, data, url } = config
  params = JSON.stringify(params) || ''
  data = JSON.stringify(data) || ''
  return `${method}_${params}_${data}_${url}`
}

function removeString(string, target = process.env.VUE_APP_API_URL) {
  return string.replace(target, '')
}

export function removePending(config, cb) {
  for (let i in pendingRequest) {
    if (pendingRequest[i].key === removeString(keyFactory(config))) {
      cb && pendingRequest[i].func()
      pendingRequest.splice(i, 1)
    }
  }

  if (cb) cb()
}

export function addPending(config) {
  config.cancelToken = new CancelToken(resolve => {
    pendingRequest.push({ key: removeString(keyFactory(config)), func: resolve.bind(null, REPEATSYMBOL) })
  })
}

export function cancelAllPending() {
  pendingRequest.forEach(i => i.func())
}
