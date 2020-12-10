<template>
  <div class="underwrite-search-container">
    <side-filter-list
      v-loading="loading"
      label-key="product_name"
      value-key="product_name"
      :showFilter="false"
      v-model="selVal"
      @change="showDetail"
      :disabled="detailLoading"
      style="width: 280px"
      :listData="tableData"
    >
      <div slot="extraFilter" class="underwrite-search-left">
        <div class="search-input-container">
          <el-input
            clearable
            placeholder="搜索产品名称"
            v-model="formData.product_name"
            prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
            @input="search"
          ></el-input>
        </div>
        <div class="filter-container flex-between">
          <el-radio-group
            size="mini"
            v-model="formData.isReverse"
            @change="search"
            class="radio-group-wrap"
          >
            <el-radio-button
              style="height: 28px"
              v-for="(item, index) in isReverseData"
              :key="'normal' + index"
              :label="item.value"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
          <el-form class="search-form common-form no-border-bottom">
            <div class="pos-rel">
              <el-popover
                placement="bottom-start"
                class="formData-illness-box"
                v-model="isShowList.all"
                trigger="click"
              >
                <div class="filter-bar">
                  <div class="formData-select">
                    <div class="formData-select-list">
                      <div class="formData-select-list-header">
                        <el-radio
                          v-model="formData.illness_categorys_search.query_rule"
                          label="and"
                          >同时满足</el-radio
                        >
                        <el-radio
                          v-model="formData.illness_categorys_search.query_rule"
                          label="or"
                          >满足其一</el-radio
                        >
                      </div>
                      <el-form-item
                        class="formData-select-list-list"
                        :label="'病种' + (index + 1)"
                        v-for="(item, index) in formData.illness_categorys_search
                          .value"
                        :key="index"
                      >
                        <el-input
                          v-model="formData.illness_categorys_search.value[index]"
                          placeholder="请输入病种"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="formData-select-list-info">同时满足</div>
                    <div class="formData-select-list">
                      <div class="formData-select-list-header">
                        <el-radio
                          v-model="formData.condition_search.query_rule"
                          label="and"
                          >同时满足</el-radio
                        >
                        <el-radio
                          v-model="formData.condition_search.query_rule"
                          label="or"
                          >满足其一</el-radio
                        >
                      </div>
                      <el-form-item
                        class="formData-select-list-list"
                        :label="'条件' + (index + 1)"
                        v-for="(item, index) in formData.condition_search.value"
                        :key="index"
                      >
                        <el-input
                          v-model="formData.condition_search.value[index]"
                          placeholder="请输入条件"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="formData-select-list-info">同时满足</div>
                    <div class="formData-select-list">
                      <div class="formData-select-list-header">
                        <el-radio
                          v-model="formData.conclusion_search.query_rule"
                          label="and"
                          >同时满足</el-radio
                        >
                        <el-radio
                          v-model="formData.conclusion_search.query_rule"
                          label="or"
                          >满足其一</el-radio
                        >
                      </div>
                      <el-form-item
                        class="formData-select-list-list"
                        :label="'结论' + (index + 1)"
                        v-for="(item, index) in formData.conclusion_search.value"
                        :key="index"
                      >
                        <el-input
                          v-model="formData.conclusion_search.value[index]"
                          placeholder="请输入结论"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <el-button
                    type="warning"
                    class="button-all-select"
                    @click="search"
                    >确定</el-button
                  >
                </div>
                <span class="dropdown-link" slot="reference">
                  <template>
                    <!-- {{(searchText) ? searchText : '筛选'}} 
                    <el-button
                      slot="reference"
                      :class="['button-small-select', { hasValue: searchText }]"
                      >筛选 <i class="el-icon-arrow-down"></i
                    ></el-button>-->
                    <div class="filter-item el-popover__reference">
                      <div :class="['content', {'active': searchText}]">
                        <span class="filter-label">筛选</span>
                        <i class="iconfont iconxiao16_xiajiantou ml4"></i>
                      </div>
                    </div>
                  </template>
                </span>
              </el-popover>
              <span class="close-btn" @click="resetNormal" v-if="searchText">
                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"></i>
              </span>
            </div>
          </el-form>
        </div>
        <div class="classify-box">
          <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in classifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
        </div>
      </div>
    </side-filter-list>
    <div class="detail-wrap underwrite-search" v-loading="detailLoading" ref="detailWrap">
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
            <el-button v-if="$checkAuth('/underwrite-health-notice/generate_pictures')" class="ml16" type="primary"  @click="createImg('imageDom')" size="small"><i class="iconfont iconxiao16_shengcheng"></i> 生成图片</el-button>
            <div class="supper-search-button-box">
              <el-button class="supper-search ml16" type="primary" @click="supperSearch" size="small"><i class="el-icon-search"></i>高级搜索</el-button>
            </div>
          </div>
        </div>
        <div ref="imageDom">
          <el-table
            border
            :data="detailTableData"
            height="81vh"
            class="not-select"
            v-loading="loadingDetail"
            :style="{fontSize: setFontSize + 'px'}"
          >
            <el-table-column label="序号" prop="sequence_number" align="center" width="100px"></el-table-column>
            <template v-for="(item,index) in maxCategorysLength">
              <el-table-column
                v-if="allConditionShow[index]"
                width="250px"
                :prop="`illness_categorys[${index}]`"
                :label="`病种分类${index+1}`"
                align="center"
                :key="'illness_categorys' + index"
              ></el-table-column>
            </template>
            <template v-for="(item,index) in maxConditionLength">
              <el-table-column
                v-if="allListShow[index]"
                width="250px"
                :prop="`conditions[${index}]`"
                :label="`条件${index+1}`"
                align="center"
                :key="'conditions' + index"
              ></el-table-column>
            </template>
            <el-table-column label="结论" prop="conclusion" width="250px" align="center"></el-table-column>
            <el-table-column label="保险公司" prop="company" width="150px" align="center"></el-table-column>
            <el-table-column label="产品类别" prop="insurance_class" width="250px" align="center"></el-table-column>
            <el-table-column label="产品名称" prop="product_name" width="250px" align="center"></el-table-column>
          </el-table>
        </div>
      </template>
      <div class="empty-tips" v-else>请选择左侧列表</div>
    </div>
    <el-dialog
      v-if="isShowSupperSearch"
      :visible.sync="isShowSupperSearch"
      title="高级搜索"
      width="75%"
      top="5vh"
      center
      class="supper-search-box"
    >
      <template slot="title">
        <div class="flex-between">
          <div>
            <h3>高级搜索</h3>
          </div>
          <span class="mr50">
            调整字号
            <el-input-number
              size="small"
              v-model="supperSetFontSize"
              class="ml10"
              :step="2"
              :min="14"
              :step-strictly="true"
              :max="24"
            ></el-input-number>
            <!-- <el-button type="primary" size="small" class="ml10" @click="createImg('supperImageDom')">生成图片</el-button> -->
          </span>
        </div>
      </template>
      <div class="flex-between">
        <el-form inline :modal="formData" @submit.native.prevent label-position="right" class="supper-form">
          <el-input
            placeholder="搜索产品名称"
            prefix-icon="el-icon-search"
            v-model="supperFormData.product_name"
            @keyup.enter.native="supperRequestList()"
            class="supper-search-input">
          </el-input>
          
          <el-radio-group
            size="mini"
            v-model="supperFormData.isReverse"
            @change="supperRequestList"
            class="radio-group-wrap"
          >
            <el-radio-button
              style="height: 28px"
              v-for="(item, index) in supperIsReverseData"
              :key="'supper' + index"
              :label="item.value"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
          <div class="pos-rel">
            <el-popover
              placement="bottom"
              class="formData-classify-box"
              trigger="click">
              <div class="formData-classify-dialog formData-classify">
                <div class="classify-box">
                  <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in supperClassifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
                </div>
              </div>
              <span class="dropdown-link" slot="reference">
                <template>
                  <div class="filter-item el-popover__reference ml16">
                    <div :class="['content']">
                      <span class="filter-label">产品类别</span>
                      <i class="iconfont iconxiao16_xiajiantou ml4"></i>
                    </div>
                  </div>
                </template>
              </span>
            </el-popover>
          </div>
          <div class="pos-rel">
            <el-popover
              placement="bottom"
              class="formData-illness-box"
              v-model="isShowList.supperAll"
              trigger="click">
              <div>
                <div class="formData-select">
                  <div class="formData-select-list">
                    <div class="formData-select-list-header">
                      <el-radio v-model="supperFormData.illness_categorys_search.query_rule" label="and">同时满足</el-radio>
                      <el-radio v-model="supperFormData.illness_categorys_search.query_rule" label="or">满足其一</el-radio>
                    </div>
                    <el-form-item class="formData-select-list-list" :label="'病种'+ (index+1)" v-for="(item, index) in supperFormData.illness_categorys_search.value" :key="index">
                      <el-input v-model="supperFormData.illness_categorys_search.value[index]" placeholder="请输入病种"></el-input>
                    </el-form-item>
                  </div>
                  <div class="formData-select-list-info">同时满足</div>
                  <div class="formData-select-list">
                    <div class="formData-select-list-header">
                      <el-radio v-model="supperFormData.condition_search.query_rule" label="and">同时满足</el-radio>
                      <el-radio v-model="supperFormData.condition_search.query_rule" label="or">满足其一</el-radio>
                    </div>
                    <el-form-item class="formData-select-list-list" :label="'条件'+ (index+1)" v-for="(item, index) in supperFormData.condition_search.value" :key="index">
                      <el-input v-model="supperFormData.condition_search.value[index]" placeholder="请输入条件"></el-input>
                    </el-form-item>
                  </div>
                  <div class="formData-select-list-info">同时满足</div>
                  <div class="formData-select-list">
                    <div class="formData-select-list-header">
                      <el-radio v-model="supperFormData.conclusion_search.query_rule" label="and">同时满足</el-radio>
                      <el-radio v-model="supperFormData.conclusion_search.query_rule" label="or">满足其一</el-radio>
                    </div>
                    <el-form-item class="formData-select-list-list" :label="'结论'+ (index+1)" v-for="(item, index) in supperFormData.conclusion_search.value" :key="index">
                      <el-input v-model="supperFormData.conclusion_search.value[index]" placeholder="请输入结论"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <el-button type="warning" class="button-all-select" @click="search">确定</el-button>
              </div>
              <span class="dropdown-link" slot="reference">
                <template>
                  <div class="filter-item el-popover__reference ml16">
                    <div :class="['content', {'active': supperSearchText}]">
                      <span class="filter-label">筛选</span>
                      <i class="iconfont iconxiao16_xiajiantou ml4"></i>
                    </div>
                  </div>
                </template>
              </span>
            </el-popover>
            <span class="close-btn" @click="resetSupper" v-if="supperSearchText">
              <i class="filter-clear iconfont iconxiao16_yuanxingchahao"></i>
            </span>
          </div>
        </el-form>
      </div>
      <div class="supper-table">
        <div ref="supperImageDom" v-loading="supperLoading">
          <el-table
            border
            :data="supperDetailTableData"
            :span-method="margeInfo"
            height="73vh"
            stripe
            class="not-select"
            :style="{fontSize: supperSetFontSize + 'px'}"
          >
            <el-table-column label="保险产品" prop="product_name" fixed align="center" width="100px"></el-table-column>
            <el-table-column label="序号" prop="sequence_number" align="center" width="100px"></el-table-column>
            <template v-for="(item,index) in maxCategorysLength">
              <el-table-column
                v-if="allConditionShow[index]"
                width="250px"
                :prop="`illness_categorys[${index}]`"
                :label="`病种分类${index+1}`"
                align="center"
                :key="'illness_categorys' + index"
              ></el-table-column>
            </template>
            <template v-for="(item,index) in maxConditionLength">
              <el-table-column
                v-if="allListShow[index]"
                width="250px"
                :prop="`conditions[${index}]`"
                :label="`条件${index+1}`"
                align="center"
                :key="'conditions' + index"
              ></el-table-column>
            </template>
            <el-table-column label="结论" prop="conclusion" width="250px" align="center"></el-table-column>
            <el-table-column label="保险公司" prop="company" width="150px" align="center"></el-table-column>
            <el-table-column label="产品类别" prop="insurance_class" width="250px" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer"></div>
    </el-dialog>
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
      setFontSize: 14,
      supperSetFontSize: 14,
      isReverseData: [
        { label: "正向条件", value: "0" },
        { label: "反向条件", value: "1" },
      ],
      supperIsReverseData: [
        { label: "正向条件", value: "0" },
        { label: "反向条件", value: "1" },
      ],
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
        isReverse: '0'
      },
      supperFormData: {
        product_name: '',
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
        isReverse: '0'
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
      nowIndex: 0
    };
  },
  methods: {
    clearValue,
    hasValue,
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
    // new 
     conditionText() {
      let str = ''
      if (this.formData.product_name) {
        str += `产品名称：${this.formData.product_name},`
      }
      var illness_categorys_search = this.formData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      var condition_search = this.formData.condition_search.value.filter(function (item) {
        return item && item.trim()
      })
      var conclusion_search = this.formData.conclusion_search.value.filter(function (item) {
        return item && item.trim()
      })
      if (illness_categorys_search.join(',').length > 0) {
        str += '病种' + illness_categorys_search.join(',')
      }
      if (condition_search.join(',').length > 0) {
        str += '条件' + condition_search.join(',')
      }
      if (conclusion_search.join(',').length > 0) {
        str += '结论' + conclusion_search.join(',')
      }
      if (str.lastIndexOf(',') === (str.length - 1)) {
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    supperConditionText() {
      let str = ''
      if (this.supperFormData.product_name) {
        str += `产品名称：${this.supperFormData.product_name},`
      }
      var illness_categorys_search = this.supperFormData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      var condition_search = this.supperFormData.condition_search.value.filter(function (item) {
        return item && item.trim()
      })
      var conclusion_search = this.supperFormData.conclusion_search.value.filter(function (item) {
        return item && item.trim()
      })
      if (illness_categorys_search.join(',').length > 0) {
        str += '病种' + illness_categorys_search.join(',')
      }
      if (condition_search.join(',').length > 0) {
        str += '条件' + condition_search.join(',')
      }
      if (conclusion_search.join(',').length > 0) {
        str += '结论' + conclusion_search.join(',')
      }
      if (str.lastIndexOf(',') === (str.length - 1)) {
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    createImg(ref) {
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
        let lastWidth = dom.clientWidth
        let lastHeight = dom.clientHeight
        let eltableHeight = dom.getElementsByClassName('el-table')[0].style.height
        let eltablewrapperHeight = dom.getElementsByClassName('el-table__body-wrapper')[0].style.height
        console.log(eltablewrapperHeight)
        dom.style.width = dom.getElementsByClassName('el-table__header')[0].clientWidth + 'px'
        dom.getElementsByClassName('el-table')[0].style.height = (dom.getElementsByClassName('el-table__body')[0].clientHeight + dom.getElementsByClassName('el-table__header-wrapper')[0].clientHeight) + 'px'
        dom.style.height = (dom.getElementsByClassName('el-table__body')[0].clientHeight + dom.getElementsByClassName('el-table__header-wrapper')[0].clientHeight) + 'px'
        dom.getElementsByClassName('el-table__body-wrapper')[0].style.height = (dom.getElementsByClassName('el-table__body')[0].clientHeight) + 'px'
        html2canvas(dom).then(canvas => {
          // 转成图片，生成图片地址
          self.imgUrl = canvas.toDataURL('image/jpeg', 0.5)
          // 创建隐藏的可下载链接
          let eleLink = document.createElement('a')
          eleLink.href = self.imgUrl // 转换后的图片地址
          eleLink.download = (self.curProduct && self.curProduct.product_name) || 'img'
          // 触发点击
          dom.style.width = lastWidth + 'px'
          dom.style.height = lastHeight + 'px'
          dom.getElementsByClassName('el-table')[0].style.height = eltableHeight
          dom.getElementsByClassName('el-table__body-wrapper')[0].style.height = eltablewrapperHeight
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
          self.isCreateImgLock = false
          self.loadingDetail = false
          self.supperLoading = false
        })
      })
    },
    selectItem(item) {
      item.isSelect = !item.isSelect
      if (!this.isShowSupperSearch) {
        this.requestList()
      } else {
        this.supperRequestList()
      }
    },
    requestList() {
      this.loading = true
      // this.searchConditionData = { ...this.formData }
      var illness_categorys_search = this.formData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      var condition_search = this.formData.condition_search.value.filter(function (item) {
        return item && item.trim()
      })
      var conclusion_search = this.formData.conclusion_search.value.filter(function (item) {
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
      let params = {
        product_name: this.formData.product_name,
        illness_categorys_search: {
          value: illness_categorys_search.join(','),
          query_rule: this.formData.illness_categorys_search.query_rule
        },
        condition_search: {
          value: condition_search.join(','),
          query_rule: this.formData.condition_search.query_rule
        },
        conclusion_search: {
          value: conclusion_search.join(','),
          query_rule: this.formData.conclusion_search.query_rule
        },
        is_reverse: this.formData.isReverse,
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      this.searchConditionData = { ...params }
      this.detailTableData = []
      getUnderwritingProductList(params)
      .then((res) => {
        this.searchText = this.conditionText()
        this.tableData = res
      })
      .finally(() => {
        this.loading = false
      })
    },
    supperRequestList() {
      this.supperDetailTableData = []
      this.supperLoading = true
      this.nowIndex++
      // this.searchConditionData = { ...this.formData }
      var illness_categorys_search = this.supperFormData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      var condition_search = this.supperFormData.condition_search.value.filter(function (item) {
        return item && item.trim()
      })
      var conclusion_search = this.supperFormData.conclusion_search.value.filter(function (item) {
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
      let params = {
        product_name: this.supperFormData.product_name,
        illness_categorys_search: {
          value: illness_categorys_search.join(','),
          query_rule: this.supperFormData.illness_categorys_search.query_rule
        },
        condition_search: {
          value: condition_search.join(','),
          query_rule: this.supperFormData.condition_search.query_rule
        },
        conclusion_search: {
          value: conclusion_search.join(','),
          query_rule: this.supperFormData.conclusion_search.query_rule
        },
        is_reverse: this.supperFormData.isReverse,
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      this.searchConditionData = { ...params }
      getUnderwritingProductList(params)
      .then((res) => {
        this.tempSupperDetailTableData = res
        this.tempSupperDetailTableData.map(item => {
          item.isSearch = false
        })
        this.supperSearchText = this.supperConditionText()
        if (res.length > 0) {
          this.loopDetail(this.nowIndex)
        }
      })
      .finally(() => {
        this.supperLoading = false
      })
    },
    loopDetail(nowIndex) {
      // this.supperDetailTableData = []
      if (!this.isShowSupperSearch) {
        this.supperFormData = {
          product_name: '',
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
          isReverse: 0
        }
        this.supperDetailTableData = []
        return
      }
      if (nowIndex !== this.nowIndex) {
        this.supperDetailTableData = []
        return
      }
      var illness_categorys_search = this.supperFormData.illness_categorys_search.value.filter(function (item) {
        return item && item.trim()
      })
      var condition_search = this.supperFormData.condition_search.value.filter(function (item) {
        return item && item.trim()
      })
      var conclusion_search = this.supperFormData.conclusion_search.value.filter(function (item) {
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
        illness_categorys_search: {
          value: illness_categorys_search.join(','),
          query_rule: this.supperFormData.illness_categorys_search.query_rule
        },
        condition_search: {
          value: condition_search.join(','),
          query_rule: this.supperFormData.condition_search.query_rule
        },
        conclusion_search: {
          value: conclusion_search.join(','),
          query_rule: this.supperFormData.conclusion_search.query_rule
        },
        insurance_class: insurance_class ? insurance_class.join(',') : '',
        is_reverse: this.supperFormData.isReverse
      }
      this.searchConditionData = { ...params }
      getUnderwritingDetail(params)
      .then((res) => {
        if (!this.isShowSupperSearch) {
          this.supperFormData = {
            product_name: '',
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
          }, 2000)
        } else {
          this.loopDetail(nowIndex)
        }
        // this.detailTableData = Object.freeze(res)
      })
      .finally(() => {
        this.supperLoading = false
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
      var condition_search = this.formData.condition_search.value.filter(function (item) {
        return item && item.trim()
      })
      var conclusion_search = this.formData.conclusion_search.value.filter(function (item) {
        return item && item.trim()
      })
      let params = {
        product_name: this.curProduct.product_name,
        illness_categorys_search: {
          value: illness_categorys_search.join(','),
          query_rule: this.formData.illness_categorys_search.query_rule
        },
        condition_search: {
          value: condition_search.join(','),
          query_rule: this.formData.condition_search.query_rule
        },
        conclusion_search: {
          value: conclusion_search.join(','),
          query_rule: this.formData.conclusion_search.query_rule
        },
        is_reverse: this.formData.isReverse
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
        isReverse: 0
      }
      this.requestList()
    },
    resetSupper() {
      this.supperFormData = {
        product_name: '',
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
        isReverse: 0
      }
      this.supperSearchText = ''
      this.supperDetailTableData = []
    },
    search() {
      if (!this.isShowSupperSearch) {
        this.curProduct = {}
        this.isShowList = {
          all: false,
          supperAll: false
        }
        this.page = 1
        this.requestList()
      } else {
        this.isShowList = {
          all: false,
          supperAll: false
        }
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
      this.setFontSize = 14
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
    this.requestList()
    window.addEventListener("resize", this.setMaxHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setMaxHeight);
  },
  mounted() {
    this.setMaxHeight();
  },
};
</script>

<style scoped lang="scss">
.underwrite-search-container {
  height: 100%;
  overflow: hidden;
  display: flex;
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
      margin-right: 0;
      text-align: center;
      display: flex;
      height: 28px;
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
  display: flex;
  overflow-y: scroll;
  font-size: 14px;
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
    margin-right: 16px!important;
    margin-bottom: 20px!important;
  }
}

.pos-rel{
  position: relative;
  display: inline-block;
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
      padding: 4px 12px;
      &.active{
        color: #1f78ff;
        background-color: rgba(31, 120, 255, 0.1);
        border: 1px solid #1f78ff;
      }
    }
  }
}

.button-all-select {
  &.el-button--warning{
    color: #fff;
    background-color: #1f78ff;
    border-color: #1f78ff;
    width: 275px;
    margin: 20px auto 0 auto;
    display: block;
  }
}
.search-form.no-border-bottom{
  border-bottom: 0px;
}

.detail-wrap{
  ::v-deep .el-table__body-wrapper{
    height: 76vh;
  }
}

.underwrite-search-left{
  .classify-box{
    padding: 0px 16px 8px 16px;
    font-size: 14px;
    .classify-item{
      cursor: pointer;
      display: inline-block;
      padding: 6px 8px;
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
  .el-dialog {
    height: 90vh;
    overflow-y: scroll;
    overflow-x: hidden;
    .el-dialog__body{
      max-height: calc(89vh - 115px);
    }
  }
  .supper-table{
    margin-top: 20px;
    .el-table{
      height: 67vh!important;
    }
  }
  .supper-form{
    width: 100%;
  }
  .supper-search-input{
    margin-right: 20px;
    width: 20%;
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
</style>
