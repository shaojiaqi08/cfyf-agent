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