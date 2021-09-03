import { get, post } from '../helper'

// 修改归属
export const policyTransfer = params => post('/agent/proxy/policy/transfer', params)

// 个人业绩
export const getSelfPolicyList = params => get('/agent/proxy/policy/self_policy_list', params)
export const getSelfPolicyStatistics = params => get('/agent/proxy/policy_statistics/self_statistics', params)

// 团队业绩
export const getTeamPolicyList = params => get('/agent/proxy/policy/sales_team_policy_list', params)
export const getTeamPolicyStatistics = params => get('/agent/proxy/policy_statistics/sales_team_statistics', params)

// 公司业绩
export const getCompanyPolicyList = params => get('/agent/proxy/policy/company_policy_list', params)
export const getCompanyPolicyStatistics = params => get('/agent/proxy/policy_statistics/company_statistics', params)
// 归属成员
export const getManagementSalesList = params => get('/agent/proxy/sales/list_for_transfer_policy', params)

// 保单详情
export const getPolicyDetail = params => get('/agent/proxy/policy/detail', params)

// 销售下拉数据
export const getSalesData = params => get('/agent/proxy/sales/list', params)

// 销售团队下拉数据
export const getSalesTeamData = params => get('/agent/proxy/sales/get_all_teams_list', params)
// b端公司
export const getManagementCompanyList = (params) => get('/management/proxy/company/list', params)
// 投退保时间选项
export const getDateRange = (params) => get('/common/date_ranges', params)
// 获取电子保单
export const getPolicyFile = (params) => get('/agent/proxy/policy/policy_file_url', params)
// 导出订单数据(公司)
export const exportCompanyPolicy = `${process.env.VUE_APP_API_URL}/agent/proxy/policy/export_company_policy`
// 导出订单数据(团队)
export const exportTeamPolicy = `${process.env.VUE_APP_API_URL}/agent/proxy/policy/export_team_policy`
// 导出订单数据(个人)
export const exportSelfPolicy = `${process.env.VUE_APP_API_URL}/agent/proxy/policy/export_self_policy`

// 公司团队业绩排行
export const getTeamRank = (params) => get('/agent/proxy/policy_statistics/company/team_rank', params)
// 公司个人业绩排行榜
export const getPersonalRank = (params) => get('/agent/proxy/policy_statistics/company/personal_rank', params)
// 公司险种类别排行榜
export const getInsuranceClassRank = (params) => get('/agent/proxy/policy_statistics/company/insurance_class_rank', params)
// 公司保险产品排行榜
export const getProductRank = (params) => get('/agent/proxy/policy_statistics/company/product_rank', params)
// 团队个人业绩排行榜
export const getTeamPersonalRank = (params) => get('/agent/proxy/policy_statistics/team/personal_rank', params)
// 团队险种类别排行榜
export const getTeamInsuranceClassRank = (params) => get('/agent/proxy/policy_statistics/team/insurance_class_rank', params)
// 团队保险产品排行榜
export const getTeamProductRank = (params) => get('/agent/proxy/policy_statistics/team/product_rank', params)

// 导出团队业绩排行
export const exportTeamRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/company/export_team_rank`
// 导出个人业绩排行榜
export const exportPersonalRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/company/export_personal_rank`
// 导出险种类别排行榜
export const exportInsuranceClassRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/company/export_insurance_class_rank`
// 导出保险产品排行榜
export const exportProductRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/company/export_product_rank`
// 团队个人业绩排行
export const exportTeamPersonalRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/team/export_personal_rank`
// 团队险种类别统计
export const exportTeamInsuranceClassRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/team/export_insurance_class_rank`
// 团队保险产品统计
export const exportTeamProductRank = `${process.env.VUE_APP_API_URL}/agent/proxy/policy_statistics/team/export_product_rank`

// 订单详情-保单基本信息
export const getPolicyBase = (params) => get('/agent/proxy/policy_info/get_base', params)
// 订单详情-客户信息
export const getPolicyHolder = (params) => get('/agent/proxy/policy_info/get_policy_holder', params)
// 订单详情-险种信息
export const getPolicyInsurances = (params) => get('/agent/proxy/policy_info/get_insurances', params)
// 订单详情-销售信息
export const getPolicySales = (params) => get('/agent/proxy/policy_info/sales', params)
// 订单详情-回访信息
export const getPolicyVisit = (params) => get('/agent/proxy/policy_info/get_visit', params)
// 订单详情-人核信心
export const getManPowerInfo = params => get('/agent/proxy/policy_info/manpower', params)

// 人核订单列表 - 销售
export const manpowerListForSales = params => get('/agent/proxy/manpower-order/list-for-sales', params)
// 人核订单列表 - 团队
export const manpowerListForTeam = params => get('/agent/proxy/manpower-order/list-for-team', params)
// 人核订单列表 - 公司
export const manpowerListForCompany = params => get('/agent/proxy/manpower-order/list-for-company', params)
// 人核筛选数据
export const getManpowerOptions = params => get('/agent/proxy/manpower-order/select-options', params)

//续保续期信息-历史续保记录
export const getRenewalInfo = params => get('/agent/proxy/policy_info/get_renewal', params)

