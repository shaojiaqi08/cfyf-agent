import { get, post } from '../helper'

// 获取公司信息详情
export const getCompanyDetail = params => get('/agent/proxy/company/details', params)
// 保存计划书相关配置
export const updateCompanyDetail = data => post('/agent/proxy/company/store_details', data)
// 团队信息
export const getGroupInfo = params => get('/agent/proxy/sales/child_teams_with_sales', params)
// 获取企业信息
export const getCompanyInfo = params => get('/agent/proxy/company/info', params)
// 获取财务信息
export const getCompanyFinanceInfo = params => get('/agent/proxy/company/finance_info', params)
// 获取品牌信息
export const getCompanyGetBrandInfo = params => get('/agent/proxy/company/get_brand_info', params)
