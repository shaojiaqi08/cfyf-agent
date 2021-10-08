<template>
  <el-scrollbar style="height: 90vh;">
    <el-card class="mb10">
      <div class="card-header">
        <div class="name-info">
          <div class="family-avatar active" :class="{ [`${relationFormat(scheme)}`]: true }"></div>
          <span class="label">
            {{ scheme.name || scheme.recognizee_policy_member.member_name }}
          </span>
        </div>
        <div>
          <div class="tag orange">
            被保人：{{ familyTypes.find(i => i.value === scheme.recognizee_policy_member.relation).label }}
          </div><div class="tag orange">
            性别：{{ sexTypes.find(i => i.value == scheme.recognizee_policy_member.sex).label }}
          </div><div class="tag orange">
            年龄：{{ calcAge(scheme.recognizee_policy_member.birthday) }}岁
          </div><div class="tag blue">
            投保人：{{ familyTypes.find(i => i.value === scheme.policy_holder_member.relation).label }}
          </div><div class="tag blue">
            性别：{{ sexTypes.find(i => i.value == scheme.policy_holder_member.sex).label }}
          </div><div class="tag blue">
            年龄：{{ calcAge(scheme.policy_holder_member.birthday) }}岁
          </div>
          <el-popover
            placement="bottom"
            width="200"
            :value="isRemoveSchemePopover"
            trigger="manual">
            <div class="mt10">
              <i class="el-icon-warning warn-icon"></i>确定删除此方案吗？
            </div>
            <div class="popover-remove-footer">
              <el-button type="text" size="mini" @click="isRemoveSchemePopover = false">取消</el-button>
              <el-button type="primary" size="mini" @click="removeScheme">确认</el-button>
            </div>
            <div class="remove-scheme" @click="isRemoveSchemePopover = true" slot="reference">
              删除
            </div>
          </el-popover>
        </div>
      </div>
      <div class="card-body">
        <div class="product-item"
             v-for="(item, index) in selectedProduct"
             :key="index">
          <div class="header">
            <div class="label">
              {{ item.product_name }}
            </div>
            <div>
              <div class="tag-group">
                <div class="tag">{{ item.first_product_category_name }}</div>
                <div class="tag">{{ item.supplier_name }}</div>
              </div>
              <div class="button-group">
                <div class="move-button">
                  <i class="button iconfont iconxiao_shangzhixiangjiantou mr8"
                    :class="{ disabled: !index }"
                    @click="changeSelectedPosition('top', index)"></i>
                  <i class="button iconfont iconxiao_xiazhixiangjiantou"
                    :class="{ disabled: index === selectedProduct.length - 1 }"
                    @click="changeSelectedPosition('bottom', index)"></i>
                </div>
                <i class="iconfont iconxiao_yuanxingguanbi close"
                  @click="removeProduct(index)"></i>
                <!-- <el-popover
                  placement="bottom"
                  width="200"
                  :value="isRemoveProductPopover"
                  trigger="manual">
                  <div class="mt10">
                    <i class="el-icon-warning warn-icon"></i>确定删除此产品吗？
                  </div>
                  <div class="popover-remove-footer">
                    <el-button type="text" size="mini" @click="isRemoveProductPopover = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="removeProduct(index)">确认</el-button>
                  </div>
                  <div class="remove-scheme" @click="isRemoveProductPopover = true" slot="reference">
                    删除
                  </div>
                </el-popover> -->
              </div>
            </div>
          </div>
          <div class="body">
            <div class="content-item">
              <div class="label">社保</div>
              <div class="value">
                {{ +item.has_social_security ? '有' : '无' }}
              </div>
            </div>
            <div class="content-item">
              <div class="label">附加险</div>
              <div class="value">
                {{ insuranceFormat(item.insurances)[0] }}
                <el-popover
                  v-if="item.insurances.length > 1"
                  placement="bottom"
                  width="300"
                  trigger="hover"
                >
                  <div class="guarantee-title">附加险</div>
                  <div
                    v-for="(item, idx) in insuranceFormat(item.insurances)"
                    :key="idx"
                    class="guarantee-item"
                  >{{ item }}</div>
                  <i style="color: #FF9000;" class="iconfont fw400 iconxiao_chakangengduo_cheng" slot="reference"></i>
                </el-popover>
              </div>
            </div>
            <div class="content-item">
              <div class="label">缴费期限</div>
              <div class="value">
                {{ +item.pay_period.split('_')[0] || '' }}
                {{ paytimeTypes.filter(i => i.value == item.pay_period.split('_')[1])[0].label }}
              </div>
            </div>
            <div class="content-item">
              <div class="label">保障期限</div>
              <div class="value">
                <span v-if="guaranteeTimeTypes.filter(i => i.value == item.guarantee_period.split('_')[1])[0].value !== '5'">
                  {{ +item.guarantee_period.split('_')[0] || '' }}
                  {{ guaranteeTimeTypes.filter(i => i.value == item.guarantee_period.split('_')[1])[0].label }}
                </span>
                <span v-else>
                  {{ guaranteeTimeTypes.filter(i => i.value == item.guarantee_period.split('_')[1])[0].label.replace('n', v => {
                    return item.guarantee_period.split('_')[0]
                  }) }}
                </span>
              </div>
            </div>
            <div class="content-item">
              <div class="label">保额</div>
              <div class="value">
                {{ item.base_coverage_value }}
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="guarantee">
              {{ item.guarantee_responsibilities[0] }}
              <el-popover
                v-if="item.guarantee_responsibilities.length > 1"
                placement="bottom"
                width="300"
                trigger="hover"
              >
                <div class="guarantee-title">保障内容</div>
                <div
                  v-for="(item, idx) in item.guarantee_responsibilities"
                  :key="idx"
                  class="guarantee-item"
                >{{ item }}</div>
                <i class="iconfont iconxiao_chakangengduo_cheng" slot="reference"></i>
              </el-popover>
            </div>
            <div class="result">
              <el-button
                class="clause"
                type="text"
                v-if="item.common_terms.length"
                @click="checkCommonTerms(item.common_terms)"
              >查看条款</el-button>
              <div class="count">{{ item.total_premium }} <span class="fs16">元</span></div>
            </div>
          </div>
        </div>
        <div v-if="!selectedProduct.length"
             class="empty-product-list">
          未添加产品方案
        </div>
        <div class="product-item"
             v-if="selectedProduct.length">
          <div class="title fl">保费合计</div>
          <div class="count-value fr">
            {{ selectedProduct.reduce((p, n) => p + n.total_premium , 0) }}
            <span class="fs16">元</span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="header mt20">
          方案配置说明
          <el-switch
            class="ml10"
            v-model="illustration.has_illustration"
            active-color="#FF9B19"
            inactive-color="#E6E6E6">
          </el-switch>
          <span class="switcher-tips" :class="{ active: illustration.has_illustration }">
            {{ illustration.has_illustration ? '展示' : '不展示' }}
          </span>
        </div>
        <el-input type="textarea"
                  class="mt10"
                  v-if="illustration.has_illustration"
                  v-model="illustration.illustration"
                  placeholder="需对客户进行展示，请输入客户家庭基本信息分析内容"
                  rows="4"></el-input>
      </div>
    </el-card>
    <el-dialog width="400px" :visible="isCommonTermShow" title="产品条款" @close="modalClose">
      <div
        v-for="(item, index) in commonTerms"
        :key="index"
        class="term-link"
        @click="checkTermLink(item.file_url)"
      >{{ item.name }}</div>
    </el-dialog>
  </el-scrollbar>
