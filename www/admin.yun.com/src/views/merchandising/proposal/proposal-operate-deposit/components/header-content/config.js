export const tabs = [
  { label: '我的订单列表', value: 0, permission: 'order-list-tab' },
  { label: '部门＆销售排行', value: 1, permission: 'depart-list-tab' },
  { label: '顾问排行', value: 2, permission: 'adviser-list-tab' },
  { label: '群排行', value: 3, permission: 'group-list-tab' },
  { label: '产品排行', value: 4, permission: 'product-list-tab' }
]
// 对应tab需要的搜索框字段
export const searchKeywords = [
  [
    { label: '关联客户', value: 'customer_keyword' },
    { label: '保险产品', value: 'product_name' },
    { label: '单号', value: 'proposal_or_policy_sn' },
    { label: '投被保人姓名', value: 'policy_holder_or_recognizee_name' }
  ],
  [],
  [],
  [
    { label: '群名称', value: 'wx_group_name' }
  ],
  [
    { label: '产品名称', value: 'product_name' }
  ]
]
