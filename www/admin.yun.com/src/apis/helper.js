import service from './http'
import qs from 'qs'
// TODO CancelToken 
export const get = (url, params) => {
  return service.request({
    method: 'get',
    url: url,
    params: params
  })
}

export const post = (url, data) => {
  return service.request({
    method: 'post',
    url: url,
    data: qs.stringify(data)
  })
}

export const postJSON = (url, data) => {
  return service.request({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}