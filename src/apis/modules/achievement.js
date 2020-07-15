import { get, post } from '../helper'
// 保单分页列表
export const getManagementPolicyList = (params) => get('/management/policy/list', params)
// 保单统计
export const getManagementPolicyStatistics = (params) => get('/management/policy/statistics', params)
// 保单详情
export const getManagementPolicyDetail = (params) => get('/management/policy/detail', params)
// b端公司
export const getManagementCompanyList = (params) => get('/management/company/list', params)
// 销售人员列表
export const getManagementSalesList = (params) => get('/management/sales/list', params)
// 保单修改归属
export const setPolicyTransfer = (data) => post('/management/policy/transfer', data)
