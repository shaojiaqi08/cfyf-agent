<template>
  <div v-loading="loading" style="height: 100%">
    <div class="search-bar">
      <el-form style="display: inline-block; font-size: 0px" class="search-bar-condition">
        <div class="left-header">
          <div class="flex-center mr16">
            <el-input
              clearable
              placeholder='搜索多个产品名称用","间隔'
              v-model.trim="formData.product_name"
              prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
              @input="selectProduct"
            ></el-input>
          </div>
          <div class="classify-box">
            <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in classifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
          </div>
        </div>
        <div class="right-header">
          <div class="right-num-box">
            <span v-if="selectNum != 0" class="right-num">{{selectNum}}</span>
            组合规则
          </div>
          <div class="formData-select-query-rule">
            <el-radio v-model="formData.query_rule" label="and">同时满足</el-radio>
            <el-radio v-model="formData.query_rule" label="or">满足其一</el-radio>
          </div>
          <div class="formData-select-input-box rel">
            <div class="formData-select-input rel" v-for="(item,index) in ruleList" :key="item.value">
              <div class="normal-div check">
                <i class="el-icon-check bold" v-if="item.isUseSearch"></i>
              </div>
              <div class="normal-div">
                <div class="el-form-item el-form-item--medium">
                  <label class="el-form-item__label rel">
                    病种:<i class="el-icon-warning-outline tip-info" title='使用半角"%"支持模糊检索，例如："乙%肝" = "乙肝"或"乙型肝炎"；"肺%结节" = "肺结节"或"肺部结节"或"肺部小结节" ；"DNA%阳性" = "HBV-DNA检查阳性"等。' ></i>
                  </label>
                  <div class="el-form-item__content">
                    <el-input v-model="item.illness_categorys_search" placeholder="请输入单一病种" @keyup.enter.native="selectProduct()"></el-input>
                  </div>
                </div>
              </div>
              <div class="normal-div">
                <div class="el-form-item el-form-item--medium">
                  <label class="el-form-item__label rel">
                    条件:<i class="el-icon-warning-outline tip-info" title='使用半角"%"支持模糊检索，例如："乙%肝" = "乙肝"或"乙型肝炎"；"肺%结节" = "肺结节"或"肺部结节"或"肺部小结节" ；"DNA%阳性" = "HBV-DNA检查阳性"等。' ></i>
                  </label>
                  <div class="el-form-item__content">
                    <el-input v-model="item.condition_search" placeholder="请输入单一条件" @keyup.enter.native="selectProduct()"></el-input>
                  </div>
                </div>
              </div>
              <div class="w400 normal-div">
                <el-form-item label="结论:">
                  <el-select style="width: 400px" v-model="item.conclusion_search" multiple :popper-append-to-body="false" placeholder="请选择">
                    <el-option
                      v-for="item in conclusionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="normal-div">
                <i class="el-icon-plus bold" @click="addItem"></i>
                <i class="el-icon-minus bold" @click="subItem(index)" v-if="ruleList.length != 1"></i>
              </div> 
            </div>
            <el-button class="button-all-reset" @click="resetList">重置</el-button>
          </div>
          <div class="button-box">
            <el-button class="supper-search" @click="supperSearch"><i class="el-icon-search"></i>合并展示</el-button>
            <el-button class="normal-search" type="primary" @click="search"><i class="el-icon-search"></i>搜索</el-button>
          </div>
          <i class="el-icon-arrow-up up-arrow"></i>
          <i class="el-icon-arrow-down down-arrow"></i>
        </div>
      </el-form>
    </div>
    <div class="underwrite-search-container">
      <side-filter-list
        label-key="product_name"
        value-key="product_name"
        :showFilter="false"
        v-model="selVal"
        @change="showDetail"
        :disabled="detailLoading"
        style="width: 280px"
        :listData="tableData"
      >
      
      </side-filter-list>
      <div class="detail-wrap underwrite-search" v-loading="detailLoading || loadingDetail" ref="detailWrap">
        <template v-if="tableData.length > 0">
          <div class="head flex-between">
            <p>{{ selVal }}</p>
            <div>
              调整字号
              <el-input-number
                class="ml16"
                :min="12"
                :max="24"
                v-model="setFontSize"
                size="small"
              ></el-input-number>
              <el-button
                v-if="$checkAuth('/underwrite-health-notice/generate_pictures')"
                class="ml16"
                type="primary"
                @click="createImg('imageDom')"
                size="small"><i class="iconfont iconxiao16_shengcheng mr4"></i> 生成图片</el-button>
              <el-button
                v-if="$checkAuth('/underwrite-health-notice/generate_pictures')"
                class="ml16"
                type="primary"
                @click="createImg('imageDom', true)"
                size="small"><i class="iconfont iconxiao16_dangqianchakan mr4"></i> 预览图片</el-button>

            </div>
          </div>
          <div ref="imageDom" style="height: calc(100% - 32px)">
            <el-table
              border
              :data="detailTableData"
              height="calc(100vh - 290px)"
              stripe
              class="not-select main-table"
              :style="{fontSize: setFontSize + 'px'}"
            >
              <el-table-column label="序号" prop="sequence_number" align="center" width="60px"></el-table-column>
              <template v-for="(item,index) in maxCategorysLength">
                <el-table-column
                  v-if="allConditionShow[index]"
                  width="200px"
                  :prop="`illness_categorys[${index}]`"
                  :label="`病种分类${index+1}`"
                  align="center"
                  :key="'illness_categorys' + index"
                ></el-table-column>
              </template>
              <template v-for="(item,index) in maxConditionLength">
                <el-table-column
                  v-if="allListShow[index]"
                  width="200px"
                  :prop="`conditions[${index}]`"
                  :label="`条件${index+1}`"
                  align="center"
                  :key="'conditions' + index"
                ></el-table-column>
              </template>
              <el-table-column label="结论" prop="conclusion" width="200px" align="center"></el-table-column>
              <el-table-column label="保险公司" prop="company" width="150px" align="center"></el-table-column>
              <el-table-column label="产品类别" prop="insurance_class" width="200px" align="center"></el-table-column>
              <el-table-column label="产品名称" prop="product_name" width="200px" align="center"></el-table-column>
            </el-table>
          </div>
        </template>
        <div class="empty-tips" v-else>请选择左侧列表</div>
      </div>
      <el-dialog
        v-if="isShowSupperSearch"
        :visible.sync="isShowSupperSearch"
        title="合并展示"
        fullscreen
        height="100vh"
        center
        @close="closeSupperSearchDialog"
        class="supper-search-box"
      >
        <template slot="title">
          <div class="flex-between">
            <div>
              <h3>合并展示</h3>
            </div>
            <span class="mr100">
            调整字号
            <el-input-number
              size="small"
              v-model="supperSetFontSize"
              class="ml10"
              :step="2"
              :min="12"
              :step-strictly="true"
              :max="24"
            ></el-input-number>
          </span>
          </div>
        </template>
        <div class="flex-between">
          <el-form style="display: inline-block; font-size: 0px" class="search-bar-condition">
            <div class="left-header">
              <div class="flex-center mr16">
                <el-input
                  clearable
                  placeholder='搜索多个产品名称用","间隔'
                  v-model.trim="supperFormData.product_name"
                  prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                  @input="selectProduct"
                ></el-input>
              </div>
              <div class="classify-box">
                <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in supperClassifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
              </div>
            </div>
            <div class="right-header">
              <div class="right-num-box">
                <span v-if="supperSelectNum != 0" class="right-num">{{supperSelectNum}}</span>
                组合规则
              </div>
              <div class="formData-select-query-rule">
                <el-radio v-model="supperFormData.query_rule" label="and">同时满足</el-radio>
                <el-radio v-model="supperFormData.query_rule" label="or">满足其一</el-radio>
              </div>
              <div class="formData-select-input-box rel">
                <div class="formData-select-input rel" v-for="(item,index) in supperRuleList" :key="item.value">
                  <div class="normal-div check">
                    <i class="el-icon-check bold" v-if="item.isUseSearch"></i>
                  </div>
                  <div class="normal-div">
                    <div class="el-form-item el-form-item--medium">
                      <label class="el-form-item__label rel">
                        病种:<i class="el-icon-warning-outline tip-info" title='使用半角"%"支持模糊检索，例如："乙%肝" = "乙肝"或"乙型肝炎"；"肺%结节" = "肺结节"或"肺部结节"或"肺部小结节" ；"DNA%阳性" = "HBV-DNA检查阳性"等。' ></i>
                      </label>
                      <div class="el-form-item__content">
                        <el-input v-model="item.illness_categorys_search" placeholder="请输入单一病种" @keyup.enter.native="selectProduct()"></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="normal-div">
                    <div class="el-form-item el-form-item--medium">
                      <label class="el-form-item__label rel">
                        条件:<i class="el-icon-warning-outline tip-info" title='使用半角"%"支持模糊检索，例如："乙%肝" = "乙肝"或"乙型肝炎"；"肺%结节" = "肺结节"或"肺部结节"或"肺部小结节" ；"DNA%阳性" = "HBV-DNA检查阳性"等。' ></i>
                      </label>
                      <div class="el-form-item__content">
                        <el-input v-model="item.condition_search" placeholder="请输入单一条件" @keyup.enter.native="selectProduct()"></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="w400 normal-div">
                    <el-form-item label="结论:">
                      <el-select style="width: 400px" v-model="item.conclusion_search" multiple :popper-append-to-body="false" placeholder="请选择">
                        <el-option
                          v-for="item in conclusionList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="normal-div">
                    <i class="el-icon-plus bold" @click="supperAddItem"></i>
                    <i class="el-icon-minus bold" @click="supperSubItem(index)" v-if="supperRuleList.length != 1"></i>
                  </div> 
                </div>
                <el-button class="button-all-reset" @click="resetSupperList">重置</el-button>
              </div>
              <div class="button-box">
                <el-button class="normal-search" type="primary" @click="search"><i class="el-icon-search"></i>搜索</el-button>
              </div>
              <i class="el-icon-arrow-up up-arrow"></i>
              <i class="el-icon-arrow-down down-arrow"></i>
            </div>
          </el-form>
        </div>
        <div class="supper-table" style="height: calc(100% - 110px)">
          <div ref="supperImageDom" v-loading="supperLoading" style="height: 100%">
            <el-table
              border
              :data="supperDetailTableData"
              :span-method="margeInfo"
              height="100%"
              stripe
              class="not-select"
              :style="{fontSize: supperSetFontSize + 'px'}"
            >
              <el-table-column label="保险产品" prop="product_name" :fixed="!supperLoading" align="center" width="150px"></el-table-column>
              <el-table-column label="序号" prop="sequence_number" align="center" width="60px"></el-table-column>
              <template v-for="(item,index) in maxCategorysLength">
                <el-table-column
                  v-if="allConditionShow[index]"
                  width="200px"
                  :prop="`illness_categorys[${index}]`"
                  :label="`病种分类${index+1}`"
                  align="center"
                  :key="'illness_categorys' + index"
                ></el-table-column>
              </template>
              <template v-for="(item,index) in maxConditionLength">
                <el-table-column
                  v-if="allListShow[index]"
                  width="200px"
                  :prop="`conditions[${index}]`"
                  :label="`条件${index+1}`"
                  align="center"
                  :key="'conditions' + index"
                ></el-table-column>
              </template>
              <el-table-column label="结论" prop="conclusion" width="200px" align="center"></el-table-column>
              <el-table-column label="保险公司" prop="company" width="150px" align="center"></el-table-column>
              <el-table-column label="产品类别" prop="insurance_class" width="200px" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SideFilterList from "@/components/side-filter-list";
