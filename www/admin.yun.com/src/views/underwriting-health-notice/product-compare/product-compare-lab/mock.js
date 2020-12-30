// 说明， 此文件为模板数据格式说明。
let list = [
  {
    base_info: {
      checkAll: false,
      list: {
        'evaluation_product.product_tag_display_str': {
          hadChild: false
        },
        'evaluation_product.select_pay_period': {
          hadChild: false
        }
      },
      checked: []
    },
    disease_guarantee: {
      checkAll: false,
      checked: [],
      list: {
        'evaluation_product.waiting_days_display_str': {
          hadChild: false
        },
        'invalid_serious_disease_guarantee': {
          hadChild: true,
          checkAll: false,
          checked: [],
          list: {
            'evaluation_product_serious_info.serious_quantity_display_str': {
              hadChild: false
            },
            'evaluation_product_serious_info.disease_group_display_str': {
              hadChild: false
            }
          }
        }
      }
    }
  },
  {
    base_info: {
      checkAll: false,
      list: {
        'evaluation_product.product_tag_display_str': {
          hadChild: false
        },
        'evaluation_product.select_pay_period': {
          hadChild: false
        }
      },
      checked: []
    },
    disease_guarantee: {
      checkAll: false,
      checked: [],
      list: {
        'evaluation_product.waiting_days_display_str': {
          hadChild: false
        },
        'invalid_serious_disease_guarantee': {
          hadChild: false
        },
        'invalid_cancer_guarantee': {
          hadChild: false
        }
      }
    }
  },
  {} // 模仿“无模板
]

export default list
