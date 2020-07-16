import { get, post } from '../helper'

export const getList = params => get('/announcement/get-sales-unread-announcement-list', params)

export const getRoleDetail = params => get('/adm_roles/detail', params)

export const getRolePermission = params => get('/adm_roles/permission-id-list', params)

// 角色列表
export const getRoleList = params => get('/management/sys_permission/sys_role/get_page_list', params)

// 添加角色
export const createRole = params => post('/management/sys_permission/sys_role/store', params)

// 地区数据
export const getRegion = params => get('/common/get_region_list', params)

// 银行列表
export const getBankList = params => get('/common/get_bank_list', params)

// 登录
export const login = params => post('/agent/sales/login', params)
