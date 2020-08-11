<template>
  <div class="commission-rate-container">
    <!-- <side-filter-list
      v-loading="companyLoading"
      :list-data="filterCompanyList"
      label-key="label"
      value-key="value"
      placeholder="搜索B端公司"
      v-model="selVal"
      @change="handleSelCompany"
    ></side-filter-list> -->
    <el-scrollbar class="pos-filter-list" v-loading="positionLoading">
      <div v-for="(item, index) in positionList" :key="index">
        <div class="group-item">
          <el-divider v-if="index !== 0" />
          {{item.label}}
        </div>
        <div
          v-for="(item, index) in item.children"
          :key="index"
          @click="handleSelPosition(item)"
          :class="{'list-item': true, active: selPosVal === item.value}"
        >{{item.label}}</div>
      </div>
      <div class="tc mt30" v-if="!positionList.length">暂无数据</div>
    </el-scrollbar>
    <side-filter-list
      v-loading="productLoading"
      :list-data="productList"
      label-key="label"
      value-key="value"
      placeholder="搜索产品名称"
      v-model="selProductVal"
      @change="handleSelProduct"
    >
      <template slot="extraFilter">
        <div class="extra-filter-bar flex flex-between">
          <filter-shell
            v-model="productFilter.status"
            autoClose
            autoFocus
            :width="200"
            @input="filterChange"
          >
            <el-select
              v-model="productFilter.status"
              clearable
              filterable
              placeholder="请选择"
              @change="filterChange"
            >
              <el-option
                v-for="(item, index) in effectStatus"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-slot:label>
              <span>{{ hasValue(productFilter.status) ? effectStatus.find(i => i.value === productFilter.status).label : '状态' }}</span>
            </template>
          </filter-shell>
          <!-- <filter-shell
            v-model="productFilter.insType"
            autoClose
            autoFocus
            :width="200"
            @input="filterChange"
          >
            <el-select
              v-model="productFilter.insType"
              clearable
              filterable
              placeholder="请选择"
              @change="filterChange"
            >
              <el-option
                v-for="(item, index) in insuranceTypeArray"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-slot:label>
              <span>{{ hasValue(productFilter.insType) ? insuranceTypeArray.find(i => i.value === productFilter.insType).label : '险种' }}</span>
            </template>
          </filter-shell> -->
        </div>
      </template>
      <template v-slot:list="{row}">
        <div class="product-list-item">
          <span>{{row.label}}</span>
        </div>
      </template>
    </side-filter-list>
    <div class="detail-wrap">
      <div class="head">
        <p>佣金费率记录</p>
        <el-button type="primary"
                   v-if="selProductVal"
                   @click="openRateDialog">
          <i class="iconfont iconxiao16_shezhi mr4"></i>
          设置服务费率
        </el-button>
      </div>
      <el-scrollbar class="flex-item" v-loading="settingLoadLoading">
        <div v-if="!settingLoadLoading">
          <card-table v-for="item in settingList"
                      :key="item.id"
                      :info="item"
                      :editable="true"></card-table>
        </div>
      </el-scrollbar>
    </div>
    <rate-setting-dialog type="add"
                         :companyId="selVal"
                         :productId="selProductVal"
                         :singleCompany="true"
                         :visible.sync="dialogVisible"></rate-setting-dialog>
  </div>
