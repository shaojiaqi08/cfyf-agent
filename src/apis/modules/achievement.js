import { get, post } from '../helper'

// 修改归属
export const policyTransfer = params => post('/agent/proxy/policy/transfer', params)

// 个人业绩
export const getSelfPolicyList = params => get('/agent/proxy/policy/self_policy_list', params)
export const getSelfPolicyStatistics = params => get('/agent/proxy/policy/self_statistics', params)

// 团队业绩
export const getTeamPolicyList = params => get('/agent/proxy/policy/sales_team_policy_list', params)
export const getTeamPolicyStatistics = params => get('/agent/proxy/policy/sales_team_statistics', params)

// 公司业绩
export const getCompanyPolicyList = params => get('/agent/proxy/policy/company_policy_list', params)
export const getCompanyPolicyStatistics = params => get('/agent/proxy/policy/company_statistics', params)

// 保单详情
export const getPolicyDetail = params => get('/agent/proxy/policy/detail', params)

// 销售下拉数据
export const getSalesData = params => get('/agent/proxy/sales/list', params)

// 销售团队下拉数据
export const getSalesTeamData = params => get('/agent/proxy/sales/get_all_teams_list', params)
// b端公司
export const getManagementCompanyList = (params) => get('/management/proxy/company/list', params)