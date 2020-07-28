import { get, post } from '../helper'

export const getList = params => get('/announcement/get-sales-unread-announcement-list', params)

export const getRoleDetail = params => get('/adm_roles/detail', params)

export const getRolePermission = params => get('/adm_roles/permission-id-list', params)

// 角色列表
export const getRoleList = params => get('/agent/admin_position/get_list', params)

// 添加角色
export const createRole = params => post('/agent/admin_position/store', params)

// 地区数据
export const getRegion = params => get('/common/get_region_list', params)

// 银行列表
export const getBankList = params => get('/common/get_bank_list', params)

// 供应商类表
export const getSupplierList = params => get('/common/product/supplier/list', params)

// 产品可选年龄
export const getProductAgeList = params => get('/common/product/age/list', params)

// 险种分类
export const getProductCategory = params => get('/common/product/category/list-with-children', params)

// 登录
export const login = params => post('/agent/sales/login', params)

// 登出
export const loginOut = (params) => get('/agent/sales/logout', params)

// 修改用户密码
export const updatePassword = params => post('', params)