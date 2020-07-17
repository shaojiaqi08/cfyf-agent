<template>
  <div class="api-container">
    <side-filter-list
      v-loading="companyLoading"
      :list-data="companyList"
      label-key="name"
      value-key="id"
      placeholder="搜索B端公司"
      v-model="selVal"
      @change="handleSelCompany"
      @updateFilter="updateFilter"
    ></side-filter-list>
    <div class="detail-wrap">
      <div class="head">
        {{type}}
        <el-input placeholder="搜索保险产品" v-model="searchProduct" size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-table
        ref="table"
        :data="filterSearchProduct"
        border
        height="calc(100vh - 193px)"
        v-loading="tableLoading"
        v-table-infinite-scroll="scroll2Bottom"
      >
        <el-table-column label="产品名称" align="center" prop="name"></el-table-column>
        <el-table-column label="产品ID" align="center" prop="id"></el-table-column>
        <el-table-column label="上下架状态" align="center">
          <template v-slot="{row}">
            <span :style="{color: row.status ? '#40d659' : '#ff4c4c'}">{{row.status_str}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{row}">
            <el-button type="text" @click="triggerShelves(row)">{{row.status ? '下' : '上'}}架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import SideFilterList from "@/components/side-filter-list";
import {
  getCompanyList,
  getCompanyProductList,
  setStatus
} from "@/apis/modules/good-manage";
import { debounce } from "@/utils";
export default {
  name: "common-pate",
  props: {
    type: {
      type: String,
      required: true
    }
  },
  components: { SideFilterList },
  directives: {
    "table-infinite-scroll": {
      inserted(el, binding) {
        const scrollWrap = el.querySelector(".el-table__body-wrapper");
        const scrollHandle = debounce(() => {
          const { scrollHeight, scrollTop, offsetHeight } = scrollWrap;
          if (offsetHeight + scrollTop >= scrollHeight) {
            // 到底
            binding.value();
          }
        }, 300);
        scrollWrap.addEventListener("scroll", scrollHandle);
      }
    }
  },
  data() {
    return {
      data: [],
      tableLoading: false,
      companyLoading: false,
      companyList: [],
      companyKeyword: "",
      positionList: [],
      selVal: "", // 公司选中值,
      companyId: null,
      searchProduct: '',
      searchModel: {
        page: 1
      },
      total: 0
    };
  },
  computed: {
    filterCompanyList() {
      const { companyList, selVal } = this;
      return companyList.filter(item => item["label"].includes(selVal));
    },
    filterSearchProduct() {
      return this.data.filter(item => new RegExp(this.searchProduct).test(item.name))
    }
  },
  watch: {
    searchModel() {
      this.debounceAjaxTableData();
    }
  },
  methods: {
    updateFilter() {
      this.selVal = ''
      this.$store.dispatch('goodManage/updateProductId', null)
      this.data = []
    },
    triggerShelves(row) {
      const h = this.$createElement;
      const { status } = row
      const tips = `是否确认${status ? "下" : "上"}架？`;
      const iconColor = status ? "#FF4C4C" : "#FFBB33";
      const btnCls = status ? "el-button--danger" : "el-button--primary";
      const btnTxt = status ? "下架" : "上架";
      this.$confirm(
        h("div", [
          h("i", {
            class: {
              iconfont: true,
              iconzhong20_gantanhao: true
            },
            style: {
              color: iconColor,
              marginRight: "10px"
            }
          }),
          h("span", tips)
        ]),
        "提示",
        {
          confirmButtonText: btnTxt,
          confirmButtonClass: btnCls
        }
      )
        .then(() => {
          const target = row;
          const data = {
            product_id: target.id,
            product_type: target.product_type,
            company_id: this.companyId,
            sale_status: target.status ? 0 : 1
          };
          setStatus(data).then(() => {
            this.$message.success("状态更改成功");
            this.handleSelCompany({ id: this.companyId });
          });
        })
        .catch(() => {});
    },
    handleSelCompany(v) {
      const { id } = v
      const data = {
        company_id: id,
        product_type: this.type
      };
      this.companyId = v.id
      this.tableLoading = true;
      this.$store.dispatch('goodManage/updateProductId', v.id)
      getCompanyProductList(data).then(res => {
        this.data = res;
        this.tableLoading = false;
      });
    },
    scroll2Bottom() {
      this.ajaxTableData();
    },
    debounceAjaxTableData() {
      const func = debounce.call(this, this.ajaxTableData(), 300, true);
      this.debounceAjaxTableData = func;
    },
    ajaxTableData() {
      this.companyLoading = true
      getCompanyList()
        .then(res => {
          this.companyLoading = false
          this.companyList = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    init() {
      const selectedProductId = this.$store.state.goodManage.productId
      if (selectedProductId) {
        this.selVal = selectedProductId
        this.handleSelCompany({ id: selectedProductId })
      }
    }
  },
  created() {
    this.ajaxTableData();
    this.init()
  }
};
</script>

<style scoped lang="scss">
.api-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  .extra-filter-bar {
    padding-top: 16px;
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
    padding: 0px 16px 16px 16px;
    box-sizing: border-box;
    .head {
      height: 64px;
      font-size: 14px;
      color: #999999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > .el-input {
        width: 240px;
        height: 32px;
      }
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
  }
}
</style>