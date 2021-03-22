import { get, post } from '../helper'
// 公司列表
export const getCompanyList = (params) => get('/management/company/list', params)
// 商品列表
export const getCompanyProductList = (params) => get('/management/product-manage/company-products', params)
// 商品上下架
export const setStatus = (data) => post('/management/product-manage/set-status', data)
// 批量上下架
export const setBatchStatus = (data) => post('/management/product-manage/batch-set-status', data)
// api cps产品列表
export const getAllProduct = (data) => get('/common/product/all-products', data)

// ----------------保险商品-----------------
// api list
export const getInsureApiList = (data) => get('/agent/proxy/product/distribution/list', data)
// cps list
export const getInsureCpsList = (data) => get('/agent/proxy/product/cps/list', data)
// 详情
export const getInsureDetail = data => get('/agent/proxy/policy/detail', data)
// 产品分享链接
export const getProductShareLink = data => post('/agent/proxy/product/distribution/generate-share-link', data)
// 产品资料
export const getProductDocs = data => get('/agent/proxy/product/docs', data)

// 显示管理员角色的职位列表
export const getPositionsWithAdminRoles = (data) => get('/agent/proxy/sales_position/positions_with_admin_roles', data)
// 公司产品列表（带服务费规则状态）
export const getProductListOfCompany = (data) => get('/agent/proxy/company-commission/product_list_of_company', data)
// 规则列表
export const getSettingList = (data) => post('/agent/proxy/company-commission/setting/list', data)
// 缴费期限和保障期限选项列表
export const getProductAttributeList = (data) => get('/agent/proxy/product/attributes', data)
// 规则详情
export const getCompanyCommissionDetail = (data) => post('/agent/proxy/sales/position_commission/detail', data)
// 职位等级列表
export const getSalesPositionList = (data) => get('/agent/proxy/sales_position/level_position_list', data)
// 职位产品列表
export const getProductsOfPosition = (data) => post('/agent/proxy/sales/position_commission/products_of_position', data)
// 佣金规则列表
export const getCommissionSettingList = (data) => get('/agent/proxy/sales/position_commission/setting_list', data)
// 编辑规则
export const companyCommissionUpdate = (data) => post('/agent/proxy/sales/position_commission/update', data)
// 创建规则
export const companyCommissionCreate = (data) => post('/agent/proxy/sales/position_commission/create', data)
// 产品列表
export const getCommissionAllProduct = (data) => get('/agent/proxy/sales/position_commission/product_options', data)
// 删除规则
export const deleteCompanyCommission = (data) => post('/agent/proxy/sales/position_commission/delete', data)
// 保险公司列表
export const getSupplierList = (data) => get('/common/product/supplier/list', data)
// 获取佣金计算方式
export const getCalculateWay = (data) => get('/agent/proxy/sales/position_commission/get_calculate_way', data)
// 导出产品链接
export const exportProductLink = `${process.env.VUE_APP_API_URL}/agent/proxy/product/distribution/export-product-link`
