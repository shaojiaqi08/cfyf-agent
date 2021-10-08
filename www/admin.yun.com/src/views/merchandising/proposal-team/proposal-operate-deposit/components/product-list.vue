<template>
  <div>
    <div class="header">
      <el-select
        v-model="schemesFilterModel.product_id_and_types"
        filterable
        remote
        multiple
        clear
        clearable
        class="product-selecter"
        :remote-method="remoteMethod"
        placeholder="搜索或选择产品"
        @change="getProductList"
      >
        <el-option
          v-for="item in insuranceProductList"
          :key="`${item.id}_${item.type}`"
          :value="`${item.id}_${item.type}`"
          :label="item.name"
        ></el-option>
      </el-select>
    </div>
    <div class="filter">
      <insurance-types @search="search"></insurance-types>
      <insurance-company @search="search"></insurance-company>
      <payment-period @search="search"></payment-period>
      <guarantee-times @search="search"></guarantee-times>
      <coverage @search="search"></coverage>
    </div>
    <el-scrollbar class="product-list" v-loading="loading">
      <div v-infinite-scroll="load">
        <div
          class="product-item"
          v-for="(product, index) in productStateList"
          :key="index"
          v-loading="product.isLoading">
          <div class="header">
            <div class="label">{{ product.product_name }}</div>
            <div class="tags">
              <div class="tag">{{ product.first_product_category_name }}</div><div class="tag">{{ product.supplier_name }}</div>
            </div>
          </div>
          <div class="body">
            <div class="row">
              <div class="label">社保</div>
              <div class="content">
                <el-radio
                  v-model="product.has_social_security"
                  label="1"
                  @change="changeRadio($event, index)"
                >有</el-radio>
                <el-radio
                  v-model="product.has_social_security"
                  label="0"
                  @change="changeRadio($event, index)"
                >无</el-radio>
              </div>
            </div>
            <div class="row" style="align-items: baseline;margin-bottom: 8px;">
              <div class="label">附加险</div>
              <div class="content">
                <el-checkbox-group v-model="product.insurance_ids">
                  <div class="checkbox-content"
                      v-for="(option, idx) in productList[index].product_insurances"
                      :key="idx">
                    <el-checkbox
                        :disabled="((option.select_status + '' !== 'undefined') && !option.select_status) || !!option.is_main"
                        :value="option.id"
                        :label="option.id"
                        @change="changeCheckbox($event, index, option)"
                      >
                      <text-hidden-ellipsis
                        :popover-tip="option.name"
                        :width="productStateList[index].insurances[idx] && productStateList[index].insurances[idx].id && option.type === 'accident' ? 100 : 180">
                        {{ option.name }}
                      </text-hidden-ellipsis>
                    </el-checkbox>
                    <el-select v-model="productStateList[index].insurances[idx].coverage"
                                size="mini"
                                style="width: 80px;margin-top: 4px;"
                                @change="changeAccidentCheckbox($event, index)"
                                v-if="productStateList[index].insurances[idx] && productStateList[index].insurances[idx].id && option.type === 'accident'">
                      <el-option v-for="a in option.coverages"
                                  :key="a.value"
                                  :value="a.value"
                                  :label="a.value_text">{{ a.value_text }}
                      </el-option>
                    </el-select>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
            <div class="inline-row">
              <div class="label">缴费期限</div>
              <div class="content">
                <el-select
                  size="mini"
                  class="select"
                  v-model="product.pay_period"
                  @change="changeSelector($event, index)"
                >
                  <el-option
                    v-for="item in productList[index].pay_period"
                    :key="item.text"
                    :value="`${item.value}_${item.unit}`"
                    :label="item.text"
                  ></el-option>
                </el-select>
              </div>
              <div class="label">保障期限</div>
              <div class="content">
                <el-select
                  size="mini"
                  class="select"
                  v-model="product.guarantee_period"
                  @change="changeSelector($event, index)"
                >
                  <el-option
                    v-for="item in productList[index].guarantee_period"
                    :key="item.text"
                    :value="`${item.value}_${item.unit}`"
                    :label="item.text"
                  ></el-option>
                </el-select>
              </div>
              <div class="label">保额</div>
              <div class="content">
                <el-select
                  size="mini"
                  class="select"
                  v-model="product.base_coverage_value"
                  @change="changeSelector($event, index)"
                >
                  <el-option
                    v-for="item in productList[index].base_coverage_value"
                    :key="item.text"
                    :value="`${item.value}`"
                    :label="item.text"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="guarantee">
              {{ product.guarantee_responsibilities[0] }}
              <el-popover
                v-if="product.guarantee_responsibilities.length > 1"
                placement="bottom"
                width="300"
                trigger="hover"
              >
                <div class="guarantee-title">保障内容</div>
                <div
                  v-for="(item, idx) in product.guarantee_responsibilities"
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
                v-if="product.common_terms.length"
                @click="checkCommonTerms(product.common_terms)"
              >查看条款</el-button>
              <div class="count" v-if="product.isError">{{ product.total_premium }}</div>
              <div class="count" v-else>{{ product.total_premium }} 元</div>
              <template v-if="!isProductAdded(product)">
                <el-button type="primary"
                          size="small"
                          :disabled="product.isError"
                          @click="addProduct(product)">
                  <i class="iconfont iconchaoxiao_jiahao fs12"></i>
                  添加
                </el-button>
              </template>
              <template v-else>
                <el-button type="primary"
                          size="small"
                          @click="updateProduct(product)">
                  <i class="iconfont iconchaoxiao_shuaxin fs12"></i>
                  更新
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="reach-bottom" v-if="totalPage === currentPage + 1">已经到底了</div>
      <div class="empty-product-list" v-if="!productList.length">暂时搜索不到合适的产品</div>
    </el-scrollbar>
    <el-dialog width="400px" :visible="isCommonTermShow" title="产品条款" @close="modalClose">
      <div
        v-for="(item, index) in commonTerms"
        :key="index"
        class="term-link"
        @click="checkTermLink(item.file_url)"
      >{{ item.name }}</div>
    </el-dialog>
  </div>
