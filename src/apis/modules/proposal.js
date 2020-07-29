import {get, post} from '../helper'

// 计划书分页列表
export const getProposalList = (data) => get('/agent/proxy/proposal/list-with-page', data)
// 计划书个人展示详情
export const getProposalMasterInfo = (data) => get('/agent/proxy/proposal/sales-info/detail', data)
// 保存计划书个人展示详情
export const updateProposalMasterInfo = (data) => post('/agent/proxy/proposal/sales-info/save', data)
// 有效家庭成员列表
export const getRelations = (data) => get('', data)
// 有效家庭成员列表V2
export const getRelationsV2 = (data) => get('/agent/proxy/proposal/customer/members', data)
// 一级分类列表
export const getInsuranceList = (data) => get('/agent/proxy/proposal/insurance-category/list', data)
// 保险公司（供应商）列表
export const getSupplierList = (data) => get('/agent/proxy/proposal/supplier/list', data)
// 保险产品列表
export const getInsuranceProductList = (data) => get('/agent/proxy/proposal/insurance-product/list', data)
// 查找产品列表
export const getProductList = (data) => get('/agent/proxy/proposal/product/list', data)
// 客户详情
export const getCustomInfo = (data) => post('', data)
// 产品保额 保费
export const getCost = (data) => post('/agent/proxy/proposal/cost', data)
// 保存技术书
export const saveProposal = (data) => post('/agent/proxy/proposal/add', data)
// 新增客户和其家庭成员
export const addCustomer = (data) => post('/agent/proxy/proposal/customer/add', data)
// 同步客户信息
export const getProposalCustomerSync = (data) => post('', data)
// 计划书详情
export const getProposalInfo = (data) => get('/agent/proxy/proposal/detail', data)
// 查看pdf
export const getPdf = (data) => get('', data)