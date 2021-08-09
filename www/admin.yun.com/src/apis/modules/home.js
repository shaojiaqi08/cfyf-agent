import { get } from '../helper'

// 首页 - 业绩统计 type: self 个人，team 团队，company 公司
export const getPerformance = (type, data) => get(`/agent/proxy/statistics/performance/${type}`, data)

// 首页 - 商品top5 // type: self 个人，team 团队，company 公司
export const getSalesTop = (type, data) => get(`/agent/proxy/statistics/products_top/${type}`, data)

// 首页 - 险种类型统计 // type: self 个人，team 团队，company 公司
export const getInsuranceClass = (type, data) => get(`/agent/proxy/statistics/insurance_class/${type}`, data)
