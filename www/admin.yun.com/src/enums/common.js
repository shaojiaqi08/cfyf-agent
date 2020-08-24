// B端保单状态
export const policyStatus = {
  // 待支付
  UNPAID: 'unpaid',
  // 已支付
  PAID: 'paid',
  // 无效的
  INVALID: 'invalid',
  // 已撤单
  CANCELED: 'canceled',
  // 已承保
  ACCEPTED_INSURE: 'accepted_insure',
  // 已终止
  TERMINATED: 'terminated',
  // 已退保
  SURRENDERED: 'surrendered'
}

export const policyStatusArray = [
  {
    label: '待支付',
    value: policyStatus.UNPAID
  },
  {
    label: '已支付',
    value: policyStatus.PAID
  },
  {
    label: '无效的',
    value: policyStatus.INVALID
  },
  {
    label: '已撤单',
    value: policyStatus.CANCELED
  },
  {
    label: '已承保',
    value: policyStatus.ACCEPTED_INSURE
  },
  {
    label: '已终止',
    value: policyStatus.TERMINATED
  },
  {
    label: '已退保',
    value: policyStatus.SURRENDERED
  }
]

// 保障期限单位
export const guaranteePeriodUnit = {
  // 日
  DAY: 1,
  // 月
  MONTH: 2,
  // 年
  YEAR: 3,
  // 岁
  AGE: 4,
  // 季度
  SEASON: 5,
  // 终身
  LIFELONG: 6,
  // 周
  WEEK: 7
}

export const guaranteePeriodUnitArray = [
  {
    label: '日',
    value: guaranteePeriodUnit.DAY
  },
  {
    label: '月',
    value: guaranteePeriodUnit.MONTH
  },
  {
    label: '年',
    value: guaranteePeriodUnit.YEAR
  },
  {
    label: '岁',
    value: guaranteePeriodUnit.AGE
  },
  {
    label: '季度',
    value: guaranteePeriodUnit.SEASON
  },
  {
    label: '终身',
    value: guaranteePeriodUnit.LIFELONG
  },
  {
    label: '周',
    value: guaranteePeriodUnit.WEEK
  }
]

// 缴费期限单位
export const paymentPeriodUnit = {
  // 日
  DAY: 1,
  // 月
  MONTH: 2,
  // 年
  YEAR: 3,
  // 岁
  AGE: 4,
  // 趸交
  SINGLE: 5
}

export const paymentPeriodUnitArray = [
  {
    label: '日',
    value: paymentPeriodUnit.DAY
  },
  {
    label: '月',
    value: paymentPeriodUnit.MONTH
  },
  {
    label: '年',
    value: paymentPeriodUnit.YEAR
  },
  {
    label: '岁',
    value: paymentPeriodUnit.AGE
  },
  {
    label: '趸交',
    value: paymentPeriodUnit.SINGLE
  }
]

// 险种类型
export const insuranceTypes = {
  STRICKEN: 'stricken',
  HEALTH: 'health',
  LIFE: 'life',
  ANNUITY: 'annuity',
  ACCIDENT: 'accident',
  PROPERTY: 'property',
  TRAVEL: 'travel'
}

export const insuranceTypeArray = [
  {
    label: '重疾险',
    value: insuranceTypes.STRICKEN
  },
  {
    label: '医疗险',
    value: insuranceTypes.HEALTH
  },
  {
    label: '寿险',
    value: insuranceTypes.LIFE
  },
  {
    label: '年金险',
    value: insuranceTypes.ANNUITY
  },
  {
    label: '意外险',
    value: insuranceTypes.ACCIDENT
  },
  {
    label: '财产险',
    value: insuranceTypes.PROPERTY
  },
  {
    label: '旅游险',
    value: insuranceTypes.TRAVEL
  }
]