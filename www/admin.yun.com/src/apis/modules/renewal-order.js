import { get, post } from '../helper'

// 公司续保列表
export const getRenewalCompanyList = data => get('/agent/proxy/policy-renewal/list-for-company', data)
//团队续保列表
export const getRenewalTeamList = data => get('/agent/proxy/policy-renewal/list-for-team', data)
//个人续保列表
export const getRenewalSalesList = data => get('/agent/proxy/policy-renewal/list-for-sales', data)

// 销售人员跟踪详情
export const getSalesDetail = data => get('/agent/proxy/policy-renewal/detail-for-sales', data)

// 团队跟踪详情
export const getTeamDetail = data => get('/agent/proxy/policy-renewal/detail-for-team', data)

// 公司跟踪详情
export const getCompanyDetail = data => get('/agent/proxy/policy-renewal/detail-for-company', data)

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

//个人统计
export const getStatisticsForSales = data => get('/agent/proxy/policy-renewal/statistics-for-sales', data)

//团队统计
export const getStatisticsForTeam = data => get('/agent/proxy/policy-renewal/statistics-for-team', data)

//公司统计
export const getStatisticsForCompany = data => get('/agent/proxy/policy-renewal/statistics-for-company', data)

//获取客户短信发送模板
export const getMsgTemplate = data => get('/agent/proxy/policy-renewal/get-msg-template', data)

//给投保人发送续保短信
export const sendCustomerMsg = data => get('/agent/proxy/policy-renewal/send-customer-msg', data)

// 导出订单数据(个人)
export const exportSalesPolicy = `${process.env.VUE_APP_API_URL}/agent/proxy/policy-renewal/export-for-sales`

// 导出订单数据(团队)
export const exportTeamPolicy = `${process.env.VUE_APP_API_URL}/agent/proxy/policy-renewal/export-for-team`

// 导出订单数据(公司)
export const exportCompanyPolicy = `${process.env.VUE_APP_API_URL}/agent/proxy/policy-renewal/export-for-company`