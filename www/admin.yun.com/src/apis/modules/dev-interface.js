import { get, post } from '../helper'

export const getDetail = params => get('/agent/proxy/company/api_config/detail', params)

export const refreshSecret= params => post('/agent/proxy/company/api_config/refresh_access_secret', params)

export const refreshDes = params => post('/agent/proxy/company/api_config/refresh_des_sign_key', params)

export const saveConfig = params => post('/agent/proxy/company/api_config/save', params)
