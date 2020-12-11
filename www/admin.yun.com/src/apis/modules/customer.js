import { get, post } from '../helper'

// 全部客户 - 家庭列表
export const getCustomerFamilyList = params => get('/agent/proxy/customer/sales/detail_with_policies', params)


// 我的客户 - 客户列表
export const getMyCustomerList = params => get('/agent/proxy/customer/sales/page_list', params)

// 我的客户 - 客户详情
export const getMyCustomerDetail = params => get('/agent/proxy/customer/sales/detail_with_policies', params)

// 我的客户 - 客户详情
export const getMyCustomerFamilyList = params => get('/agent/proxy/customer/sales/detail_with_policies', params)

// 我的客户 - 创建家庭
export const createFamily = params => post('/agent/proxy/customer/sales/detail_with_policies', params)