</template>

<script>
import { familyTypes, sexTypes, paytimeTypes, guaranteeTimeTypes } from '../config'
import { relationFormat } from '../utils'
import calcAge from '@/utils/calc-age'
export default {
  props: {
    scheme: {
      required: true,
      type: Object
    },
    selected: {
      required: true,
      type: Array
    },
    illustration: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      value1: '',
      familyTypes,
      paytimeTypes,
      commonTerms: [],
      guaranteeTimeTypes,
      sexTypes,
      selectedProduct: [],
      isCommonTermShow: false,
      isRemoveSchemePopover: false,
      isRemoveProductPopover: false,
      productModel: {
        proposal_id: '',
        guarantee_period_value: '',
        guarantee_period_unit: '',
        guarantee_period_text: '',
        pay_period_value: '',
        pay_period_unit: '',
        pay_period_text: '',
        guarantee_quota: '',
        guarantee_quota_text: '',
        has_social_security: 1,
        insurances: []
      }
    }
  },
  watch: {
    selected(v) {
      this.selectedProduct = v
    }
  },
  mounted() {
    this.selectedProduct = this.selected
  },
  methods: {
    relationFormat,
    calcAge(val) {
      if (!val) return
      let formatVal = [...(val + '')]
      formatVal.splice(4, 0, '-')
      formatVal.splice(7, 0, '-')
      return calcAge(formatVal.join(''))
    },
    removeScheme() {
      this.$emit('removeScheme')
      this.isRemoveSchemePopover = false
    },
    removeProduct(index) {
      this.$confirm('是否删除该产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedProduct.splice(index, 1)
      })
    },
    changeSelectedPosition(type, index) {
      if (type === 'top') {
        const upItem = this.selectedProduct[index - 1]
        const downItem = this.selectedProduct[index]

        this.$set(this.selectedProduct, index, upItem)
        this.$set(this.selectedProduct, index - 1, downItem)
      } else {
        const upItem = this.selectedProduct[index]
        const downItem = this.selectedProduct[index + 1]

        this.$set(this.selectedProduct, index, downItem)
        this.$set(this.selectedProduct, index + 1, upItem)
      }
    },
    modalClose() {
      this.isCommonTermShow = false
    },
    checkCommonTerms(v) {
      this.isCommonTermShow = true
      this.commonTerms = v
    },
    checkTermLink(link) {
      window.open(link)
    },
    insuranceFormat(data, index) {
      return data.filter(i => i.id).map(item => {
        return `${item.name}${item.type === 'accident' ? `:${item.coverageText}` : ''}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-card__body {
  padding: 16px;
}
.term-link {
  color: #ff9000;
  line-height: 30px;
  cursor: pointer;
}
.switcher-tips {
  margin-left: 6px;
  color: #FF5151;
  font-size: 14px;
  vertical-align: middle;
  &.active {
    color: #808080;
  }
}
.guarantee-title {
  margin-bottom: 6px;
  color: #333333;
  font-size: 16px;
  font-weight: bold;
}
.guarantee-item {
  line-height: 22px;
}
.warn-icon {
  margin-right: 6px;
  color: #FF5151;
}
.remove-scheme {
  display: inline-block;
  padding-left: 16px;
  margin-left: 12px;
  margin-right: 4px;
  color: #808080;
  font-size: 14px;
  border-left: 1px solid #E6E6E6;
  cursor: pointer;
}
.popover-remove-footer {
  margin-top: 20px;
  text-align: right;
}
.card-body {
  margin-top: 16px;
  // height: 60vh;
  .empty-product-list {
    padding: 74px 0;
    text-align: center;
    color: #808080;
  }
  .product-item {
    margin-bottom: 8px;
    padding: 16px;
    background-color: #F5F5F5;
    border: 1px solid #E6E6E6;
    overflow: hidden;
    .title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
    .count-value {
      color: #FF9000;
      font-size: 18px;
      font-weight: bold;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label {
        display: inline-block;
        width: 280px;
        color: #333;
        font-size: 16px;
        font-weight: bold;
        overflow: hidden;
      }
      .tag-group {
        display: inline-block;
        // width: 250px;
        margin-right: 16px;
        text-align: right;
        vertical-align: bottom;
        .tag {
          display: inline-block;
          padding: 2px 10px;
          font-weight: 500;
          font-size: 12px;
          color: #999;
          border: 1px solid #E9E9EB;
          border-radius: 4px;
          background-color: #fff;
        }
      }
      .button-group {
        display: inline-block;
        width: 86px;
        .move-button {
          display: inline-block;
          padding-right: 10px;
          border-right: 1px solid #E6E6E6;
          .button {
            color: #9D9D9D;
            cursor: pointer;
            &:hover {
              color: #FF9900;
            }
            &.disabled {
              color: #CECECE;
              cursor: not-allowed;
            }
          }
        }
      }
      .close {
        padding-left: 10px;
        color: #FF5151;
        cursor: pointer;
      }
    }
    .body {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-top: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #E6E6E6;
      .content-item {
        width: 144px;
        line-height: 24px;
        .label {
          color: #333;
          font-size: 14px;
        }
        .value {
          color: #333;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 0;
      .guarantee {
        i {
          color: #FF9900;
        }
      }
      .result {
        width: 55%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .clause {
          display: inline-block;
          margin-right: 10px;
        }
        .count {
          display: inline-block;
          margin-right: 10px;
          color: #333;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  .name-info {
    width: 160px;
    display: flex;
    align-items: center;
  }
  .label {
    margin-left: 4px;
    vertical-align: super;
  }
  .tag {
    display: inline-block;
    padding: 2px 10px;
    margin-right: 8px;
    border-radius: 4px;
    font-size: 12px;
    &:last-child {
      margin-right: 0 !important;
    }
    &.orange {
      color: #FF9000;
      background-color: #FFF3E5;
      border: 1px solid #FFE8CD;
    }
    &.blue {
      color: #4497EB;
      background-color: #EEF6FF;
      border: 1px solid #E5E7F2;
    }
  }
}
.family-avatar {
  display: inline-block;
  width: 24px;
  height: 30px;
  background: url("../../../../assets/images/all_member.png") no-repeat center;
  background-size: cover;
  &.active {
    background: url("../../../../assets/images/all-member-active.png") no-repeat center;
  }
  &.male {
    background: url("../../../../assets/images/family-male.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/familfy-male-active.png") no-repeat center;
    }
  }

  &.female {
    background: url("../../../../assets/images/familfy-female.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/family-female-active.png") no-repeat center;
    }
  }

  &.son {
    background: url("../../../../assets/images/family-son-mail.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/family-son-mail-active.png") no-repeat center;
    }
  }

  &.daughter {
    background: url("../../../../assets/images/family-daughter.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/family-daughter-active.png") no-repeat center;
    }
  }

  &.grandma {
    background: url("../../../../assets/images/family-grandma.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/family-grandma-active.png") no-repeat center;
    }
  }

  &.grandpa {
    background: url("../../../../assets/images/family-grandpa.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/family-grandpa-active.png") no-repeat center;
    }
  }

  &.no-set-sex {
    background: url("../../../../assets/images/no-set-sex.png") no-repeat center;
    background-size: cover;
    &.active {
      background: url("../../../../assets/images/no-set-sex.png") no-repeat center;
    }
  }
}
</style>
