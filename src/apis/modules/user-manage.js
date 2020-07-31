import { get, post } from '../helper'
// ----------------- 管理员 ------------------------
// 添加管理员
export const createManager = (params) => post('/agent/proxy/admin/store', params)
// 编辑管理员
export const editManager = (params) => post('/agent/proxy/admin/update', params)
// 角色列表
export const getRoleList = params => get('/agent/proxy/admin_position/get_list', params)
// 新增用角色列表
export const getEditRoleList = params => get('/agent/proxy/admin/get_position_list', params)
// 添加角色
export const createRole = params => post('/agent/proxy/admin_position/store', params)
// 管理员列表
export const getManagerList = (params) => get('/agent/proxy/admin/get_page_list', params)
// 使失效
export const removeEffect = (params) => post('/agent/proxy/admin/close', params)
// 更新账户状态
export const updateStatus = (params) => post('/agent/proxy/admin/update_account_status', params)
// 重置密码
export const resetPassword = (params) => post('/agent/proxy/admin/reset_password', params)
// 更新密码
export const updatePassword = (params) => post('/management/sys_permission/sys_user/update_password', params)
// 权限树
export const getManageTree = (params) => get('/management/rbac/sys_permission_group/get_tree', params)
// 编辑权限树详情
export const getManageTreeDetail = (params) => get('/agent/proxy/rbac/business_permission_group/admin/detail', params)
// 更新权限树
export const updateManageTree = params => post('/agent/proxy/rbac/business_role_permission_relation/admin/update', params)
// 编辑职位
export const updateMangePos = params => post('/agent/proxy/admin_position/update', params)
// 删除职位
export const delMangePos = params => get('/agent/proxy/admin_position/delete', params)

// ----------------- 销售 -----------------------
// 团队列表
export const getTeamList = (params) => get('/agent/proxy/sales/get_all_teams_list', params)
// 全部销售
export const getAllSalesList = params => get('/agent/proxy/sales/get_page_list', params)
// 销售人员列表
export const getSalesList = (params) => get('/agent/proxy/sales/get_list_group_team_role', params)
// 没有加入团队的销售列表
export const getSalesListNoTeam = (params) => get('/agent/proxy/sales/get_leader_candidate', params)
// 成员分组数据
export const getGroupSalesList = (params) => get('/agent/proxy/sales/get_sales_list_group_position', params)
// 解散团队
export const dismissTeam = (params) => post('/agent/proxy/sales/team/disband_team', params)
// 修改团队名
export const modifyTeamName = (params) => post('/agent/proxy/sales/team/modify_name', params)
// 新增销售
export const createSales = (params) => post('/agent/proxy/sales/store', params)
// 编辑销售
export const modifySales = (params) => post('/agent/proxy/sales/update', params)
// 离职
export const dimission = (params) => post('/agent/proxy/sales/dimission', params)
// 重置密码
export const resetSalesPassword = (params) => post('/agent/proxy/sales/reset_password', params)
// 销售详情
export const getSalesDetail = (params) => get('/agent/proxy/sales/detail', params)
// 职位列表
export const getSalesPositionList = (params) => get('/agent/proxy/sales/get_position_list', params)
// 创建团队
export const createTeam = (params) => post('/agent/proxy/sales/team/create', params)
// 更换主管
export const setLeader = (params) => post('/agent/proxy/sales/team/set-leader', params)
// 设置团队成员
export const setMember = (params) => post('/agent/proxy/sales/team/set-member', params)
// 转移团队
export const transferTeam = (params) => post('/agent/proxy/sales/team/change-team-parent', params)
// 更新状态
export const updateSalesStatus = (params) => post('/agent/proxy/sales/update_account_status', params)

// --------------------  职位 ------------------------------
// 职位列表
export const getPositionList = (params) => get('/agent/proxy/sales_position/get_list', params)
// 等级列表
export const getPosLvList = (params) => get('/agent/proxy/sales_position/get_level_list', params)
// 职位详情列表
export const getPosDetail = (params) => get('/agent/proxy/rbac/business_permission_group/detail', params)
// 新增职位
export const createPosLv = (params) => post('/agent/proxy/sales_position/store', params)
// 跟新权限树
export const updatePosTree = (params) => post('/agent/proxy/rbac/business_role_permission_relation/update', params)