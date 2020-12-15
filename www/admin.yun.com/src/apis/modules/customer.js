import { get, post } from '../helper'

// 全部客户 - 客户列表
export const getCustomerList = params => get('/agent/proxy/customer/admin/customer_page_list', params)
// 全部客户 - 导出客户列表
export const exportCustomerListUrl = `${process.env.VUE_APP_API_URL}/agent/proxy/customer/admin/export_customers`
// 全部客户 - 家庭列表
export const getCustomerFamilyList = params => get('/agent/proxy/customer/admin/family_page_list', params)
// 全部客户 - 导出客户保单
export const exportCustomerPolicyUrl = `${process.env.VUE_APP_API_URL}/agent/proxy/customer/admin/export_customer_policy`
// 全部客户 - 导出家庭保单
export const exportFamilyPolicyUrl = `${process.env.VUE_APP_API_URL}/agent/proxy/customer/admin/export_family_policy`
// 全部客户 - 客户详情
export const getCustomerDetail = params => get('/agent/proxy/customer/admin/customer_detail_with_policies', params)
// 全部客户 - 家庭详情
export const getFamilyDetail = params => get('/agent/proxy/customer/admin/family_with_policies', params)

// 我的客户 - 客户列表
export const getMyCustomerList = params => get('/agent/proxy/customer/sales/page_list', params)
// 我的客户 - 导出客户列表
export const exportMyCustomerListUrl = `${process.env.VUE_APP_API_URL}/agent/proxy/customer/sales/export_customers`
// 我的客户 - 导出客户保单
export const exportMyCustomerPolicyUrl = `${process.env.VUE_APP_API_URL}/agent/proxy/customer/sales/export_customer_policy`
// 我的客户 - 导出家庭保单
export const exportMyFamilyPolicyUrl = `${process.env.VUE_APP_API_URL}/agent/proxy/customer/sales/export_family_policy`
// 我的客户 - 客户详情
export const getMyCustomerDetail = params => get('/agent/proxy/customer/sales/detail_with_policies', params)
// 我的客户 - 家庭列表
export const getMyCustomerFamilyList = params => get('/agent/proxy/customer/sales/family_page_list', params)
// 我的客户 - 家庭详情
export const getMyCustomerFamilyDetail = params => get('/agent/proxy/customer/sales/family_with_policies', params)
// 我的客户 - 家庭移除投保人
export const removePolicyHolder = params => post('/agent/proxy/customer/sales/remove_family_member', params)
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
