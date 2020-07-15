import { Notification } from 'element-ui'

export const statusCode = {
  OVERDUE: 400002,
  PASS: 0,
  PROPOSAL_ERROR_1: 700020,
  PROPOSAL_ERROR_2: 7000014,
  CODE_ERROR: 100003
}

export const responseCode = {
  SUCCESS: 200,
  NOCONTENT: 204,
  FAIL: 400,
  SERVERERROR: 500,
  NOTFOUND: 404,
  NOPERMISSION: 403,
  RELOGIN: 401
}

export const notions = {
  OVERDUE: {
    title: '登录过期',
    type: 'error',
    message: '用户登录过期，请重新登录'
  },
  ERROR: {
    title: '请求错误',
    type: 'error',
    message: null
  },
  TIMEOUT: {
    title: '网络错误',
    type: 'error',
    message: '请求超时，请检查互联网连接'
  },
  DISNET: {
    title: '网络错误',
    type: 'error',
    message: '请检查网络是否已连接'
  },
  SERVERERROR: {
    title: '请求错误',
    type: 'error',
    message: '服务器内部错误'
  },
  NOTFOUND: {
    title: '请求错误',
    type: 'error',
    message: '未找到远程服务器'
  },
  NOPERMISSION: {
    title: '请求错误',
    type: 'error',
    message: '权限限制，禁止访问'
  },
  RELOGIN: {
    title: '请求错误',
    type: 'error',
    message: '用户登录过期，请重新登录'
  },
  FAIL: {
    title: '网络错误',
    type: 'error',
    message: '请检查网络是否已连接'
  }
}

export const notification = (type, message = '') => {
  if (message) {
    const config = Object.assign({}, notions.ERROR, { message })
    return Notification(config)
  }
  return Notification(notions[type])
}