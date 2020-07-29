import { get } from '../helper'
// 计划书列表
export const interactiveLogProposal = params => get('/agent/proxy/interactive-log/proposal/share/list-with-page', params)
// 计划书详情
export const interactiveLogProposalDetail = params => get('/agent/proxy/interactive-log/proposal/share/detail', params)
// 互动记录-其他
export const interactiveLogOther = (data) => get('/agent/proxy/interactive-log/collection/share/list', data)
// 互动记录-其他-文章详情
export const interactiveLogOtherArticle = (data) => get('/agent/proxy/interactive-log/article/detail', data)
// 互动记录-其他-API产品详情
export const interactiveLogOtherApi = (data) => get('/agent/proxy/interactive-log/api-product/detail', data)
// 互动记录-其他-CPS产品详情
export const interactiveLogOtherCps = (data) => get('/agent/proxy/interactive-log/cps-product/detail', data)
// 互动记录-其他-避坑游戏详情
export const interactiveLogOtherPit = (data) => get('/agent/proxy/interactive-log/drop-game/detail', data)
// 互动记录-其他-风险测评详情
export const interactiveLogOtherRisk = (data) => get('/agent/proxy/interactive-log/risk-evaluating/detail', data)

