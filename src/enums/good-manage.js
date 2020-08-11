export const calculateWayKey = {
  GUARANTEEPERIOD: 'guarantee_period',
  AGEANDGUARANTEEPERIOD: 'age_and_guarantee_period',
  SINGLEPOLICY: 'single_policy'
}
// 服务费/佣金计算方式
export const calculateWays = [
  {
    label: '按保障期限',
    value: calculateWayKey.GUARANTEEPERIOD,
    desc: '费率将直接根据订单的保障期限进行计算'
  },
  {
    label: '按年龄和保障期限',
    value: calculateWayKey.AGEANDGUARANTEEPERIOD,
    desc: '按保障期限和年龄算'
  },
  {
    label: '按照系数计算',
    value: calculateWayKey.SINGLEPOLICY,
    desc: '费率将直接根据订单的保障期限进行计算'
  }
]
// 服务费/佣金年限
export const termKeys = {
  FIRST: '1',
  SECOND: '2',
  THIRD: '3',
  FORTH: '4',
  FIRTH: '5'
}

export const terms = [
  {
    label: '首年',
    value: termKeys.FIRST
  },
  {
    label: '第二年',
    value: termKeys.SECOND
  },
  {
    label: '第三年',
    value: termKeys.THIRD
  },
  {
    label: '第四年',
    value: termKeys.FORTH
  },
  {
    label: '第五年',
    value: termKeys.FIRTH
  }
]

// 服务费率设置状态
export const effectStatusKeys = {
  PENDING: 'pending',
  EFFECTIVE: 'effective',
  INVALID: 'invalid',
  NONE: 'none'
}

export const effectStatus = [
  {
    label: '待生效',
    value: effectStatusKeys.PENDING,
    color: '#339AFF',
    tag: ''
  },
  {
    label: '生效中',
    value: effectStatusKeys.EFFECTIVE,
    color: '#40D659',
    tag: 'success'
  },
  {
    label: '已失效',
    value: effectStatusKeys.INVALID,
    color: '#FF4C4C',
    tag: 'info'
  },
  {
    label: '未设置',
    value: effectStatusKeys.NONE,
    color: '#4D4D4D',
    tag: 'info'
  }
]

export const effectStatusKeysV2 = {
  NO_SETTING: 'no_setting',
  HAVE_SETTING: 'have_setting'
}

export const effectStatusV2 = [
  {
    label: '未设置',
    value: effectStatusKeysV2.NO_SETTING,
    color: '#339AFF',
    tag: ''
  },
  {
    label: '已设置',
    value: effectStatusKeysV2.HAVE_SETTING,
    color: '#40D659',
    tag: 'success'
  }
]

// 商品上下架
export const sellStatus = {
  UP: 1,
  DOWN: 0
}

export const sellStatusArray = [
  {
    label: '上架',
    value: sellStatus.UP
  },
  {
    label: '下架',
    value: sellStatus.DOWN
  }
]