</template>
<script>
import SideFilterList from "@/components/side-filter-list";
import cardTable from "../component/card-table";
import RateSettingDialog from "../component/rate-setting-dialog";
import FilterShell, { hasValue } from "@/components/filters/filter-shell";
import {
  getSalesPositionList,
  getProductsOfPosition,
  getCommissionSettingList
} from "@/apis/modules/good-manage";
import { getManagementCompanyList } from "@/apis/modules/achievement";
import { effectStatus } from "@/enums/good-manage";
import { insuranceTypeArray } from "@/enums/common";
export default {
  name: "commission-rate",
  components: {
    SideFilterList,
    cardTable,
    FilterShell,
    RateSettingDialog
  },
  data() {
    return {
      dialogVisible: false,
      companyLoading: false,
      productLoading: false,
      positionLoading: false,
      settingLoadLoading: false,
      companyList: [],
      positionList: [],
      productList: [],
      originlProductList: [],
      settingList: [],
      selVal: "", // 公司选中值
      selProductVal: "", // 产品选中值
      selPosVal: "", // 职位选中值
      extra: "",
      effectStatus,
      insuranceTypeArray,
      productFilter: {
        status: "",
        insType: ""
      },
      tabIdx: "1"
    };
  },
  computed: {
    filterCompanyList() {
      const { extra, companyList } = this;
      return companyList.filter(item => {
        return item["label"].indexOf(extra) !== -1;
      });
    }
  },
  methods: {
    hasValue,
    openRateDialog() {
      this.dialogVisible = true;
    },
    filterChange() {
      const { status, insType } = this.productFilter;
      if (!status && !insType) {
        this.$nextTick(() => {
          this.productList = JSON.parse(
            JSON.stringify(this.originlProductList)
          );
        });
      }
      if (status && insType) {
        this.$nextTick(() => {
          this.productList = this.originlProductList
            .filter(i => {
              return i.effect_status === status;
            })
            .filter(i => {
              return i.sale_status === insType;
            });
        });
      }
      if (status) {
        this.$nextTick(() => {
          this.productList = this.originlProductList.filter(i => {
            return i.effect_status === status;
          });
        });
      }
      if (insType) {
        this.$nextTick(() => {
          this.productList = this.originlProductList.filter(i => {
            return i.sale_status === insType;
          });
        });
      }
    },
    handleSelPosition(v) {
      const data = { position_id: v.value, company_id: this.selVal };
      this.selPosVal = v.value;
      this.productLoading = true;
      this.settingList = [];
      getProductsOfPosition(data)
        .then(res => {
          this.productList = res.map(i => {
          return Object.assign(i, {
              label: i.product_name || "-",
              value: i.id_type,
              type: i.product_type,
              color: effectStatus.find(y => y.value === i.effect_status).color,
              tip_text: effectStatus.find(y => y.value === i.effect_status).label
          });
          });
          this.originlProductList = JSON.parse(JSON.stringify(res));
          this.settingList = [];
          this.productFilter.status = "";
          this.productFilter.insType = "";
        })
        .finally(() => {
          this.productLoading = false;
        });
    },
    getManagementCompanyList() {
      this.companyLoading = true;
      getManagementCompanyList()
        .then(res => {
          this.companyList = res.map(i => ({ label: i.name, value: i.id }));
        })
        .finally(() => {
          this.companyLoading = false;
        });
    },
    handleSelCompany() {
      // const data = { company_id: v.value };
      this.positionLoading = true;
      this.productList = [];
      this.settingList = [];
      getSalesPositionList()
        .then(res => {
          this.positionList = res.map(i => {
            return {
              label: i.level_str,
              children: i.items.map(y => {
                return {
                  label: y.name,
                  value: y.id
                };
              })
            };
          });
        })
        .finally(() => {
          this.positionLoading = false;
        });
    },
    updateListHandler() {
        const data = {
            product_id: this.selProductVal.split('_')[0],
            product_type: this.selProductVal.split('_')[1],
            company_id: this.selVal
        }
      this.handleSelProduct(data)
    },
    handleSelProduct(v) {
      const data = {
        company_id: this.selVal,
        position_id: this.selPosVal,
        product_id: v.product_id,
        product_type: v.product_type
      };
      this.settingLoadLoading = true;
      getCommissionSettingList(data)
        .then(res => {
          this.settingList = res;
        })
        .finally(() => {
          this.settingLoadLoading = false;
        });
    }
  },
  created() {
    // this.getManagementCompanyList();
    this.handleSelCompany()
  },
  mounted() {
    this.$root.$on('updateList', this.updateListHandler)
  },
  destroyed() {
    this.$root.$off('updateList', this.updateListHandler)
  }
};
</script>

<style scoped lang="scss">
.commission-rate-container {
  flex: 0 0 240px;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  .extra-filter-bar {
    justify-content: space-around;
    margin-bottom: 16px;
    ::v-deep .filter-bar .filter-item {
      width: 96px;
      text-align: center;
      margin-right: 0;
    }
  }
  .pos-filter-list {
    flex: 0 0 240px;
    border-right: 1px solid #e6e6e6;
    .group-item,
    .list-item {
      height: 44px;
      line-height: 44px;
      background: #fff;
      padding: 0 16px;
      color: #999;
      box-sizing: border-box;
      font-size: 14px;
    }
    .group-item {
      .el-divider {
        margin: 0;
      }
    }
    .list-item {
      color: #4d4d4d;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      cursor: pointer;
      &.active,
      &:hover {
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
      }
      &.active {
        background: #f5f5f5;
      }
      &:hover {
        background: #e6e6e6;
      }
    }
  }
  .product-list-item {
    width: 100%;
    & > span:first-of-type {
      line-height: 20px;
      display: inline-block;
      flex: 1;
      padding-right: 8px;
    }
  }
  .detail-wrap {
    flex: auto;
    padding: 16px;
    width: 100px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .head {
      height: 68px;
      position: relative;
      font-size: 14px;
      line-height: 20px;
      color: #999999;
      padding-bottom: 16px;
      & > p {
        line-height: 28px;
        color: #1a1a1a;
        font-size: 18px;
        margin: 0 0 2px 0;
        font-weight: bold;
      }
      .el-button {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    ::v-deep .el-scrollbar {
      height: 100%;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .card {
      background: rgba(245, 245, 245, 1);
      border-radius: 4px;
      border: 1px solid rgba(230, 230, 230, 1);
      padding: 16px;
      box-sizing: border-box;
      & > div:nth-of-type(1) {
        span {
          font-weight: bold;
        }
        i {
          font-weight: normal;
        }
      }
      & > div:nth-of-type(2) {
        flex-wrap: wrap;
        .pay-block {
          height: 86px;
          width: 33.333333%;
          padding-top: 18px;
          color: #4d4d4d;
          font-size: 14px;
          line-height: 20px;
          & > span {
            margin-top: 4px;
            line-height: 28px;
            font-size: 18px;
            font-weight: bold;
            color: #131415;
            & > span {
              color: #ff9000;
            }
          }
        }
      }
      .el-divider {
        margin: 0 0 16px 0;
        width: calc(100% + 32px);
        transform: translateX(-16px);
      }
    }
  }
  .side-filter-container {
    flex: 0 0 240px;
    border-right: 1px solid #e6e6e6;
    &.pos-side-filter-list .pos-group-block {
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 44px;
      line-height: 44px;
      text-indent: 16px;
      color: #999;
      border-top: 1px solid #e6e6e6;
    }
  }
}
</style>