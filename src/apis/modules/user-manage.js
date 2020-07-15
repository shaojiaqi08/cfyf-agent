import { get, post } from '../helper'
// ----------------- 内部管理员 ------------------------
// 添加管理员
export const createManager = (params) => post('/management/sys_permission/sys_user/store', params)
// 编辑管理员
export const editManager = (params) => post('/management/sys_permission/sys_user/update', params)
// 管理员列表
export const getManagerList = (params) => get('/management/sys_permission/sys_user/get_page_list', params)
// 使失效
export const removeEffect = (params) => post('/management/sys_permission/sys_user/close', params)
// 更新账户状态
export const updateStatus = (params) => post('/management/sys_permission/sys_user/update_account_status', params)
// 重置密码
export const resetPassword = (params) => post('/management/sys_permission/sys_user/reset_password', params)
// 更新密码
export const updatePassword = (params) => post('/management/sys_permission/sys_user/update_password', params)
// 权限树
export const getManageTree = (params) => get('/management/sys_permission/sys_permission_group/get_tree', params)
// 更新权限树
export const updateTree = (params) => post('/management/sys_permission/sys_role_permission_relation/update', params)
// 编辑权限树详情
export const getManageTreeDetail = (params) => get('/management/sys_permission/sys_permission_group/detail?role_id=1', params)

// ----------------- B端公司接口 -----------------------
// 新增公司
export const createCompany = (params) => post('/management/company/store', params)
// 编辑公司
export const editCompany = (params) => post('/management/company/update', params)
// 公司列表
export const getCompanyList = (params) => get('/management/company/get_page_list', params)
// 公司详情
export const getCompanyDetail = (params) => get('/management/company/detail', params)
// 成员列表
export const getPeopleList = (params) => get('/management/sales/get_page_list', params)
// 更新权限树
export const updateCompanyTree = (params) => post('', params)
// 权限树
export const getCompanyTree = (params) => get('/agent/business_permission/business_permission_group/get_tree', params)