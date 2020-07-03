import { get } from '../helper'

export const getList = params => get('/announcement/get-sales-unread-announcement-list', params)

export const getRoleDetail = params => get('/adm_roles/detail', params)

export const getRolePermission = params => get('/adm_roles/permission-id-list', params)