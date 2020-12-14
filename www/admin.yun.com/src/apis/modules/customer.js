import { get, post } from '../helper'

// 全部客户 - 家庭列表
export const getCustomerFamilyList = params => get('/agent/proxy/customer/sales/family_page_list', params)
// 全部客户 - 客户详情
export const getCustomerDetail = params => get('/agent/proxy', params)
// 全部客户 - 家庭详情
export const getFamilyDetail = params => get('/agent/proxy', params)

// 我的客户 - 客户列表
export const getMyCustomerList = params => get('/agent/proxy/customer/sales/page_list', params)
// 我的客户 - 导出客户列表
export const exportMyCustomerListUrl = '/agent/proxy/customer/sales/export_customers'
// 我的客户 - 客户详情
export const getMyCustomerDetail = params => get('/agent/proxy/customer/sales/detail_with_policies', params)
// 我的客户 - 家庭列表
export const getMyCustomerFamilyList = params => get('/agent/proxy/customer/sales/family_page_list', params)
// 我的客户 - 家庭详情
export const getMyCustomerFamilyDetail = params => get('/agent/proxy/customer/sales/family_with_policies', params)
// 我的客户 - 解散家庭
export const dismissFamily = params => post('/agent/proxy/customer/sales/disband_family', params)
// 我的客户 - 新建家庭
export const createFamily = params => post('/agent/proxy/customer/sales/create_family', params)
// 我的客户 - 编辑家庭
export const editFamily = params => post('/agent/proxy/customer/sales/edit_family', params)
// 我的客户 - 未关联家庭客户类表
export const getCustomerNoRelation = params => get('/agent/proxy/customer/sales/no_family_customers', params)
// 我的客户 - 所有关联家庭
export const getMyCustomerRelativeFamily = params => get('/agent/proxy/customer/sales/families', params)
// 我的客户 - 关联投保人
export const relativePolicyHolder = params => post('/agent/proxy/customer/sales/join_family', params)
