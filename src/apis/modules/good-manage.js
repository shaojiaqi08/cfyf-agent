import { get, post } from '../helper'
// 保单分页列表
export const getCompanyList = (params) => get('/management/company/list', params)
// 商品列表
export const getCompanyProductList = (params) => get('/management/product-manage/company-products', params)
// 商品上下架
export const setStatus = (data) => post('/management/product-manage/set-status', data)