</template>

<script>
import InsuranceTypes from './filters/insurance-types'
import Coverage from './filters/coverage'
import GuaranteeTimes from './filters/guarantee-times'
import InsuranceCompany from './filters/insurance-company'
import PaymentPeriod from './filters/payment-period'
import TextHiddenEllipsis from '@/components/text-hidden-ellipsis'
import {
  getProductList,
  getInsuranceProductList,
  getCost
} from '@/apis/modules/proposal'
export default {
  components: {
    InsuranceTypes,
    Coverage,
    GuaranteeTimes,
    InsuranceCompany,
    PaymentPeriod,
    TextHiddenEllipsis
  },
  props: {
    relation: {
      required: true,
      type: Object
    },
    selected: {
      required: true
    }
  },
  data() {
    return {
      loading: false,
      productList: [],
      productListWithoutPage: [],
      productStateList: [],
      insuranceProductList: [],
      commonTerms: [],
      isCommonTermShow: false,
      currentPage: 0,
      limit: 5,
      totalPage: 1,
      scrollLock: false,
      prevScrollLoad: false,
      schemesFilterModel: {
        first_product_category_ids: [],
        supplier_ids: [],
        product_id_and_types: [],
        pay_period: {
          min: '',
          max: '',
          unit: '1'
        },
        guarantee_period: {
          min: '',
          max: '',
          unit: '1'
        },
        base_coverage_value: {
          min: '',
          max: '',
          unit: '10_thousand_yuan'
        }
      }
    }
  },
  watch: {
    currentStep(v) {
      this.getProductList()
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    load() {
      if (this.scrollLock) {
        this.prevScrollLoad = true
      }
      if (!this.scrollLock && (this.totalPage > this.currentPage + 1)) {
        this.scrollLock = true
        this.currentPage += 1
        const loadProducts = this.productListWithoutPage.slice(this.currentPage * this.limit, (this.currentPage + 1) * this.limit)
        this.productList = this.productList.concat(loadProducts)
        this.productListDataFormat(loadProducts, this.currentPage * this.limit)
        this.getCostDataFormat(loadProducts, this.currentPage * this.limit)
      }
    },
    isProductAdded(item) {
      return this.selected.find(i => {
        return i.product_id === item.product_id
      })
    },
    changeCheckbox(value, index, option) {
      const state = this.productList[index].product_insurances.map(
        (item, idx) => {
          if (
            this.productStateList[index].insurance_ids.indexOf(item.id) !== -1
          ) {
            if (item.type === 'accident') {
              return Object.assign({}, item, {
                coverage:
                  (this.productStateList[index].insurances[idx] &&
                    this.productStateList[index].insurances[idx].coverage) ||
                  this.productList[index].product_insurances[idx].coverages[0]
                    .value
              })
            }
            return Object.assign({}, item, {
              coverage:
                (this.productStateList[index].insurances[idx] &&
                  this.productStateList[index].insurances[idx].coverage) ||
                ''
            })
          } else {
            return {
              id: null,
              coverage: null,
              type: item.type
            }
          }
        }
      )

      this.productStateList[index].insurances = state
      this.getCost(value, index)
    },
    changeSelector(value, index) {
      this.getCost(value, index)
    },
    changeRadio(value, index) {
      this.getCost(value, index)
    },
    changeAccidentCheckbox(value, index) {
      this.getCost(value, index)
    },
    addProduct(product) {
      const prod = JSON.parse(JSON.stringify(product))
      this.$emit('addProduct', prod)
    },
    updateProduct(product) {
      const prod = JSON.parse(JSON.stringify(product))
      this.$emit('updateProduct', prod)
    },
    getCost(value, index) {
      const relation = this.relation
      const productState = this.productStateList[index]
      productState.isLoading = true
      const data = {
        product_id: productState.product_id,
        guarantee_period_value: productState.guarantee_period.split('_')[0],
        guarantee_period_unit: productState.guarantee_period.split('_')[1],
        pay_period_value: productState.pay_period.split('_')[0],
        pay_period_unit: productState.pay_period.split('_')[1],
        guarantee_quota: productState.base_coverage_value,
        has_social_security: productState.has_social_security,
        recognizee_policy_id: relation.recognizee_policy_member.id,
        recognizee_policy_sex: relation.recognizee_policy_member.sex,
        recognizee_policy_birthday: relation.recognizee_policy_member.birthday,
        policy_holder_id: relation.policy_holder_member.id,
        policy_holder_sex: relation.policy_holder_member.sex,
        policy_holder_birthday: relation.policy_holder_member.birthday,
        insurances: productState.insurances
          .filter(x => x.id)
          .map(i => ({ id: i.id, coverage: i.coverage })),
        insurance_ids: productState.insurance_ids
      }

      getCost(data)
        .then(res => {
          let insurances = res.insurances.filter(
            item => item.select_status === 1
          )
          this.productList[index].product_insurances = res.insurances.map(
            i => i
          )
          productState.insurances = productState.insurances.map(
            (item, index) => {
              let target = res.insurances.filter(i => i.id === item.id)[0]
              if (target && target.coverages) {
                return Object.assign({}, item, {
                  coverageText: target.coverages.filter(
                    y => item.coverage === y.value
                  )[0].value_text
                })
              }
              return item
            }
          )

          productState.total_premium = res.total_premium
          productState.isLoading = false
          productState.isError = false
          productState.insurance_ids = insurances.map(y => y.id)
          productState.guarantee_responsibilities = insurances
            .filter(i => i.guarantee_responsibilities)
            .reduce((prev, next) => {
              return prev.concat(
                next.guarantee_responsibilities.map(
                  y => `${y.name}: ${y.value_text}`
                )
              )
            }, [])
        })
        .catch(error => {
          const message = error.message
          productState.total_premium = message
          productState.guarantee_responsibilities = ['无']
          productState.isLoading = false
          productState.isError = true
        })
    },
    modalClose() {
      this.isCommonTermShow = false
    },
    checkTermLink(link) {
      window.open(link)
    },
    checkCommonTerms(v) {
      this.isCommonTermShow = true
      this.commonTerms = v
    },
    search(value) {
      this.searchModel = Object.assign(this.schemesFilterModel, value)
      this.getProductList()
    },
    remoteMethod(value) {
      const query = { name: value }
      getInsuranceProductList(query)
        .then(res => {
          this.insuranceProductList = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    getProductList() {
      this.loading = true
      const {
        product_id_and_types,
        pay_period,
        guarantee_period,
        base_coverage_value
      } = this.schemesFilterModel

      const query = Object.assign({}, this.schemesFilterModel, {
        product_id_and_types:
          (product_id_and_types.length &&
            product_id_and_types.map(i => ({
              id: i.split('_')[0],
              type: i.split('_')[1]
            }))) ||
          '',
        pay_period: pay_period.unit ? JSON.stringify(pay_period) : '',
        guarantee_period: guarantee_period.unit
          ? JSON.stringify(guarantee_period)
          : '',
        base_coverage_value: base_coverage_value.unit
          ? JSON.stringify(base_coverage_value)
          : ''
      })
      this.productList = []
      this.productListWithoutPage = []
      this.productStateList = []
      this.currentPage = 0

      getProductList(query)
        .then(res => {
          this.loading = false
          this.productListWithoutPage = JSON.parse(JSON.stringify(res))
          this.productList = res.slice(0, this.limit)
          this.totalPage = Math.ceil(res.length / this.limit)
          this.productListDataFormat(this.productList, 0)
          this.getCostDataFormat(this.productList, 0)
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    async getCostDataFormat(res, current) {
      const relation = this.relation
      let tag = current
      for (let item of res) {
        const data = {
          product_id: item.id,
          guarantee_period_value: item.guarantee_period[0].value,
          guarantee_period_unit: item.guarantee_period[0].unit,
          pay_period_value: item.pay_period[0].value,
          pay_period_unit: item.pay_period[0].unit,
          guarantee_quota: item.base_coverage_value[0].value,
          has_social_security: '1',
          recognizee_policy_id: relation.recognizee_policy_member.id,
          recognizee_policy_sex: relation.recognizee_policy_member.sex,
          recognizee_policy_birthday:
            relation.recognizee_policy_member.birthday,
          policy_holder_id: relation.policy_holder_member.id,
          policy_holder_sex: relation.policy_holder_member.sex,
          policy_holder_birthday: relation.policy_holder_member.birthday,
          insurances: item.product_insurances
            .filter(i => i.is_main === 1)
            .map(i => ({
              id: i.id,
              coverage: i.coverages.length ? i.coverages[0].value : ''
            }))
        }

        try {
          let response = await getCost(data)
          let insurances = response.insurances.filter(
            item => item.select_status === 1
          )
          this.productList[tag].product_insurances = response.insurances.map(
            i => i
          )
          this.productStateList[tag].total_premium = response.total_premium
          this.productStateList[tag].isLoading = false
          this.productStateList[tag].guarantee_responsibilities = insurances
            .filter(i => i.guarantee_responsibilities)
            .reduce((prev, next) => {
              return prev.concat(
                next.guarantee_responsibilities.map(
                  y => `${y.name}: ${y.value_text}`
                )
              )
            }, [])
        } catch (error) {
          const message = error.message
          this.productStateList[tag].total_premium = message
          this.productStateList[tag].guarantee_responsibilities = ['无']
          this.productStateList[tag].isLoading = false
          this.productStateList[tag].isError = true
        }

        tag += 1
      }

      this.scrollLock = false
      if (this.prevScrollLoad) {
        this.prevScrollLoad = false
        this.load()
      }
    },
    productListDataFormat(res, current) {
      let data = res.map(item => ({
        common_terms: item.common_terms,
        first_product_category_name: item.first_product_category_name,
        supplier_name: item.supplier_name,
        product_name: item.proposal_product_name,
        pay_period: `${item.pay_period[0].value}_${item.pay_period[0].unit}`,
        guarantee_period: `${item.guarantee_period[0].value}_${item.guarantee_period[0].unit}`,
        base_coverage_value: `${item.base_coverage_value[0].value}`,
        product_id: item.id,
        has_social_security: '1',
        insurances: item.product_insurances
          .filter(i => i.is_main === 1)
          .map(i => ({
            id: i.id,
            coverage: i.coverages.length ? i.coverages[0].value : '',
            name: i.name,
            type: i.type,
            coverageText: i.coverages.length ? i.coverages[0].value_text : ''
          })),
        insurance_ids: item.product_insurances
          .filter(i => i.is_main === 1)
          .map(i => i.id),
        insurance_premium: null,
        guarantee_responsibilities: [],
        total_premium: null,
        isLoading: true,
        isError: false
      }))
      this.productStateList = this.productStateList.concat(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.reach-bottom {
  margin-top: 15px;
  color: #999;
  text-align: center;
}
.term-link {
  color: #ff9000;
  line-height: 30px;
  cursor: pointer;
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .product-selecter {
    width: 100%;
  }
  .label {
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
  .search-input {
    width: 300px;
  }
}
.checkbox-content {
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 8px;
  &:last-child {
    margin-right: 0;
  }
  /deep/ .el-checkbox__label {
    vertical-align: text-top !important;
  }
}
.filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.product-list {
  margin-top: 16px;
  padding-bottom: 20px;
  height: 83vh;
  .empty-product-list {
    padding: 150px;
    text-align: center;
  }
  .product-item {
    margin-bottom: 8px;
    padding: 16px;
    width: 568px;
    background-color: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label {
        color: #333;
        font-size: 16px;
        line-height: 24px;
        flex: 0 0 260px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
      }
      .tag {
        display: inline-block;
        flex: 0 0 240px;
        padding: 2px 8px;
        margin-right: 4px;
        border: 1px solid #e9e9eb;
        border-radius: 4px;
        background-color: #fff;
        color: #999;
        font-weight: bold;
        font-size: 12px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .body {
      margin-top: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e6e6e6;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .label {
          display: inline-block;
          width: 60px;
        }
        .content {
          display: inline-block;
          width: 470px;
        }
      }
      .inline-row {
        .label {
          display: inline-block;
          padding-right: 4px;
          width: 60px;
          text-align: right;
          vertical-align: middle;
        }
        .content {
          display: inline-block;
          margin-right: 17px;
          width: 100px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 0;
      .guarantee {
        display: flex;
        align-items: center;
        i {
          margin-left: 10px;
          color: #ff9000;
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
</style>
