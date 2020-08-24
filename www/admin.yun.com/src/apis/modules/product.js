import {get} from '../helper'

// pc产品 api列表
export const getProductApiList = (params) => get('/product/api/list', params)
// pc产品 cps列表
export const getProductCpsList = (params) => get('/product/cps/list', params)
// pc产品 公司列表
export const getProductCompanyList = (params) => get('/product/company/list', params)
// pc产品 投保年龄列表
export const getProductAgeList = (params) => get('/product/age/list', params)
// pc产品 类别列表(旧版)
// export const getProductCategoryList = (params) => get('/product/category/list', params)
// pc产品 类别列表(新版)
export const getProductCategoryList = (params) => get('/common/product/category/list-with-children', params)
// pc产品 海报下载
export const getPosterLink = `/product/get/poster`
// pc产品 获取海报二维码
export const getPosterQrcode = (params) => get('/product/get/qr-code', params)
