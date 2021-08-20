import { get, post } from '../helper'

// 首页 - 业绩统计 type: self 个人，team 团队，company 公司
export const getPerformance = (type, data) => get(`/agent/proxy/statistics/performance/${type}`, data)

// 首页 - 商品top5 // type: self 个人，team 团队，company 公司
export const getSalesTop = (type, data) => get(`/agent/proxy/statistics/products_top/${type}`, data)

// 首页 - 险种类型统计 // type: self 个人，team 团队，company 公司
export const getInsuranceClass = (type, data) => get(`/agent/proxy/statistics/insurance_class/${type}`, data)

// 首页 - 轮播图
export const getBannerList = data => get('/agent/proxy/home_page/banner/list', data)

// 首页 - 记录点击轮播图
export const logBannerClick = data => post('/agent/proxy/home_page/banner/read_log', data)

// 首页 - 平台公告列表
export const getAnnouncementList = data => get('/agent/proxy/home_page/announcement/platform/list', data)

// 首页 - 商品调整公告列表
export const getRegulateList = data => get('/agent/proxy/home_page/announcement/product_adjust/list', data)

// 首页 - 新品上线列表
export const getNewLinesList = data => get('/agent/proxy/home_page/announcement/new_product/list', data)

// 首页 - 记录平台公告、商品调整、平台公告点击数
export const logPlateClick = data => post('/agent/proxy/home_page/announcement/read_log', data)

// 获取平台公告、商品调整、平台公告详情
export const getPlateDetail = data => get('/agent/proxy/home_page/announcement/detail', data)

// 获取公告未读红点
export const getUnreadCount = data => get('/agent/proxy/home_page/announcement/unread_notice', data)