import {
  getUnderwritingProductList,
  getUnderwritingDetail,
} from "@/apis/modules/underwriting";
import {
  clearValue,
  hasValue,
} from "@/components/filters/filter-shell";
import { debounce } from "@/utils";
import html2canvas from 'html2canvas'
export default {
  name: "underwrite-search",
  components: {
    SideFilterList,
    // FilterShell,
  },
  data() {
    return {
      inputCondition: '',
      inputConclusion: '',
      inputSick: '',
      inputParentSick: '',
      inputParentCondition: '',
      inputParentConclusion: '',
      loading: false,
      detailLoading: false,
      selVal: "", // 选中的产品
      tableMaxHeight: 0,
      maxConditionLength: 30,
      maxCategorysLength: 30,
      tableData: [],
      detailTableData: [],
      supperDetailTableData: [],
      tempSupperDetailTableData: [],
      productData: [],
      searchModel: {
        product_name: "",
        illness: "",
        condition_search: "",
        is_reverse: "0",
        conclusion: "",
      },
      illnessCategoryLength: 0,
      setFontSize: 12,
      supperSetFontSize: 12,
      classifyList: [
        {
          name: '重疾险',
          value: 1,
          isSelect: false
        },
        {
          name: '医疗险',
          value: 2,
          isSelect: false
        },
        {
          name: '寿险',
          value: 3,
          isSelect: false
        },
        {
          name: '其他',
          value: 9999,
          isSelect: false
        }
      ],
      supperClassifyList: [
        {
          name: '重疾险',
          value: 1,
          isSelect: false
        },
        {
          name: '医疗险',
          value: 2,
          isSelect: false
        },
        {
          name: '寿险',
          value: 3,
          isSelect: false
        },
        {
          name: '其他',
          value: 9999,
          isSelect: false
        }
      ],
      maxHeight: null,
      formData: {
        product_name: '',
        query_rule: 'and',
        illness_categorys_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
        condition_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
        conclusion_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
      },
      supperFormData: {
        product_name: '',
        query_rule: 'and',
        illness_categorys_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
        condition_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
        conclusion_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
      },
      isShowList: {
        all: false,
        supperAll: false
      },
      searchText: false,
      supperSearchText: false,
      loadingDetail: false,
      allListShow: [],
      allConditionShow: [],
      isShowSupperSearch: false,
      supperLoading: false,
      nowIndex: 0,
      ruleList: [
      ],
      supperRuleList: [
      ],
      ruleListItem: {
        illness_categorys_search: "",
        condition_search: "",
        conclusion_search: ['标体承保', '除外承保', '加费承保', '人工核保'],
        isUseSearch: false
      },
      conclusionList: [
        {
          value: '标体承保',
          label: '标体承保'
        },
        {
          value: '除外承保',
          label: '除外承保'
        },
        {
          value: '加费承保',
          label: '加费承保'
        },
        {
          value: '人工核保',
          label: '人工核保'
        },
        {
          value: '延期承保',
          label: '延期承保'
        },
        {
          value: '拒保',
          label: '拒保'
        },
      ]
    };
  },
  computed: {
    canSearch() {
      const { inputCondition, inputConclusion, inputSick, supperFormData } = this
      return inputCondition || inputConclusion || inputSick || supperFormData.product_name
    },
    selectNum() {
      let num = 0
      let selectNumList = this.checkRuleNull(this.ruleList)
      selectNumList.map(item => {
        if (item.isUseSearch) {
          num++
        }
      })
      return num
    },
    supperSelectNum() {
      let num = 0
      let selectNumList = this.checkRuleNull(this.supperRuleList)
      selectNumList.map(item => {
        if (item.isUseSearch) {
          num++
        }
      })
      return num
    },
  },
  methods: {
    clearValue,
    hasValue,
    handleEnter(e) {
      e.preventDefault()
      // if (e.keyCode === 13) {
      //   this.canSearch && this.search()
      // }
    },
    closeSupperSearchDialog() {
      // this.inputSick = ''
      // this.inputCondition = ''
      // this.inputConclusion = ''
      // this.supperFormData = {
      //   product_name: '',
      //   query_rule: 'and',
      //   illness_categorys_search: {
      //     value: ['', '', '', '', '', '', '', '', '', ''],
      //     query_rule: 'and'
      //   },
      //   condition_search: {
      //     value: ['', '', '', '', '', '', '', '', '', ''],
      //     query_rule: 'and'
      //   },
      //   conclusion_search: {
      //     value: ['', '', '', '', '', '', '', '', '', ''],
      //     query_rule: 'and'
      //   },
      //   isReverse: '0'
      // }
      this.supperDetailTableData = []
      this.supperLoading = false
    },
    // 外层组合规则
    handleParentInputChange(doSearch = true) {
      const { inputParentSick, inputParentCondition, inputParentConclusion, formData } = this
      const { illness_categorys_search, condition_search, conclusion_search } = formData
      const defValues = ['', '', '', '', '', '', '', '', '', '']
      illness_categorys_search.value = inputParentSick.split(/,|，/).filter(i => i).concat(defValues).slice(0, 10)
      condition_search.value = inputParentCondition.split(/,|，/).filter(i => i).concat(defValues).slice(0, 10)
      conclusion_search.value = inputParentConclusion.split(/,|，/).filter(i => i).concat(defValues).slice(0, 10)
      doSearch && this.search()
    },
    // 合并展示
    handleInputChange(doSearch = true) {
      const { inputSick, inputCondition, inputConclusion, supperFormData } = this
      const { illness_categorys_search, condition_search, conclusion_search } = supperFormData
      const defValues = ['', '', '', '', '', '', '', '', '', '']
      illness_categorys_search.value = inputSick.split(/,|，/).filter(i => i).concat(defValues).slice(0, 10)
      condition_search.value = inputCondition.split(/,|，/).filter(i => i).concat(defValues).slice(0, 10)
      conclusion_search.value = inputConclusion.split(/,|，/).filter(i => i).concat(defValues).slice(0, 10)
      doSearch && this.search()
    },
    clearFilters() {
      this.searchModel.illness = "";
      this.searchModel.condition_search = "";
      this.debounceAjaxProductData();
    },
    handleSelProduct(obj) {
      const { product_name } = obj;
      this.selVal = product_name;
      this.ajaxDetail(product_name);
    },
    ajaxDetail(product_name) {
      this.detailLoading = true;
      getUnderwritingDetail({
        ...this.searchModel,
        product_name,
      })
        .then((res) => {
          let illnessCategoryLength = 0;
          let maxConditionLength = 0;
          res.forEach((i) => {
            const conditionLen = i.conditions.filter((i) => i !== "").length;
            maxConditionLength = Math.max(maxConditionLength, conditionLen);
            const illLen = i.illness_categorys.filter((i) => i !== "").length;
            illnessCategoryLength = Math.max(illnessCategoryLength, illLen);
          });
          this.tableData = res;
          this.illnessCategoryLength = illnessCategoryLength;
          this.maxConditionLength = maxConditionLength;
        })
        .finally(() => {
          this.detailLoading = false;
        });
    },
    ajaxProductData() {
      this.loading = true;
      this.selVal = "";
      this.tableData = [];
      getUnderwritingProductList({ ...this.searchModel })
        .then((res) => {
          this.productData = res;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    debounceAjaxProductData: debounce(function () {
      this.ajaxProductData();
    }, 300),
    setMaxHeight: debounce(function () {
      const wrap = this.$refs.detailWrap;
      if (wrap) {
        this.maxHeight = wrap.offsetHeight - 64;
      }
    }, 300),
    checkRuleNull(ruleList) {
      let tempruleList = JSON.parse(JSON.stringify(ruleList))
      var newruleList = tempruleList.filter(item => {
        if (tempruleList.length > 1) {
           if (item.illness_categorys_search != '' || item.condition_search != '') {
            return item
          }
        } else {
          return item
        }
      })
      return newruleList
    },
    // new
    conditionText() {
      let isSelect = false
      this.ruleList.map(item => {
        if (!(item.illness_categorys_search == '' && item.condition_search == '' && '' + item.conclusion_search == '' + this.ruleListItem.conclusion_search)) {
          isSelect = true
        }
      })
      return isSelect
    },
    supperConditionText() {
      let isSelect = false
      this.supperRuleList.map(item => {
        if (item.illness_categorys_search == '' && item.condition_search == '' && '' + item.conclusion_search == '' + this.ruleListItem.conclusion_search) {
          isSelect = false
        } else {
          isSelect = true
        }
      })
      return isSelect
    },
    createImg(ref, isShow) {
      if (this.isCreateImgLock) {
        return false
      }
      this.isCreateImgLock = true
      this.$nextTick(() => {
        let self = this
        console.log(this.$refs)
        let dom
        if (ref === 'imageDom') {
          dom = this.$refs.imageDom
          this.loadingDetail = true
        } else {
          dom = this.$refs.supperImageDom
          this.supperLoading = true
        }
        let lastStyleTxt = dom.style.cssText
        let eltableHeight = dom.getElementsByClassName('el-table')[0].style.height
        let eltablewrapperHeight = dom.getElementsByClassName('el-table__body-wrapper')[0].style.height
        dom.style.width = dom.getElementsByClassName('el-table__header')[0].clientWidth + 'px'
        dom.getElementsByClassName('el-table')[0].style.height = (dom.getElementsByClassName('el-table__body')[0].clientHeight + dom.getElementsByClassName('el-table__header-wrapper')[0].clientHeight) + 'px'
        dom.style.height = (dom.getElementsByClassName('el-table__body')[0].clientHeight + dom.getElementsByClassName('el-table__header-wrapper')[0].clientHeight) + 'px'
        dom.getElementsByClassName('el-table__body-wrapper')[0].style.height = (dom.getElementsByClassName('el-table__body')[0].clientHeight) + 'px'
        html2canvas(dom).then(canvas => { // eslint-disable-line
          // 转成图片，生成图片地址
          self.imgUrl = canvas.toDataURL('image/jpeg', 0.5)
          // 创建隐藏的可下载链接
          let eleLink = document.createElement('a')
          eleLink.href = self.imgUrl // 转换后的图片地址
          eleLink.download = (self.curProduct && self.curProduct.product_name) || 'img'
          // 触发点击
          // 还原容器style
          dom.style.cssText = lastStyleTxt
          dom.getElementsByClassName('el-table')[0].style.height = eltableHeight
          dom.getElementsByClassName('el-table__body-wrapper')[0].style.height = eltablewrapperHeight
          if (!isShow) {
            document.body.appendChild(eleLink)
            eleLink.click()
            // 然后移除
            document.body.removeChild(eleLink)
          } else {
            var blob = this.dataURLtoBlob(self.imgUrl)
            var file = this.blobToFile(blob, (self.curProduct && self.curProduct.product_name) || 'img')
            let url = this.getObjectURL(file)
            window.open(url)
          }
          self.isCreateImgLock = false
          self.loadingDetail = false
          self.supperLoading = false
        })
      })
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },
    getObjectURL(file) {
      var url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else
      if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    selectItem(item) {
      this.selVal = ''
      item.isSelect = !item.isSelect
      this.search()
    },
    selectProduct() {
      this.search()
    },
    addItem() {
      this.ruleList.push(JSON.parse(JSON.stringify({...this.ruleListItem, random: Math.random()})))
    },
    subItem(index) {
      this.ruleList.splice(index, 1)
    },
    supperAddItem() {
      this.supperRuleList.push(JSON.parse(JSON.stringify({...this.ruleListItem, random: Math.random()})))
    },
    supperSubItem(index) {
      this.supperRuleList.splice(index, 1)
    },
    requestList() {
      this.loading = true
      this.isMixSearch = true
      // this.searchConditionData = { ...this.formData }
      var illness_categorys_search = this.formData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      let insuranceList = this.classifyList.filter(item => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map(item => {
          return item.name
        })
      }
      var newList = this.ruleList.map(item => {
          return '' + item.illness_categorys_search + '|.|' + item.condition_search  + '|.|' +  item.conclusion_search
      })
      newList = newList.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[])
      var newRuleList = newList.map(item => {
          return {
              illness_categorys_search: item.split('|.|')[0],
              condition_search: item.split('|.|')[1],
              conclusion_search: item.split('|.|')[2] == '' ? [] : item.split('|.|')[2].split(','),
              isUseSearch: false
          }
      })

      this.ruleList.length = 0
      newRuleList.map((item, index) => {
        if (newRuleList.length > 1) {
          if (item.illness_categorys_search || item.condition_search) { 
            this.ruleList.push(item)
          }
        } else {
          this.ruleList.push(item)
        }
        if (index == (newRuleList.length - 1) && this.ruleList.length == 0) {
          this.ruleList.push(newRuleList[0])
        }
      })
      let params = {
        product_name: this.formData.product_name,
        query_rule: this.formData.query_rule,
        rule_list: this.ruleList,
        illness_categorys_search: illness_categorys_search ? illness_categorys_search.join(',') : '',
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      this.searchConditionData = { ...params }
      this.detailTableData = []
      getUnderwritingProductList(params)
      .then((res) => {
        this.ruleList.map((item, index) => {
          if (this.ruleList.length > 1) {
            if (item.illness_categorys_search != '' || item.condition_search != '') {
              this.ruleList[index].isUseSearch = true
            } else {
              this.ruleList[index].isUseSearch = false
            }
          } else {
            this.ruleList[index].isUseSearch = true
          }
          // illness_categorys_search: "",
          // condition_search: "",
          // conclusion_search: ['标体承保', '除外承保', '加费承保', '人工核保'],
        })
        this.searchText = this.conditionText()
        this.tableData = res
      })
      .finally(() => {
        this.loading = false
      })
    },
    supperRequestList() {
      this.supperDetailTableData = []
      this.isSupperMixSearch = true
      this.supperLoading = true
      this.nowIndex++
      // this.searchConditionData = { ...this.formData }
      var illness_categorys_search = this.supperFormData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      let insuranceList = this.supperClassifyList.filter(item => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map(item => {
          return item.name
        })
      }
      var newList = this.supperRuleList.map(item => {
          return '' + item.illness_categorys_search + '|.|' + item.condition_search  + '|.|' +  item.conclusion_search
      })

      newList = newList.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[])

      var newRuleList = newList.map(item => {
          return {
              illness_categorys_search: item.split('|.|')[0],
              condition_search: item.split('|.|')[1],
              conclusion_search: item.split('|.|')[2] == '' ? [] : item.split('|.|')[2].split(','),
              isUseSearch: false
          }
      })
      this.supperRuleList.length = 0
      newRuleList.map((item, index) => {
        if (newRuleList.length > 1) {
          if (item.illness_categorys_search || item.condition_search) { 
            this.supperRuleList.push(item)
          }
        } else {
          this.supperRuleList.push(item)
        }
        if (index == (newRuleList.length - 1) && this.supperRuleList.length == 0) {
          this.supperRuleList.push(newRuleList[0])
        }
      })
      let params = {
        product_name: this.supperFormData.product_name,
        query_rule: this.supperFormData.query_rule,
        rule_list: this.supperRuleList,
        illness_categorys_search: illness_categorys_search ? illness_categorys_search.join(',') : '',
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      this.searchConditionData = { ...params }
      getUnderwritingProductList(params)
      .then((res) => {
        this.supperRuleList.map((item, index) => {
          if (this.supperRuleList.length > 1) {
            if (item.illness_categorys_search != '' || item.condition_search != '') {
              this.supperRuleList[index].isUseSearch = true
            } else {
              this.supperRuleList[index].isUseSearch = false
            }
          } else {
            this.supperRuleList[index].isUseSearch = true
          }
          // illness_categorys_search: "",
          // condition_search: "",
          // conclusion_search: ['标体承保', '除外承保', '加费承保', '人工核保'],
        })
        this.tempSupperDetailTableData = res
        this.tempSupperDetailTableData.map(item => {
          item.isSearch = false
        })
        this.supperSearchText = this.supperConditionText()
        if (res.length > 0) {
          this.loopDetail(this.nowIndex)
        } else {
          this.supperLoading = false
        }
      })
    },
    loopDetail(nowIndex) {
      // this.supperDetailTableData = []
      if (!this.isShowSupperSearch) {
        this.supperRuleList = [
          {
            illness_categorys_search: "",
            condition_search: "",
            conclusion_search: ['标体承保', '除外承保', '加费承保', '人工核保']
          }
        ]
        this.supperDetailTableData = []
        this.supperLoading = false
        return
      }
      if (nowIndex !== this.nowIndex) {
        this.supperDetailTableData = []
        return
      }
      var illness_categorys_search = this.supperFormData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      let detailItemIndex = this.tempSupperDetailTableData.findIndex(item => {
        return item.isSearch === false
      })

      let insuranceList = this.supperClassifyList.filter(item => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map(item => {
          return item.name
        })
      }
      let params = {
        product_name: this.tempSupperDetailTableData[detailItemIndex].product_name,
        query_rule: this.supperFormData.query_rule,
        rule_list: this.supperRuleList,
        illness_categorys_search: illness_categorys_search ? illness_categorys_search.join(',') : '',
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      this.searchConditionData = { ...params }
      getUnderwritingDetail(params)
      .then((res) => {
        if (!this.isShowSupperSearch) {
          this.supperFormData = {
            product_name: '',
            query_rule: this.supperFormData.query_rule,
            illness_categorys_search: {
              value: ['', '', '', '', '', '', '', '', '', ''],
              query_rule: 'and'
            },
            isReverse: 0
          }
          this.supperDetailTableData = []
          return
        }
        if (nowIndex !== this.nowIndex) {
          this.supperDetailTableData = []
          return
        }
        if (res.length > 1) {
          res[0].isShow = false
          res.map((item, index) => {
            if (index === 0) {
              item.isShow = true
              item.margeNum = res.length
            } else {
              item.isShow = true
              item.margeNum = 0
            }
          })
          res[0].isShow = true
          res[0].margeNum = res.length
        }
        this.supperDetailTableData = this.supperDetailTableData.concat(res)
        this.tempSupperDetailTableData[detailItemIndex].isSearch = true
        if (this.tempSupperDetailTableData.length === (detailItemIndex + 1)) {
          for (let i = 0; i < 15; i++) {
            this.allListShow[i] = false
          }
          for (let i = 0; i < 10; i++) {
            this.allConditionShow[i] = false
          }
          this.supperDetailTableData.map(items => {
            this.allListShow.map((isShow, showIndex) => {
              if (!isShow) {
                if (items.conditions[showIndex] !== undefined && items.conditions[showIndex] !== '' && items.conditions[showIndex] !== 0) {
                  this.allListShow[showIndex] = true
                }
              }
            })
          })
          this.supperDetailTableData.map(items => {
            this.allConditionShow.map((isShow, showIndex) => {
              if (!isShow) {
                if (items.illness_categorys[showIndex] !== undefined && items.illness_categorys[showIndex] !== '' && items.illness_categorys[showIndex] !== 0) {
                  this.allConditionShow[showIndex] = true
                }
              }
            })
          })
          setTimeout(() => {
            let dom = this.$refs.supperImageDom // el-table
            dom.getElementsByClassName('el-table__body-wrapper')[0].style.height = (dom.getElementsByClassName('el-table')[0].clientHeight - 44) + 'px'
            this.supperLoading = false
          }, 1000)
        } else {
          this.loopDetail(nowIndex)
        }
        // this.detailTableData = Object.freeze(res)
      })
    },
    supperSearch () {
      this.supperDetailTableData = []
      this.isShowSupperSearch = true
    },
    requestDetail() {
      this.detailTableData = []
      this.loadingDetail = true
      var illness_categorys_search = this.formData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      let insuranceList = this.classifyList.filter(item => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map(item => {
          return item.name
        })
      }
      illness_categorys_search.map(item => {
        this.ruleList.push({
          illness_categorys_search: item,
          condition_search: '',
          conclusion_search: []
        })
      })
      var newList = this.ruleList.map(item => {
          return '' + item.illness_categorys_search + '|.|' + item.condition_search  + '|.|' +  item.conclusion_search
      })
      newList = newList.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[])
      this.ruleList = newList.map(item => {
          return {
              illness_categorys_search: item.split('|.|')[0],
              condition_search: item.split('|.|')[1],
              conclusion_search: item.split('|.|')[2] == '' ? [] : item.split('|.|')[2].split(',')
          }
      })
      let params = {
        product_name: this.curProduct.product_name,
        query_rule: this.formData.query_rule,
        rule_list: this.ruleList,
        illness_categorys_search: illness_categorys_search ? illness_categorys_search.join(',') : '',
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      getUnderwritingDetail({
        ...params,
        file_log_id: this.curProduct.file_log_id
      })
        .then((res) => {
          for (let i = 0; i < 15; i++) {
            this.allListShow[i] = false
          }
          for (let i = 0; i < 10; i++) {
            this.allConditionShow[i] = false
          }
          res.map(items => {
            this.allListShow.map((isShow, showIndex) => {
              if (!isShow) {
                if (items.conditions[showIndex] !== undefined && items.conditions[showIndex] !== '' && items.conditions[showIndex] !== 0) {
                  this.allListShow[showIndex] = true
                }
              }
            })
          })
          res.map(items => {
            this.allConditionShow.map((isShow, showIndex) => {
              if (!isShow) {
                if (items.illness_categorys[showIndex] !== undefined && items.illness_categorys[showIndex] !== '' && items.illness_categorys[showIndex] !== 0) {
                  this.allConditionShow[showIndex] = true
                }
              }
            })
          })
          this.detailTableData = Object.freeze(res)
        })
        .finally(() => {
          this.loadingDetail = false
        })
    },
    resetNormal () {
      this.formData = {
        product_name: '',
        query_rule: 'and',
        illness_categorys_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
        isReverse: 0
      }
      this.requestList()
    },
    resetSupper() {
      this.supperFormData = {
        product_name: '',
        query_rule: 'and',
        illness_categorys_search: {
          value: ['', '', '', '', '', '', '', '', '', ''],
          query_rule: 'and'
        },
        isReverse: 0
      }
      this.supperSearchText = this.supperConditionText()
      this.supperDetailTableData = []
    },
    resetList() {
      this.ruleList.length = 0
      this.ruleList.push(JSON.parse(JSON.stringify(this.ruleListItem)))
      this.searchText = this.conditionText()
    },
    resetSupperList() {
      this.supperRuleList.length = 0
      this.supperRuleList.push(JSON.parse(JSON.stringify(this.ruleListItem)))
      this.supperSearchText = this.supperConditionText()
    },
    search() {
      if (!this.isShowSupperSearch) {
        this.curProduct = {}
        this.isShowList = {
          all: false,
          supperAll: false
        }
        this.page = 1
        this.supperRuleList = JSON.parse(JSON.stringify(this.ruleList))
        this.supperRuleList = this.supperRuleList.map(item => {
          item.isUseSearch = false
          return item
        })
        this.supperFormData.query_rule = this.formData.query_rule
        this.supperFormData.product_name = this.formData.product_name
        this.supperClassifyList = JSON.parse(JSON.stringify(this.classifyList))
        // const fd = this.formData
        // this.selVal = ''
        // this.inputParentSick = fd.illness_categorys_search.value.filter(i => i).join(',')
        // this.inputParentCondition = fd.condition_search.value.filter(i => i).join(',')
        // this.inputParentConclusion = fd.conclusion_search.value.filter(i => i).join(',')
        this.requestList()
      } else {
        this.isShowList = {
          all: false,
          supperAll: false
        }
        this.ruleList = JSON.parse(JSON.stringify(this.supperRuleList))
        this.ruleList = this.ruleList.map(item => {
          item.isUseSearch = false
          return item
        })
        this.formData.query_rule = this.supperFormData.query_rule
        this.formData.product_name = this.supperFormData.product_name
        this.classifyList = JSON.parse(JSON.stringify(this.supperClassifyList))
        // const fd = this.supperFormData
        // this.selVal = ''
        // this.inputSick = fd.illness_categorys_search.value.filter(i => i).join(',')
        // this.inputCondition = fd.condition_search.value.filter(i => i).join(',')
        // this.inputConclusion = fd.conclusion_search.value.filter(i => i).join(',')
        this.supperRequestList()
      }
    },
    margeInfo({ row, columnIndex }) {
      if (columnIndex === 0) {
        if (row.isShow === true) {
          if (row.margeNum === 0) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else {
            return {
              rowspan: row.margeNum,
              colspan: 1
            }
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
    showDetail(data) {
      this.curProduct = data
      this.showProductDetail = true
      this.requestDetail()
    },
    closeDetailModal() {
      this.isShowSupperSearch = false
      this.setFontSize = 12
    },
    closeSearchConditionTips() {
      this.searchConditionData = {}
      this.formData = {}
      this.isReverse = 0
      this.formData.isReverse = 0
      this.requestList()
    }
  },
  created() {
    // this.ajaxProductData();
    this.ruleListItem.conclusion_search = ['标体承保', '除外承保', '加费承保', '人工核保', '延期承保', '拒保']
    this.ruleList.push(JSON.parse(JSON.stringify(this.ruleListItem)))
    this.supperRuleList.push(JSON.parse(JSON.stringify(this.ruleListItem)))
    this.requestList()
    window.addEventListener("resize", this.setMaxHeight);
    document.addEventListener('keyup', this.handleEnter)
  },
  beforeDestroy() {
    this.searchText = this.conditionText()
    window.removeEventListener("resize", this.setMaxHeight);
    document.removeEventListener('keyup', this.handleEnter)
  },
  mounted() {
    this.setMaxHeight();
  },
};
</script>

<style scoped lang="scss">
  .search-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    position: absolute;
    top: 56px;
    width: 100%;
    .search-bar-condition{
      flex: 1;
    }
    .search-input-container{
      display: inline-block;
    }
  }
.classify-box{
  padding: 8px 16px 0 0;
  font-size: 14px;
  display: inline-block;
  .classify-item{
    cursor: pointer;
    display: inline-block;
    padding: 8px;
    background: #F5F5F5;
    border: 1px solid #E6E6E6;
    color: #333;
    border-radius: 4px;
    line-height: 1;
    margin-right: 8px;
    &.active{
      background: rgba(31, 120, 255, 0.1);
      color: #1F78FF;
    }
  }
}
.underwrite-search-container {
  height: 77vh;
  overflow: hidden;
  display: flex;
  margin-top: 96px;
  align-items: stretch;
  justify-content: stretch;
  .search-input-container {
    padding: 16px;
  }
  .filter-container {
    padding: 0 16px 16px;
  }
  .detail-wrap.underwrite-search {
    flex: 1;
    padding: 16px;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    .head {
      height: 48px;
      position: relative;
      font-size: 14px;
      color: #4d4d4d;
      align-items: flex-start;
      & > p {
        line-height: 32px;
        color: #1a1a1a;
        font-size: 18px;
        margin: 0 0 2px 0;
        font-weight: bold;
      }
      .el-input-number {
        width: 140px;
      }
    }
  }
  .side-filter-container {
    border-right: 1px solid #e6e6e6;
  }
  ::v-deep .filter-bar {
    // width: 72px;
    .filter-item {
      // width: 100%;
      display: inline-block;
      margin-right: 0;
      text-align: center;
      display: flex;
      height: 32px;
      align-items: center;
      justify-content: center;
    }
    .filter-badge {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background-color: #1f78ff;
      color: #fff;
    }
  }
  ::v-deep .is-reverse-filter {
    width: initial;
    .filter-item {
      margin-right: 0;
      width: initial;
      border: none;
      background: #fff;
    }
  }
  ::v-deep .radio-group-wrap {
    .el-radio-button {
      .el-radio-button__inner {
        padding: 6px 8px;
        background: #f5f5f5;
        border-color: #e6e6e6;
      }
      &.is-active .el-radio-button__inner {
        background: #fff;
        color: #1f78ff;
        box-shadow: none;
      }
    }
  }
}

.formData-select{
  margin: 4px 4px 0 4px;
  max-height: 70vh;
  position: relative;
  overflow-y: scroll;
  font-size: 14px;
  .formData-select-title{
    margin-top: 24px;
    text-align: center;
  }
  .formData-select-title, .formData-select-input{
    .normal-div{
      display: inline-block;
      width: 160px;
      padding: 0 5px;
      .el-icon-plus{
        margin-left: 20px;
        cursor: pointer;
      }
      .el-icon-minus {
        margin-left: 20px;
        cursor: pointer;
      }
    }
    .w480{
      width: 480px;
    }
    .w400{
      width: 400px;
    }
    .tc{
      text-align: center;
    }
  }
  .formData-select-input{
    margin-top: 10px;
  }
  .formData-select-query-rule{
    text-align: center;
  }
  .formData-select-list{
    padding-left: 16px;
    min-width: 275px;
    height: 100%;
    border: 1px solid #e6e6e6;
    .formData-select-list-header{
      margin-right: 16px;
      margin-bottom: 16px;
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #e6e6e6;
    }
    .el-form-item__label{
      width: 45px;
      flex: 1;
      text-align: left;
    }
  }
  .el-form-item--medium{
    display: flex;
  }
  .formData-select-list-info{
    line-height: 60vh;
    text-align: center;
    width: 88px;
  }
  .el-form-item{
    margin-right: 0px!important;
    margin-bottom: 0px!important;
  }
}

.pos-rel{
  position: relative;
  display: inline-block;
  padding-top: 3px;
  .close-btn {
    color: #ff5151;
    background: #fff;
    display: none;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    position: absolute;
    right: -4px;
    top: -4px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
  &:hover{
    .close-btn{
      display: flex;
    }
  }
  .button-small-select{
    &.hasValue{
      background: rgba(255, 144, 0, 0.1)
    }
  }
  .filter-item{
    margin-right: 0px;
    height: 28px;
    .content{
      padding: 6px 12px;
      &.active{
        color: #1f78ff;
        background-color: rgba(31, 120, 255, 0.1);
        border: 1px solid #1f78ff;
      }
    }
  }
}

.button-all-select-box{
  text-align: center;
  .button-all-select {
    &.el-button--medium{
      color: #fff;
      background-color: #1F78FF;
      border-color: #1F78FF;
      width: 300px;
      margin: 20px 10px 0 auto;
      display: inline-block;
    }
  }
}
.search-form.no-border-bottom{
  border-bottom: 0px;
}

.detail-wrap{
  ::v-deep .el-table__body-wrapper{
    /*height: 76vh;*/
  }
}

.underwrite-search-left{
  
}

.supper-search-button-box{
  display: inline-block;
  .supper-search{
    // &.el-button.el-button--medium{
    //   background: #1c6ce6;
    //   border-color: #1c6ce6;
    // }
  }
}

.supper-search-box{
  ::v-deep .el-dialog {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: initial;
    .el-dialog__header {
      padding: 10px 20px !important;
      line-height: 40px !important;
      height: auto !important;
      .el-dialog__headerbtn{
        border: 2px solid #1F78FF;
        box-sizing: border-box;
        font-weight: bold;
        background: #1F78FF;
        border-radius: 8px;
        top: 9px !important;
        width: 67px;
        .el-dialog__close{
          color: #fff !important;
          font-size: 38px;
        }
        &:hover{
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      height: calc(100vh - 62px);
      max-height: initial;
    }
    .el-dialog__footer {
      display: none;
    }
  }
  .supper-table{
    margin-top: 20px;
  }
  .supper-form{
    width: 100%;
  }
  .supper-search-input{
    margin-right: 20px;
    width: 200px;
  }
  .float-r{
    float: right;
  }
  .el-dialog{
    .el-dialog__header{
      h3{
        margin: 0;
      }
    }
  }
}
.underwriting-search{
  .button-small-select{
    padding: 3px 10px;
    background: #E6E6E6;
    line-height: 1.5;
  }
}

.formData-classify-dialog.formData-classify{
  .classify-box{
    .classify-item{
      line-height: 36px;
      margin: 3px 0;
      box-sizing: border-box;
      cursor: pointer;
      &.active{
        // background: rgba(255, 144, 0, 0.1);
        color: #1F78FF;
      }
    }
  }
}

.ml16{
  margin-left: 16px;
}
::v-deep .main-table {
    .el-loading-mask {
      // height: 80vh;
    }
  }
::v-deep .el-table {
  td .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
.pos-rel {
  .mr16{
    margin-right: 16px;
  }
}
.mr16{
  margin-right: 16px;
}

.normal-div{
  /deep/ .el-input--medium .el-input__icon{
    // height: 14px;
    // position: relative;
    // top: calc(50% - 7px);
    // line-height: 1;
  }
}
.mr100{
  margin-right: 100px;
}

.left-header{
  width: 280px;
  display: inline-block;
  float: left;
}
.right-header{
  position: absolute;
  z-index: 3000;
  display: inline-block;
  background: #fff;
  font-size: 0px;
  padding-top: 6px;
  padding-right: 20px;
  padding-left: 8px;
  float: left;
  height: 86px;
  padding-bottom: 20px;
  overflow: hidden;
  min-width: 1400px;
  &:hover{
    height: auto;
    overflow: inherit;
    box-shadow: 5px 4px 6px 1px #999;
    .down-arrow{
      display: none;
    }
    .up-arrow{
      display: inline-block;
    }
    .formData-select-input-box{
      max-height: 600px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
        // background-color: rgba(0,0,0,.2);
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
        background-color: rgba(0,0,0,0.2);
      }
      .formData-select-input{
        display: inline-block;
        .el-form-item--medium .el-form-item__content{
          display: inline-block;
        }
      }
    }
  }
  .down-arrow{
    font-size: 16px;
    position: absolute;
    left: 49.2%;
    bottom: 0px;
  }
  .up-arrow{
    display: none;
    font-size: 16px;
    position: absolute;
    left: 49.2%;
    bottom: 4px;
  }
  .el-button--default{
    background: #E0EDFF;
    color: #1f78ff;
    border-color: #E0EDFF;
  }
  .el-button--primary{
    width: 117px;
  }
  .right-num-box{
    position: relative;
    float: left;
    width: 64px;
    height: 64px;
    background: #E0EDFF;
    border-radius: 8px;
    font-size: 20px;
    color: #1f78ff;
    border: 1px solid #1f78ff;
    box-sizing: border-box;
    padding: 11px;
    box-sizing: border-box;
    line-height: 1;
    display: inline-block;
    .right-num{
      position: absolute;
      right: -6px;
      top: -6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #1f78ff;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      color: #fff;
      border: 0px solid #333;
    }
  }
  .formData-select-query-rule{
    float: left;
    height: 86px;
    margin-left: 20px;
    display: inline-block;
    .el-radio{
      margin-right: 0px !important;
      display: block;
      padding-top: 12px;
    }
  }
  .formData-select-input-box{
    width: 1040px;
    float: left;
    display: inline-block;
    background: #fff;
    text-align: center;
    .formData-select-input{
      float: left;
      height: 76px;
      display: none;
      &:first-child {
        display: inline-block;
      }
      .normal-div{
        font-size: 14px;
        margin-top: 14px;
        margin-left: 10px;
        line-height: 36px;
        display: inline-block;
        min-width: 50px;
        vertical-align: top;
        &.check{
          min-width: 20px;
          font-size: 16px;
          color: #1f78ff;
        }
        /deep/ .el-form-item__content{
          display: inline-block;
        }
      }
    }
    .button-all-reset{
      margin-top: 20px;
      width: 220px;
    }
  }
  .button-box{
    display: inline-block;
    margin-left: 20px;
    .supper-search, .normal-search {
      display: block;
      margin-left: 0px;
      margin-top: 0px;
    }
    .normal-search{
      margin-top: 5px;
    }
    .el-button--medium{
      padding: 8px 20px;
    }
  }
}

.normal-div{
  .el-form-item{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
  }
}

.rel{
  position: relative;
}

.zi2000{
  z-index: 2000;
}

.tip-info{
  position: absolute;
  right: 0px;
  top: 4px;
}
.el-form--inline .el-form-item {
  display: inline-block;
  vertical-align: top;
}
</style>
