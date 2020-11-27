import { get, post } from '../helper'

// 获取健告产品详情
export const getHealthNoticeDetail = params => get('/agent/proxy/health_notice/list', params)
// 获取核保产品详情
export const getUnderwritingDetail = params => get('/agent/proxy/health_notice/underwriting/list', params)
// 获取核保上传记录
export const getUnderwritingUploadRecord = params => get('/agent/proxy/health_notice/underwriting/file_log/list', params)
// 获取核保上传记录
export const getHealthNoticeUploadRecord = params => get('/agent/proxy/health_notice/file_log/list', params)
// 获取核保产品列表
export const getUnderwritingProductList = params => get('/agent/proxy/health_notice/underwriting/product_name/list', params)
// 获取健告产品列表
export const getHealthNoticeProductList = params => get('/agent/proxy/health_notice/product_name/list', params)
// 根据产品名称删除健告信息
export const removeHealthNoticeProduct = params => get('/agent/proxy/health_notice/product_name/del', params)
// 根据产品名称删除核保信息
export const removeUnderwritingProduct = params => get('/agent/proxy/health_notice/underwriting/product_name/del', params)
// 投保规则列表
export const getUnderwriteRuleList = params => get('/agent/proxy/health_notice/underwrite-rule/list', params)
// 投保规则详情
export const getUnderwriteRuleDetail = params => get('/agent/proxy/health_notice/underwrite-rule/detail', params)
// 核保规则列表
export const getInsuranceRuleList = params => get('/agent/proxy/health_notice/underwrite-rule/insurance/list', params)
// 获取对比表的字段配置
export const getProductEvaluationConfig = params => get('/agent/proxy/product_evaluation/compare_columns_config', params)
// 一览表产品列表
export const getEvaluationProductPageList = params => get('/agent/proxy/product_evaluation/evaluation_product_page_list', params)
// 产品详情
export const getProductEvaluationDetail = params => get('/agent/proxy/product_evaluation/insurance_params', params)
// 产品保额
export const getCalculatePremium = params => post('/agent/proxy/product_evaluation/calculate_premium', params)
// 多个产品对比信息
export const getProductsCompareInfo = params => post('/agent/proxy/product_evaluation/get_products_compare_info', params)
// 生成产品对比图
export const getProductEvaluationImage = params => post('/agent/proxy/product_evaluation/show_image', params)