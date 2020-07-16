import { get, post } from '../helper'

// 上传核保健告文件
export const uploadFile = params => get('/health_notice/upload/file', params)
// 获取健告产品详情
export const getHealthNoticeDetail = params => get('/health_notice/list', params)
// 获取核保产品详情
export const getUnderwritingDetail = params => get('/agent/health_notice/underwriting/list', params)
// 获取核保上传记录
export const getUnderwritingUploadRecord = params => get('/health_notice/underwriting/file_log/list', params)
// 获取核保上传记录
export const getHealthNoticeUploadRecord = params => get('/health_notice/file_log/list', params)
// 获取核保产品列表
export const getUnderwritingProductList = params => get('/agent/health_notice/underwriting/product_name/list', params)
// 获取健告产品列表
export const getHealthNoticeProductList = params => get('/health_notice/product_name/list', params)
// 根据产品名称删除健告信息
export const removeHealthNoticeProduct = params => get('/health_notice/product_name/del', params)
// 根据产品名称删除核保信息
export const removeUnderwritingProduct = params => get('/health_notice/underwriting/product_name/del', params)
// 核保规则列表
export const getUnderwriteRuleList = params => get('/health_notice/underwrite-rule/list', params)
// 核保规则详情
export const getUnderwriteRuleDetail = params => get('/health_notice/underwrite-rule/detail', params)
// 获取对比表的字段配置
export const getProductEvaluationConfig = params => get('/product_evaluation/compare_columns_config', params)
// 一览表产品列表
export const getEvaluationProductPageList = params => get('product_evaluation/evaluation_product_page_list', params)
// 产品详情
export const getProductEvaluationDetail = params => get('/product_evaluation/insurance_params', params)
// 产品保额
export const getCalculatePremium = params => post('/product_evaluation/calculate_premium', params)
// 多个产品对比信息
export const getProductsCompareInfo = params => post('/product_evaluation/get_products_compare_info', params)
// 生成产品对比图
export const getProductEvaluationImage = params => post('/product_evaluation/show_image', params)