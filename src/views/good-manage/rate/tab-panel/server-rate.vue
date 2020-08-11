<template>
  <div class="server-rate-container">
    <!-- <side-filter-list
      v-loading="companyLoading"
      :list-data="filterCompanyList"
      label-key="label"
      value-key="value"
      placeholder="搜索B端公司"
      v-model="selVal"
      @change="handleSelCompany"
    ></side-filter-list> -->
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
        <div class="product-list-item flex">
          <span>{{row.label}}</span>
          <el-tooltip :content="row.tip_text" placement="top">
            <span :style="{backgroundColor: row.color}"></span>
          </el-tooltip>
        </div>
      </template>
    </side-filter-list>
    <div class="detail-wrap">
      <div class="head">
        <p>服务费率记录</p>
        <!-- 某某某保险产品名称过长换行超过两行就换行展示产品 -->
        <!-- <el-button type="primary"
                   v-if="selProductVal"
                   @click="openRateDialog">
          <i class="iconfont iconxiao16_shezhi mr4"></i>
          设置服务费率
        </el-button> -->
      </div>
      <el-scrollbar class="body scrollbar" v-loading="settingLoadLoading">
        <div v-if="!settingLoadLoading">
          <card-table v-for="item in settingList"
                      :key="item.id"
                      :info="item"
                      :editable="false"></card-table>
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
// import { getManagementCompanyList } from "@/apis/modules/achievement";
import {
  getProductListOfCompany,
  getSettingList
} from "@/apis/modules/good-manage";
import { effectStatus } from "@/enums/good-manage";
import { insuranceTypeArray } from "@/enums/common";
export default {
  name: "server-rate",
  components: {
    SideFilterList,
    FilterShell,
    cardTable,
    RateSettingDialog
  },
  data() {
    return {
      dialogVisible: false,
      productLoading: false,
      settingLoadLoading: false,
      companyList: [],
      productList: [],
      originlProductList: [],
      selVal: "", // 公司选中值
      selProductVal: "", // 产品选中值
      extra: "",
      insuranceTypeArray,
      effectStatus,
      settingList: [],
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
    },
    filterProductList() {
      const { productFilter, companyList } = this;
      return companyList.filter(item => item["label"].includes(productFilter));
    }
  },
  methods: {
    hasValue,
    // getManagementCompanyList() {
    //   // getManagementCompanyList().then(res => {
    //   //   this.companyLoading = false;
    //   //   this.companyList = res.map(i => ({ label: i.name, value: i.id }));
    //   // });
    // },
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
    openRateDialog() {
      this.dialogVisible = true;
    },
    handleSelCompany() {
      this.productLoading = true;
      // const params = { company_id: v.value };
      getProductListOfCompany().then(res => {
        this.productList = res.map(i => {
          return Object.assign(i, {
            label: i.product_name || "-",
            value: i.id_type,
            color: effectStatus.find(y => y.value === i.effect_status).color,
            tip_text: effectStatus.find(y => y.value === i.effect_status).label
          });
        });
        this.originlProductList = JSON.parse(JSON.stringify(this.productList));
        this.settingList = [];
        this.productFilter.status = "";
        this.productFilter.insType = "";
      })
      .finally(() => {
        this.productLoading = false;
      });
    },
    handleSelProduct(v) {
      this.settingLoadLoading = true;
      const data = {
        product_id: v.product_id,
        product_type: v.product_type,
        company_id: v.company_id
      };
      getSettingList(data).then(res => {
        this.settingList = res;
        this.settingLoadLoading = false;
      });
    },
    updateListHandler() {
        const data = {
            product_id: this.selProductVal.split('_')[0],
            product_type: this.selProductVal.split('_')[1],
            company_id: this.selVal
        }
      this.handleSelProduct(data)
    }
  },
  created() {
    this.handleSelCompany();
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
.server-rate-container {
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
  .product-list-item {
    width: 100%;
    & > span:first-of-type {
      line-height: 20px;
      display: inline-block;
      flex: 1;
      padding-right: 8px;
    }
    & > span:last-of-type {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 100%;
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
      // padding-bottom: 16px;
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
    .body {
      height: 700px;
    }
    ::v-deep .el-tabs {
      flex: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .el-tabs__content {
        flex: 1;
        .el-tab-pane {
          height: 100%;
        }
        .el-scrollbar {
          height: 100%;
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
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
          width: 25%;
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
  }
}
</style>