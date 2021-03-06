<template>
  <div class="order-container page-container">
    <div class="header">
      <el-tabs class="tabs" v-model="tabIndex">
        <el-tab-pane
          name="customer"
          label="全部客户"
          :disabled="loading"
          v-if="$checkAuth('/customer/admin/customer_page_list')"
        ></el-tab-pane>
        <el-tab-pane
          name="family"
          label="客户家庭"
          v-if="$checkAuth('/customer/admin/family_page_list')"
          :disabled="loading"
        ></el-tab-pane>
      </el-tabs>
      <div class="flex-center">
        <el-button
          type="primary"
          icon="iconfont iconxiao16_xiazai mr4"
          class="mr16"
          size="small"
          v-if="
            $checkAuth(
              tabIndex === 'customer'
                ? '/customer/admin/export_customers'
                : '/customer/admin/export_family_list'
            )
          "
          @click="exportList"
          :loading="exporting"
          :disabled="exporting || list.length <= 0 || loading"
          >导出数据</el-button
        >
        <el-input
          v-model="searchModel.keyword"
          :placeholder="placeholder"
          size="small"
          class="fw400"
          clearable
          style="width:360px"
          :readonly="loading"
          @keyup.enter.native="search()"
        >
          <i
            slot="prefix"
            class="ml4 iconfont iconxiao16_sousuo el-input__icon"
          ></i>
          <el-button slot="append" @click="search()">搜索</el-button>
        </el-input>
      </div>
    </div>
    <div class="scroll-box p16" ref="content" v-loading="loading">
      <div>
        <!--全部出单人-->
        <filter-shell
          v-model="searchModel.sales_id"
          autoFocus
          class="mb16"
          placeholder="全部出单人"
          @input="search()"
        >
          <el-select
            class="block"
            v-model="searchModel.sales_id"
            clearable
            filterable
            multiple
            placeholder="请选择"
            @change="search()"
          >
            <el-option
              v-for="item in salesList"
              :key="item.id"
              :label="item.real_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{
              searchModel.sales_id.length
                ? salesList.find((i) => i.id === searchModel.sales_id[0])
                    .real_name
                : "全部出单人"
            }}
          </template>
        </filter-shell>
        <!--全部团队-->
        <filter-shell
          v-model="searchModel.sales_team_id"
          autoFocus
          class="mb16"
          placeholder="全部出单人"
          :width="330"
          @input="search()"
        >
          <el-select
            class="block"
            v-model="searchModel.sales_team_id"
            clearable
            filterable
            multiple
            placeholder="请选择"
            @change="search()"
          >
            <el-option
              v-for="item in salesTeamList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{
              searchModel.sales_team_id.length
                ? salesTeamList.find(
                    (i) => i.id === searchModel.sales_team_id[0]
                  ).name
                : "全部团队"
            }}
          </template>
        </filter-shell>
        <!--全部关联家庭-->
        <filter-shell
          v-model="searchModel.family_id"
          autoFocus
          class="mb16"
          v-if="tabIndex === 'customer'"
          @input="search()"
        >
          <el-select
            class="block"
            v-model="searchModel.family_id"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="search()"
          >
            <el-option
              v-for="item in relativeFamilyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{
              searchModel.family_id.length
                ? relativeFamilyList.find(
                    (i) => i.id === searchModel.family_id[0]
                  ).name
                : "全部关联家庭"
            }}
          </template>
        </filter-shell>
      </div>
      <el-table
        :data="list"
        height="calc(100vh - 240px)"
        border
        stripe
        :key="tabIndex"
        style="width: 100%"
      >
        <template v-if="tabIndex === 'customer'">
          <el-table-column
            prop="real_name"
            label="姓名"
            align="center"
            fixed="left"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="certificate_number"
            label="身份证号"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column prop="birthday" label="出生日期" align="center">
            <template v-slot="{ row }">{{
              row.birthday
                ? row.birthday
                    .toString()
                    .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
                : "-"
            }}</template>
          </el-table-column>
          <el-table-column
            prop="policy_quantity"
            label="保单数量"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="family_name"
            label="关联家庭"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="sales_name"
            label="出单人"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="sales_team_name"
            label="团队"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="120px"
            v-if="$checkAuth('/customer/admin/customer_detail')"
          >
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewDetail(row)"
                >查看详情</el-link
              >
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            prop="name"
            label="家庭名称"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="members_name"
            label="投保人"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="policy_quantity"
            label="保单数量"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="sales_name"
            label="创建人"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="sales_team_name"
            label="团队"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            :formatter="cellFormatter"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="120px"
            v-if="$checkAuth('/customer/admin/family_detail')"
          >
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewFamilyDetail(row)" class="mr8"
                >查看详情</el-link
              >
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 20211118 修改分页方式 去除无限滚动 -->
      <div class="table-pagination" v-if="list.length > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="page_size"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCustomerList,
  getCustomerFamilyList,
  exportCustomerListUrl,
  exportFamilyListUrl,
} from "@/apis/modules/customer";
import { getSalesData, getSalesTeamData } from "@/apis/modules/achievement";
import { debounce, downloadFrameA } from "@/utils";
import { formatDate } from "@/utils/formatTime";
import qs from "qs";
import FilterShell from "@/components/filters/filter-shell";
import commonMixin from "../mixin";
// 客户 - 全部客户
export default {
  name: "all-customer",
  components: {
    FilterShell,
  },
  mixins: [commonMixin],
  computed: {
    placeholder() {
      return this.tabIndex === "customer"
        ? "搜索姓名、身份证号或手机号"
        : "搜索家庭名称或投保人名称";
    },
  },
  data() {
    return {
      tabIndex: "",
      list: [],
      teamList: [],
      relativeFamilyList: [],
      page: 1,
      page_size: 20,
      total: 0,
      loading: false,
      exporting: false,
      searchModel: {
        keyword: "",
        sales_id: [],
        sales_team_id: [],
        family_id: [],
      },
      salesList: [],
      salesTeamList: [],
    };
  },
  methods: {
    // 分页
    handleCurrentChange(v) {
      this.page = v;
      this.search(this.page);
    },
    // 导出
    exportList() {
      const isCustomerTab = this.tabIndex === "customer";
      const params = { ...this.searchModel };
      if (!isCustomerTab) {
        delete params.family_id;
      }
      const url = `${
        isCustomerTab ? exportCustomerListUrl : exportFamilyListUrl
      }?${qs.stringify(params)}`;
      this.exporting = true;
      downloadFrameA(
        url,
        `${isCustomerTab ? "客户" : "客户家庭"}列表-${formatDate(
          new Date(),
          "yyyy-MM-dd"
        )}.xlsx`,
        "get",
        true
      )
        .finally(() => {
          this.exporting = false;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    // 打开客户详情标签
    viewDetail(row) {
      const url = this.$router.resolve({
        name: "customer-detail",
        params: {
          id: row.relation_id,
        },
      }).href;
      window.open(url);
    },
    // 打开家庭详情标签
    viewFamilyDetail(row) {
      const url = this.$router.resolve({
        name: "customer-family-detail",
        params: {
          id: row.id,
        },
      }).href;
      window.open(url);
    },
    getCustomerList: debounce(function() {
      this.loading = true;
      const { page, page_size, searchModel } = this;
      getCustomerList({
        page,
        page_size,
        ...searchModel,
      })
        .then((res) => {
          // this.list = page === 1 ? res.data : [...this.list, ...res.data]
          this.list = res.data;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    }, 300),
    getCustomerFamilyList: debounce(function() {
      this.loading = true;
      const { page, page_size, searchModel } = this;
      getCustomerFamilyList({
        page,
        page_size,
        ...searchModel,
        family_id: void 0,
      })
        .then((res) => {
          this.list = page === 1 ? res.data : [...this.list, ...res.data];
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    }, 300),
    handleTabChange() {
      this.searchModel = {
        keyword: "",
        sales_id: [],
        sales_team_id: [],
        family_id: [],
      };
      this.list = [];
      this.search();
    },
    search(page = 1) {
      this.page = page;
      // this.total = 0;
      this.tabIndex === "customer"
        ? this.getCustomerList()
        : this.getCustomerFamilyList();
    },
    // 主表滚动条到底部handler
    scroll2Bottom() {
      const { page, page_size, total } = this;
      if (page * page_size < total) {
        this.search(this.page + 1);
      }
    },
    // 出单人筛选数据
    getSalesData() {
      getSalesData()
        .then((res) => {
          this.salesList = res;
        })
        .catch((err) => console.log(err));
    },
    // 团队筛选数据
    getSalesTeamData() {
      getSalesTeamData()
        .then((res) => {
          this.salesTeamList = res.filter((i) => i.id !== -1);
        })
        .catch((err) => console.log(err));
    },
    getFilterData() {
      // 筛选项 - 关联家庭数据
      this.tabIndex === "customer" &&
        getCustomerFamilyList({ page: 1, page_size: 9999999 }).then((res) => {
          this.relativeFamilyList = res.data;
        });
      this.getSalesData();
      this.getSalesTeamData();
    },
  },
  watch: {
    tabIndex() {
      this.relativeFamilyList = [];
      this.salesList = [];
      this.salesTeamList = [];
      this.searchModel = {
        keyword: "",
        sales_id: [],
        sales_team_id: [],
        family_id: [],
      };
      this.getFilterData();
      this.handleTabChange();
    },
  },
  created() {
    if (this.$checkAuth("/customer/admin/customer_page_list")) {
      this.tabIndex = "customer";
      this.getCustomerList();
    } else {
      this.tabIndex = "family";
      this.getCustomerFamilyList();
    }
    this.getFilterData();
  },
};
</script>
<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ::v-deep .el-input-group__append {
    background-color: #1f78ff;
    border-color: #1f78ff;
    .el-button {
      color: #fff;
    }
  }
  .header {
    height: 56px;
    background-color: #f5f5f5;
    padding: 0 16px;
    display: flex;
    border-bottom: 1px solid #e6e6e6;
    justify-content: space-between;
    align-items: center;
    .tabs {
      height: 32px;
    }
  }
  .scroll-box {
    flex: 1;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>
