import { get, post } from '../helper'

// 修改归属
export const policyTransfer = params => post('/policy/transfer', params)

// 个人业绩
export const getSelfPolicyList = params => get('/agent/policy/self_policy_list', params)
export const getSelfPolicyStatistics = params => get('/agent/policy/self_statistics', params)

// 团队业绩
export const getTeamPolicyList = params => get('/agent/policy/sales_team_policy_list', params)
export const getTeamfPolicyStatistics = params => get('/agent/policy/sales_team_statistics', params)

// 公司业绩
export const getCompanyPolicyList = params => get('/agent/policy/company_policy_list', params)
export const getCompanyPolicyStatistics = params => get('/agent/policy/company_statistics', params)

// 保单详情
export const getPolicyDetail = params => get('/agent/policy/detail?id=1', params)