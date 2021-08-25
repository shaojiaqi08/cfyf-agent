import { get, post } from '../helper'

// 续保单列表
export const getRenewalList = data => get('/agent/proxy/policy-renewal/list-for-company', data)

// 销售人员跟踪详情
export const getSalesDetail = data => get('/agent/proxy/policy-renewal/detail-for-sales', data)

// 获取管理员设置续保通知
export const getAdminNotifySetting = data => get('/agent/proxy/policy-renewal/get-company-notify-setting', data)

// 管理员设置续保通知
export const setAminNotifySetting = data => post('/agent/proxy/policy-renewal/admin-store-notify-setting', data)

// 获取销售续保通知配置
export const getSalesNotifySetting = data => get('/agent/proxy/policy-renewal/get-sales-notify-setting', data)

// 销售设置续保通知
export const setSalesNotifySetting = data => post('/agent/proxy/policy-renewal/sales-store-notify-setting', data)
