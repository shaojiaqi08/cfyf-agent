import { get, post } from '../helper'

// 公司续保列表
export const getRenewalCompanyList = data => get('/agent/proxy/policy-renewal/list-for-company', data)
//团队续保列表
export const getRenewalTeamList = data => get('/agent/proxy/policy-renewal/list-for-team', data)
//个人续保列表
export const getRenewalSalesList = data => get('/agent/proxy/policy-renewal/list-for-sales', data)

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

//添加跟进记录
export const addFollowStatusLogs = data => post('/agent/proxy/policy-renewal/add-follow-status-logs', data)

//修改跟进状态
export const modifyFollowStatus = data => post('/agent/proxy/policy-renewal/modify-follow-status', data)

//获取跟进记录列表
export const getFollowLogs= data => get('/agent/proxy/policy-renewal/follow-logs', data)