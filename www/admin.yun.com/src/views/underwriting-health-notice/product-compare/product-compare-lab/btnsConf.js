export let insurance_class = [ // 险种
  {
    label: '重疾险',
    value: 'stricken',
    type: ['adviser']
  }, {
    label: '医疗险',
    value: 'health',
    type: ['putter', 'adviser']
  }, {
    label: '普通寿险',
    value: 'life',
    type: ['putter', 'adviser']
  },{
    label: '增额寿险',
    value: 'incremental_life',
    type: ['putter', 'adviser']
  }, {
    label: '意外险',
    value: 'accident',
    type: ['putter', 'adviser']
  }, {
    label: '无',
    value: 'no',
    type: ['no']
  }
]
export let client = [ // 端
  {
    label: '投放端',
    value: 'putter'
  }, {
    label: '顾问端',
    value: 'adviser'
  }, {
    label: '无',
    value: 'no'
  }
]
