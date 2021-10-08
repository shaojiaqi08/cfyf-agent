export const professionTypes = [
  { label: '一类职业', value: '1' },
  { label: '二类职业', value: '2' },
  { label: '三类职业', value: '3' },
  { label: '四类职业', value: '4' },
  { label: '五类职业', value: '5' },
  { label: '六类职业', value: '6' }
]
// 保障类型
export const guarateeTypes = [
  { label: '基本保额百分比', value: 'relative' },
  { label: '固定保额', value: 'fixed' },
  { label: '文本说明', value: 'text' }
]
// 保障期限
export const guaranteeTimeTypes = [
  { label: '年', value: '1' },
  { label: '季', value: '2' },
  { label: '月', value: '3' },
  { label: '天', value: '4' },
  { label: '至n周岁', value: '5' },
  { label: '终身', value: '6' }
]
// 缴费期限
export const paytimeTypes = [
  { label: '年', value: '1' },
  { label: '季', value: '2' },
  { label: '月', value: '3' },
  { label: '天', value: '4' },
  { label: '趸交', value: '5' },
  { label: '至n周岁', value: '6' }
]

// 基本保额
export const baseTypes = [
  { label: '元', value: 'yuan', multiple: 1 },
  { label: '万元', value: '10_thousand_yuan', multiple: 10000 }
]
// 费率模版
export const rateTemplateTypes = [
  { label: '重疾', value: 'serious' },
  { label: '寿险', value: 'life' },
  { label: '医疗', value: 'medical' },
  { label: '意外', value: 'accident' }
]
// 对象
export const insureTypes = [
  { label: '投保人', value: 'applicant' },
  { label: '被保人', value: 'insured' }
]

export const relativeTypes = [
  { label: '固定值', value: 'fixed' },
  { label: '百分比', value: 'relative' }
]
// 家庭
export const familyTypes = [
  { label: '父母', value: 'parent' },
  { label: '配偶', value: 'spouse' },
  { label: '本人', value: 'self' },
  { label: '子女', value: 'child' }
]
// 保存计划书类型
export const saveProposalTypes = {
  preview: { label: '预览', value: 1 },
  done: { label: '完成', value: 2 },
  hold: { label: '暂存', value: 3 }
}

// 产品来源
export const productFrom = {
  MANUALLY_ENTER: 'manually_enter',
  FROM_INSURANCE: 'from_insurance'
}

// 性别
export const sexTypes = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]