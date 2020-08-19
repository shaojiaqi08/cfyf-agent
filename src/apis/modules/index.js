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

// api和cps产品列表
export const getAllProducts = params => get('/common/product/all-products', params)

// 供应商类表
export const getSupplierList = params => get('/common/product/supplier/list', params)

// 产品可选年龄
export const getProductAgeList = params => get('/common/product/age/list', params)

// 险种分类
export const getProductCategory = params => get('/common/product/category/list-with-children', params)

// 登录
export const login = params => post('/agent/proxy/sales/login', params)

// 登出
export const loginOut = (params) => get('/agent/proxy/sales/logout', params)

// 用户信息
export const getUserDetail = params => get('/agent/proxy/sales/personal_information', params)

// 修改用户密码
export const updatePassword = params => post('/agent/proxy/sales/change_personal_password', params)

// 更新头像
export const uploadHeadImg = params => post('/agent/proxy/sales/change_personal_avatar', params)

// 生成模拟登陆地址
export const genSimulatedLink = params => get('/agent/proxy/sales/generate_auth_link', params)

// 模拟登录
export const simulatedLogin = params => post('/agent/proxy/sales/simulated_login', params)

// 获取权限
export const getPermission = params => get('/agent/proxy/rbac/business_permission/my_permission_list', params)

// 系统版本
export const checkVersion = params => get('/agent/proxy/common/check_version', params)