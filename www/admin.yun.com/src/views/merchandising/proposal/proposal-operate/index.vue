<template>
  <div class="new-layout-common">
    <div class="new-layout-common-body proposal">
      <el-scrollbar
        v-loading="!selectedInit"
        class="whole-scroller-container"
        style="height: 100vh"
      >
        <el-card class="proposal-card-shell" shadow="never">
          <div class="proposal-card-header">计划书基本信息</div>
          <div
            class="form-row"
            style="justify-content: flex-start; margin-top: 16px"
          >
            <div class="form-item customer">
              <div class="label">所属客户</div>
              <el-input
                placeholder="请输入所属客户名称"
                v-model="customerName"
              ></el-input>
            </div>
            <div class="form-item proposal-name">
              <div class="label">计划书名称</div>
              <el-input
                placeholder="请输入计划名称"
                v-model="formData.name"
              ></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <div class="label">备注</div>
              <el-input
                placeholder="备注信息不对客户展示，仅作为自我记忆使用"
                v-model="formData.remark"
                type="textarea"
                :autosize="{ minRows: 2 }"
              ></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <div class="label">
                家庭基本信息（PDF版本使用）
                <el-switch
                  class="ml10"
                  v-model="formData.has_pdf_illustration"
                  active-color="#1F78FF"
                  inactive-color="#E6E6E6"
                ></el-switch>
                <span
                  class="switcher-tips"
                  :class="{ active: formData.has_pdf_illustration }"
                  >{{ formData.has_pdf_illustration ? "展示" : "不展示" }}</span
                >
                <template v-if="formData.has_pdf_illustration">
                  <el-radio
                    class="ml20"
                    v-model="formData.pdf_illustration_type"
                    :label="editorTypes.ORDINARY"
                    @change="pdfIllustrationTypeChange"
                    >普通文本</el-radio
                  >
                  <el-radio
                    v-model="formData.pdf_illustration_type"
                    :label="editorTypes.RICH"
                    @change="pdfIllustrationTypeChange"
                    >富文本</el-radio
                  >
                </template>
              </div>
              <template v-if="formData.has_pdf_illustration">
                <el-input
                  placeholder="需对客户进行展示，请输入客户家庭基本信息分析内容"
                  type="textarea"
                  :autosize="{ minRows: 6 }"
                  v-if="formData.pdf_illustration_type === editorTypes.ORDINARY"
                  v-model="formData.pdf_illustration"
                ></el-input>
                <template
                  v-if="formData.pdf_illustration_type === editorTypes.RICH"
                >
                  <vue-ueditor-wrap
                    v-if="formData.has_pdf_illustration"
                    v-model="formData.pdf_illustration"
                    :config="UEditorConfig"
                  ></vue-ueditor-wrap>
                </template>
              </template>
            </div>
          </div>
          <div class="form-row pb16">
            <div class="form-item">
              <div class="label">
                家庭风险分析
                <el-radio
                  class="ml20"
                  v-model="formData.illustration_type"
                  :label="editorTypes.ORDINARY"
                  @change="illustrationTypeChange"
                  >普通文本</el-radio
                >
                <el-radio
                  v-model="formData.illustration_type"
                  :label="editorTypes.RICH"
                  @change="illustrationTypeChange"
                  >富文本</el-radio
                >
              </div>
              <el-input
                placeholder="需对客户进行展示，请输入客户家庭基本信息分析内容"
                type="textarea"
                :autosize="{ minRows: 6 }"
                v-if="formData.illustration_type === editorTypes.ORDINARY"
                v-model="formData.illustration"
              ></el-input>
              <template v-if="formData.illustration_type === editorTypes.RICH">
                <vue-ueditor-wrap
                  v-model="formData.illustration"
                  :config="UEditorConfig"
                ></vue-ueditor-wrap>
              </template>
            </div>
          </div>
        </el-card>
        <el-card class="proposal-card-shell" shadow="never">
          <div class="proposal-card-header">计划书展示设置</div>
          <div class="form-row mt16">
            <div>
              保险公司介绍
              <el-switch
                class="ml10"
                v-model="is_show_company_profile"
                active-color="#1F78FF"
                inactive-color="#E6E6E6"
              ></el-switch>
              <span
                class="switcher-tips"
                :class="{ active: is_show_company_profile }"
                >{{ is_show_company_profile ? "展示" : "不展示" }}</span
              >
            </div>
          </div>
          <div class="form-row">
            <div>
              投保链接
              <el-switch
                style="margin-left: 37px"
                v-model="is_show_link"
                active-color="#1F78FF"
                inactive-color="#E6E6E6"
              ></el-switch>
              <span class="switcher-tips" :class="{ active: is_show_link }">{{
                is_show_link ? "展示" : "不展示"
              }}</span>
            </div>
          </div>
          <div class="form-row pb16">
            <div>
              保额总汇
              <el-switch
                style="margin-left: 37px"
                v-model="is_show_coverage_aggregate"
                active-color="#1F78FF"
                inactive-color="#E6E6E6"
              ></el-switch>
              <span
                class="switcher-tips"
                :class="{ active: is_show_coverage_aggregate }"
                >{{ is_show_coverage_aggregate ? "展示" : "不展示" }}</span
              >
            </div>
          </div>
        </el-card>
        <el-card class="proposal-card-shell" shadow="never">
          <div class="proposal-card-header no-bottom">保险方案设计</div>
          <div class="proposal-card-body" style="overflow: visible">
            <el-button
              class="proposal-add-scheme proposal-edit-scheme"
              type="primary"
              size="small"
              plain
              @click="showEditMemberStructFunc"
              v-allowed="['proposal-customer-edit']"
            >
              <i class="iconfont fs12 iconchaoxiao_jiahao"></i>
              家庭结构编辑
            </el-button>

            <el-button
              class="proposal-add-scheme"
              type="primary"
              size="mini"
              @click="addProposal"
            >
              <i class="iconfont fs12 iconxiao16_jiahao"></i>
              新建方案
            </el-button>
            <el-tabs
              v-model="schemesTab"
              class="proposal-tabs"
              v-if="relationsSelected.length"
              type="card"
              closable
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="(item, index) in relationsSelected"
                :key="`${item.recognizee_policy_member.id}-${index}`"
                :label="`${item.name || ''} (${
                  familyTypes.filter(
                    (i) => i.value === item.recognizee_policy_member.relation
                  )[0].label
                })`"
                :name="`${item.member_id}`"
              >
                <div class="tab-container">
                  <div class="form-item no-margin-bottom">
                    <span class="tag orange"
                      >被保人：{{
                        familyTypes.filter(
                          (i) =>
                            i.value === item.recognizee_policy_member.relation
                        )[0].label
                      }}</span
                    >
                    <span class="tag orange"
                      >性别：
                      {{
                        item.recognizee_policy_member.sex === 1 ? "男" : "女"
                      }}</span
                    >
                    <span class="tag orange"
                      >年龄：{{
                        calcAge(item.recognizee_policy_member.birthday)
                      }}
                      周岁</span
                    >
                  </div>
                  <div class="form-item no-margin-bottom">
                    <span class="tag blue"
                      >投保人：{{
                        familyTypes.filter(
                          (i) => i.value === item.policy_holder_member.relation
                        )[0].label
                      }}</span
                    >
                    <span class="tag blue"
                      >性别：
                      {{
                        item.policy_holder_member.sex === 1 ? "男" : "女"
                      }}</span
                    >
                    <span class="tag blue"
                      >年龄：{{
                        calcAge(item.policy_holder_member.birthday)
                      }}
                      周岁</span
                    >
                  </div>
                  <div>
                    <div class="proposal-scheme-header">选择保险产品</div>
                    <div>
                      <el-select
                        v-model="schemesFilters[index].product_id_and_types"
                        filterable
                        remote
                        multiple
                        clear
                        clearable
                        class="product-selecter"
                        size="small"
                        placeholder="搜索或选择产品"
                        @change="searchProduct($event, index)"
                      >
                        <el-option
                          v-for="item in insuranceProductList"
                          :key="`${item.id}_${item.type}`"
                          :value="`${item.id}_${item.type}`"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                      <insurance-types
                        class="product-filter-item"
                        @search="search($event, index)"
                      ></insurance-types>
                      <insurance-company
                        class="product-filter-item"
                        @search="search($event, index)"
                      ></insurance-company>
                      <payment-period
                        class="product-filter-item"
                        @search="search($event, index)"
                      ></payment-period>
                      <guarantee-times
                        class="product-filter-item"
                        @search="search($event, index)"
                      ></guarantee-times>
                      <coverage
                        class="product-filter-item"
                        @search="search($event, index)"
                      ></coverage>
                      <el-button
                        class="fr flex-center"
                        type="primary"
                        size="mini"
                        @click="addDiyProduct(index)"
                      >
                        <i class="iconfont fs12 iconxiao16_jiahao"></i>
                        新建自定义产品
                      </el-button>
                    </div>
                  </div>
                  <div class="proposal-list-container">
                    <div class="proposal-list-header pr16">
                      <el-row :gutter="10">
                        <el-col :span="2">保险种类</el-col>
                        <el-col :span="2">保险公司</el-col>
                        <el-col :span="2">产品名称</el-col>
                        <el-col :span="2">缴费年限</el-col>
                        <el-col :span="2">保障期限</el-col>
                        <el-col :span="2">保额</el-col>
                        <el-col :span="2">社保</el-col>
                        <el-col :span="2">组与附加险</el-col>
                        <el-col
                          :span="4"
                          class="proposal-list-header-col"
                          title="收起"
                        >
                          <span @click="listTextHidden">
                            保障内容
                            <i class="el-icon-arrow-down bold"></i>
                          </span>
                        </el-col>
                        <el-col :span="2">保费</el-col>
                        <el-col :span="2">操作</el-col>
                      </el-row>
                    </div>
                    <div
                      class="proposal-list-body proposal-list-scroll-box"
                      v-loading="productListLoading"
                      @scroll="proposalProductScrollHandler(index)"
                      v-if="products[index] && products[index].length"
                    >
                      <div class="proposal-list" v-if="!productListLoading">
                        <div
                          class="proposal-list-item"
                          v-loading="productsState[index][idx].isLoading"
                          v-for="(product, idx) in products[index]"
                          :key="product.id"
                        >
                          <el-row :gutter="10" class="proposal-list-item-row">
                            <el-col :span="2">{{
                              product.first_product_category_name
                            }}</el-col>
                            <el-col :span="2" style="word-break: break-all">{{
                              product.supplier_name
                            }}</el-col>
                            <el-col :span="2">
                              {{ product.proposal_product_name }}
                              <div
                                v-if="product.common_terms.length"
                                class="check-terms"
                                @click="checkTerms(product)"
                              >
                                查看条款
                              </div>
                            </el-col>
                            <el-col :span="2">
                              <el-select
                                v-model="productsState[index][idx].pay_period"
                                size="mini"
                                @change="changeSelector($event, index, idx)"
                              >
                                <el-option
                                  v-for="item in product.pay_period"
                                  :key="item.text"
                                  :value="`${item.value}_${item.unit}`"
                                  :label="item.text"
                                ></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="2">
                              <el-select
                                v-model="
                                  productsState[index][idx].guarantee_period
                                "
                                size="mini"
                                @change="changeSelector($event, index, idx)"
                              >
                                <el-option
                                  v-for="item in product.guarantee_period"
                                  :key="item.text"
                                  :value="`${item.value}_${item.unit}`"
                                  :label="item.text"
                                ></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="2">
                              <el-select
                                v-model="
                                  productsState[index][idx].base_coverage_value
                                "
                                size="mini"
                                @change="changeSelector($event, index, idx)"
                              >
                                <el-option
                                  v-for="item in product.base_coverage_value"
                                  :key="item.text"
                                  :value="`${item.value}`"
                                  :label="item.text"
                                ></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="2" style="text-align: left">
                              <el-radio
                                v-model="
                                  productsState[index][idx].has_social_security
                                "
                                label="1"
                                @change="changeRadio($event, index, idx)"
                                >有社保</el-radio
                              >
                              <el-radio
                                v-model="
                                  productsState[index][idx].has_social_security
                                "
                                label="0"
                                @change="changeRadio($event, index, idx)"
                                >无社保</el-radio
                              >
                            </el-col>
                            <el-col
                              :span="2"
                              style="text-align: left; padding: 10px 0"
                            >
                              <el-popover
                                placement="right"
                                trigger="hover"
                                v-for="(
                                  option, kk
                                ) in product.product_insurance_group"
                                :key="option.id"
                              >
                                <el-radio-group
                                  v-model="
                                    productsState[index][idx].default_ids[kk]
                                  "
                                >
                                  <template
                                    v-for="radioItem in product
                                      .product_insurance_group[kk].insurances"
                                  >
                                    <div
                                      :key="radioItem.id"
                                      style="
                                        height: 32px;
                                        display: flex;
                                        align-items: center;
                                      "
                                    >
                                      <el-radio
                                        @change="
                                          changeRadioCheckbox(
                                            $event,
                                            index,
                                            idx
                                          )
                                        "
                                        :value="radioItem.id"
                                        :label="radioItem.id"
                                        >{{ radioItem.name }}</el-radio
                                      >
                                      <el-select
                                        :key="radioItem.id + 'select'"
                                        v-model="
                                          productsState[index][idx].insurances[
                                            productsState[index][
                                              idx
                                            ].insurances.findIndex(
                                              (i) =>
                                                i.id ===
                                                productsState[index][idx]
                                                  .default_ids[kk]
                                            )
                                          ].coverage
                                        "
                                        size="mini"
                                        :popper-append-to-body="false"
                                        popper-class="el-select-default"
                                        style="width: 80px; margin-left: 6px"
                                        @change="
                                          changeAccidentCheckbox(
                                            $event,
                                            index,
                                            idx
                                          )
                                        "
                                        v-if="
                                          productsState[index][idx].insurances[
                                            kk
                                          ] &&
                                          radioItem &&
                                          radioItem.id &&
                                          radioItem.type === 'accident' &&
                                          productsState[index][idx].default_ids[
                                            kk
                                          ] === radioItem.id
                                        "
                                      >
                                        <el-option
                                          v-for="a in radioItem.coverages"
                                          :key="a.value"
                                          :value="a.value"
                                          :label="a.value_text"
                                          >{{ a.value_text }}</el-option
                                        >
                                      </el-select>
                                    </div>
                                  </template>
                                </el-radio-group>
                                <div
                                  slot="reference"
                                  class="insurance-checkboxs"
                                >
                                  <el-checkbox
                                    :disabled="
                                      (option.select_status + '' !==
                                        'undefined' &&
                                        !option.select_status) ||
                                      !!option.is_main
                                    "
                                    :label="option.id"
                                    @change="
                                      changeClickCheckbox(
                                        $event,
                                        index,
                                        idx,
                                        kk
                                      )
                                    "
                                    :value="
                                      productsState[index][idx].default_ids[kk]
                                        ? true
                                        : false
                                    "
                                  >
                                    {{
                                      productsState[index][idx].default_ids[kk]
                                        ? product.product_insurance_group[
                                            kk
                                          ].insurances.filter(
                                            (i) =>
                                              i.id ==
                                              productsState[index][idx]
                                                .default_ids[kk]
                                          )[0].name +
                                          (!!productsState[index][idx]
                                            .insurances[
                                            productsState[index][
                                              idx
                                            ].insurances.findIndex(
                                              (i) =>
                                                i.id ===
                                                productsState[index][idx]
                                                  .default_ids[kk]
                                            )
                                          ].coverage
                                            ? "/" +
                                              productsState[index][idx]
                                                .insurances[
                                                productsState[index][
                                                  idx
                                                ].insurances.findIndex(
                                                  (i) =>
                                                    i.id ===
                                                    productsState[index][idx]
                                                      .default_ids[kk]
                                                )
                                              ].coverage
                                            : "")
                                        : option.name
                                    }}
                                    <i class="el-icon-arrow-right"></i>
                                  </el-checkbox>
                                </div>
                              </el-popover>
                            </el-col>
                            <el-col
                              :span="4"
                              style="text-align: left"
                              class="insurance-col"
                            >
                              <template v-if="!isTextHidden">
                                <div
                                  v-for="(item, idx) in productsState[index][
                                    idx
                                  ].guarantee_responsibilities"
                                  :key="idx"
                                >
                                  {{ item }}
                                </div>
                              </template>
                              <template v-else>
                                <div
                                  v-if="
                                    productsState[index][idx]
                                      .guarantee_responsibilities.length
                                  "
                                >
                                  {{
                                    productsState[index][idx]
                                      .guarantee_responsibilities[0]
                                  }}
                                </div>
                              </template>
                            </el-col>
                            <el-col :span="2">
                              <span
                                v-if="
                                  !productsState[index][idx].isError &&
                                  !productsState[index][idx].isLoading
                                "
                                >{{
                                  productsState[index][idx].total_premium
                                }}
                                元</span
                              >
                            </el-col>
                            <el-col :span="2">
                              <div
                                class="mb4"
                                v-if="
                                  productsSelected[index] &&
                                  productsSelected[index].filter(
                                    (i) =>
                                      i.product_id ===
                                      productsState[index][idx].product_id
                                  ).length
                                "
                              >
                                已添加:
                                {{
                                  productsSelected[index] &&
                                  productsSelected[index].filter(
                                    (i) =>
                                      i.product_id ===
                                      productsState[index][idx].product_id
                                  ).length
                                }}
                              </div>
                              <el-button
                                v-if="!productsState[index][idx].isError"
                                type="primary"
                                size="small"
                                icon="iconfont fs12 iconchaoxiao_jiahao"
                                @click="addProduct(index, idx, product)"
                                title="添加保险"
                              >
                                添加</el-button
                              >
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                    <div
                      class="proposal-list-body proposal-list-empty"
                      v-loading="!products[index] && productListLoading"
                      v-else
                    >
                      <span>暂无产品</span>
                    </div>
                    <div class="proposal-scheme-header">
                      已选择保险产品
                      <div
                        class="fr remove-scheme-selected-product"
                        @click="removeSelectedProduct(index)"
                      >
                        <i class="fs16 iconfont iconxiao_lajitong"></i>
                        <span>清除全部已选产品</span>
                      </div>
                    </div>
                    <div class="proposal-list-header selected">
                      <el-row :gutter="10">
                        <el-col :span="2">保险种类</el-col>
                        <el-col :span="2">保险公司</el-col>
                        <el-col :span="2">产品名称</el-col>
                        <el-col :span="2">缴费年限</el-col>
                        <el-col :span="2">保障期限</el-col>
                        <el-col :span="2">保额</el-col>
                        <el-col :span="2">社保</el-col>
                        <el-col :span="2">附加险</el-col>
                        <el-col
                          :span="4"
                          class="proposal-list-header-col"
                          title="收起"
                        >
                          <span @click="selectedListTextHidden">
                            保障内容
                            <i class="el-icon-arrow-down bold"></i>
                          </span>
                        </el-col>
                        <el-col :span="2">保费</el-col>
                        <el-col :span="2">操作</el-col>
                      </el-row>
                    </div>
                    <div
                      class="proposal-list-body"
                      v-loading="!selectedInit"
                      v-if="
                        productsSelected[index] &&
                        productsSelected[index].length &&
                        selectedInit
                      "
                    >
                      <div class="proposal-list">
                        <div
                          class="proposal-list-item"
                          v-for="(item, idx) in productsSelected[index]"
                          :key="idx"
                        >
                          <el-row :gutter="10" class="proposal-list-item-row">
                            <el-col :span="2">{{
                              item.first_product_category_name
                            }}</el-col>
                            <el-col :span="2" style="word-break: break-all">{{
                              item.supplier_name || "-"
                            }}</el-col>
                            <el-col :span="2">
                              {{ item.product_name }}
                              <div
                                v-if="
                                  item.common_terms && item.common_terms.length
                                "
                                class="check-terms"
                                @click="checkTerms(item)"
                              >
                                查看条款
                              </div>
                            </el-col>
                            <el-col :span="2">
                              <span
                                v-if="
                                  paytimeTypes.filter(
                                    (i) =>
                                      i.value == item.pay_period.split('_')[1]
                                  )[0].value !== '6'
                                "
                                >{{ +item.pay_period.split("_")[0] || ""
                                }}{{
                                  paytimeTypes.filter(
                                    (i) =>
                                      i.value == item.pay_period.split("_")[1]
                                  )[0].label
                                }}</span
                              >
                              <span v-else>
                                {{
                                  paytimeTypes
                                    .filter(
                                      (i) =>
                                        i.value == item.pay_period.split("_")[1]
                                    )[0]
                                    .label.replace("n", (v) => {
                                      return item.pay_period.split("_")[0];
                                    })
                                }}
                              </span>
                            </el-col>
                            <el-col :span="2">
                              <span
                                v-if="
                                  guaranteeTimeTypes.filter(
                                    (i) =>
                                      i.value ==
                                      item.guarantee_period.split('_')[1]
                                  )[0].value !== '5'
                                "
                                >{{ +item.guarantee_period.split("_")[0] || ""
                                }}{{
                                  guaranteeTimeTypes.filter(
                                    (i) =>
                                      i.value ==
                                      item.guarantee_period.split("_")[1]
                                  )[0].label
                                }}</span
                              >
                              <span v-else>
                                {{
                                  guaranteeTimeTypes
                                    .filter(
                                      (i) =>
                                        i.value ==
                                        item.guarantee_period.split("_")[1]
                                    )[0]
                                    .label.replace("n", (v) => {
                                      return item.guarantee_period.split(
                                        "_"
                                      )[0];
                                    })
                                }}
                              </span>
                            </el-col>
                            <el-col :span="2">{{
                              item.base_coverage_value
                            }}</el-col>
                            <el-col :span="2">{{
                              item.source === productFrom.MANUALLY_ENTER
                                ? "-"
                                : +item.has_social_security
                                ? "有社保"
                                : "无社保"
                            }}</el-col>
                            <el-col :span="2" class="col-tal">
                              <div
                                v-for="(item, index) in insuranceFormat(
                                  item.insurances,
                                  index,
                                  idx
                                )"
                                :key="index"
                              >
                                {{ item }}
                              </div>
                              <div v-if="!item.insurances.length">-</div>
                            </el-col>
                            <el-col :span="4" class="col-tal">
                              <template
                                v-if="item.proposal_product_guarantee_content"
                              >
                                <div
                                  v-for="line in item.proposal_product_guarantee_content.split(
                                    '\n'
                                  )"
                                  :key="line"
                                >
                                  {{ line }}
                                </div>
                              </template>
                              <template v-else>
                                <template v-if="!isSelectedTextHidden">
                                  <div
                                    v-for="(
                                      item, idx
                                    ) in item.guarantee_responsibilities"
                                    :key="idx"
                                  >
                                    {{ item }}
                                  </div>
                                </template>
                                <template v-else>
                                  <div>
                                    {{
                                      item.guarantee_responsibilities.length &&
                                      item.guarantee_responsibilities[0]
                                    }}
                                  </div>
                                </template>
                              </template>
                            </el-col>
                            <el-col :span="2"
                              >{{ item.total_premium }} 元</el-col
                            >
                            <el-col :span="2">
                              <div class="button-group">
                                <div class="move-button">
                                  <i
                                    class="
                                      button
                                      iconfont
                                      iconxiao16_shangzhixiangjiantou
                                      mr8
                                    "
                                    :class="{ disabled: !idx }"
                                    @click="
                                      changeSelectedPosition(
                                        index,
                                        idx,
                                        'up',
                                        !idx
                                      )
                                    "
                                  ></i>
                                  <i
                                    class="
                                      button
                                      iconfont
                                      iconxiao16_xiazhixiangjiantou
                                    "
                                    :class="{
                                      disabled:
                                        idx ===
                                        productsSelected[index].length - 1,
                                    }"
                                    @click="
                                      changeSelectedPosition(
                                        index,
                                        idx,
                                        'down',
                                        idx ===
                                          productsSelected[index].length - 1
                                      )
                                    "
                                  ></i>
                                </div>
                                <i
                                  class="
                                    iconfont
                                    iconxiao16_yuanxingchahao
                                    close
                                  "
                                  @click="removeProduct(index, idx)"
                                ></i>
                              </div>
                              <el-button
                                v-if="
                                  item.source === productFrom.MANUALLY_ENTER
                                "
                                type="primary"
                                plain
                                class="mt10"
                                size="mini"
                                style="display: flex; align-items: center"
                                @click="editDiyProduct(index, idx, item)"
                              >
                                <i class="fs12 iconfont iconxiao16_bianji"></i>
                                编辑
                              </el-button>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                    <div
                      class="proposal-list-body proposal-list-empty"
                      v-loading="!products[index] && productListLoading"
                      v-else
                    >
                      <span>暂无选择产品</span>
                    </div>
                    <div class="proposal-scheme-header">
                      方案配置说明
                      <el-switch
                        class="ml10"
                        v-model="ect[index].has_illustration"
                        active-color="#1F78FF"
                        inactive-color="#E6E6E6"
                      ></el-switch>
                      <span
                        class="switcher-tips"
                        :class="{ active: ect[index].has_illustration }"
                        >{{
                          ect[index].has_illustration ? "展示" : "不展示"
                        }}</span
                      >
                    </div>
                    <el-input
                      v-if="ect[index].has_illustration"
                      type="textarea"
                      :autosize="{ minRows: 6 }"
                      placeholder="请输入方案配置说明"
                      v-model="ect[index].illustration"
                    ></el-input>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="proposal-empty" v-else>暂无方案</div>
          </div>
        </el-card>
        <div class="footer-bar">
          <div class="footer-bar-inner">
            <div class="title">
              家庭保费汇总
              <span class="sum">
                {{ totalSum || 0 }}
                <span class="unit">元</span>
                <el-popover
                  placement="bottom"
                  width="300"
                  trigger="hover"
                  v-if="relationsSelected.length"
                >
                  <div
                    v-for="(item, index) in relationsSelected"
                    :key="index"
                    class="scheme-info-item"
                  >
                    {{ item.name || item.recognizee_policy_member.name }}
                    ({{
                      familyTypeFormat(item.recognizee_policy_member.relation)
                    }}) ：{{
                      (productsSelected[index] &&
                        productsSelected[index].length &&
                        productsSelected[index].reduce(
                          (p, n) => p + Number(n.total_premium),
                          0
                        )) ||
                      0
                    }}元
                  </div>
                  <i
                    class="iconfont iconxiao_chakangengduo_cheng fw400"
                    style="cursor: pointer"
                    slot="reference"
                  ></i>
                </el-popover>
              </span>
              <el-switch
                class="ml10"
                v-model="formData.is_show_premium"
                active-color="#1F78FF"
                inactive-color="#E6E6E6"
              ></el-switch>
              <span
                class="switcher-tips footer-tips"
                :class="{ active: formData.is_show_premium }"
                >{{ formData.is_show_premium ? "展示" : "不展示" }}</span
              >
            </div>
            <span>
              <el-button
                type="info"
                size="small"
                :loading="isButtonLoading"
                plain
                @click="submit(saveProposalTypes.hold.value)"
                >暂存</el-button
              >
              <el-button
                type="info"
                size="small"
                class="ml8"
                :loading="isButtonLoading"
                plain
                @click="submit(saveProposalTypes.preview.value)"
                >预览H5</el-button
              >
              <el-button
                type="info"
                size="small"
                class="ml8"
                :loading="isButtonLoading"
                plain
                @click="previewPdf(saveProposalTypes.preview.value, 'pdf')"
                >预览PDF</el-button
              >
              <el-button
                type="info"
                size="small"
                class="ml8"
                :loading="isButtonLoading"
                plain
                @click="previewPdf(saveProposalTypes.preview.value, 'image')"
                >预览图片</el-button
              >
              <el-button
                type="primary"
                size="small"
                class="ml8"
                :loading="isButtonLoading"
                @click="submit(saveProposalTypes.done.value)"
                >生成计划书</el-button
              >
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div
      class="new-preview-wrapper"
      v-if="previewVisible"
      @click="previewHandleClose"
    >
      <div class="new-preview-dialog">
        <!-- <div class="new-preview-dialog-close" @click="previewHandleClose"></div> -->
        <iframe
          class="new-preview-iframe"
          :src="proposal.view_url"
          frameborder="0"
        ></iframe>
      </div>
    </div>
    <el-dialog width="400px" :visible.sync="isTermsShow" title="产品条款">
      <div class="mb20">
        <div
          v-for="(item, index) in termsData"
          :key="index"
          class="term-link"
          @click="checkTermLink(item.file_url)"
        >
          {{ item.name }}
        </div>
      </div>
    </el-dialog>
    <proposal-material
      :show.sync="dialogVisible"
      :proposalInfo="proposal"
      title="成功生成计划书"
      from="proposalOperate"
    ></proposal-material>
    <add-diy-product
      :title="diyProductModalTitle"
      :show.sync="addDiyProductVisible"
      :type="diyType"
      :diyData="diyData"
      @diyProductSubmit="diyProductSubmit"
    />
    <el-dialog
      width="400px"
      :visible.sync="addDialogVisible"
      :before-close="addHandleClose"
      title="新建方案"
    >
      <el-form label-position="top">
        <el-form-item label="被保人" class="add-scheme-form">
          <el-select
            class="block"
            v-model="relationModel.recognizee_policy_member.id"
            placeholder="请选择被保人"
            @change="changeRecognizee"
          >
            <el-option
              v-for="item in relations"
              :disabled="
                relationsSelected.filter(
                  (i) =>
                    i.recognizee_policy_member.struct_member_id ===
                    item.struct_member_id
                ).length > 0
              "
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投保人" class="add-scheme-form">
          <el-select
            class="block"
            v-model="relationModel.policy_holder_member.id"
            placeholder="请选择投保人"
          >
            <el-option
              v-for="item in relations"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被保人姓名" class="add-scheme-form">
          <el-input
            placeholder="请输入被保人姓名"
            v-model="relationModel.name"
          ></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div>
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="selectRelation">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-backtop
      target=".whole-scroller-container .el-scrollbar__wrap"
      :bottom="100"
      :right="20"
    >
      <i class="el-icon-caret-top"></i>
    </el-backtop>

    <template v-if="showEditMemberStruct">
      <edit-member-struct
        :show.sync="showEditMemberStruct"
        :list="relations"
        :dataObj="{
          id: proposal_struct_id,
          type: 'safeguard_proposal',
          customer_name: customerName,
        }"
        @save="saveChange"
      ></edit-member-struct>
    </template>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import InsuranceTypes from './components/filters/insurance-types'
import Coverage from './components/filters/coverage'
import GuaranteeTimes from './components/filters/guarantee-times'
import InsuranceCompany from './components/filters/insurance-company'
import PaymentPeriod from './components/filters/payment-period'
import ProposalMaterial from './modal/proposal-material'
import addDiyProduct from './modal/add-diy-product'
import editMemberStruct from './modal/edit-member-struct'
import {
  getInsuranceList,
  getSupplierList,
  getInsuranceProductList,
  getProductList,
  getCost,
  saveProposal,
  getRelationsV2,
  getProposalCustomerSync,
  getProposalInfo,
  getCopyInfo
} from '@/apis/modules/proposal'

import {
  guaranteeTimeTypes,
  paytimeTypes,
  baseTypes,
  familyTypes,
  saveProposalTypes,
  productFrom
} from './config'

import calcAge from '@/utils/calc-age'

const editorTypes = {
  ORDINARY: 'ordinary',
  RICH: 'rich'
}

export default {
  name: 'proposal',
  components: {
    VueUeditorWrap,
    InsuranceTypes,
    Coverage,
    GuaranteeTimes,
    InsuranceCompany,
    PaymentPeriod,
    ProposalMaterial,
    addDiyProduct,
    editMemberStruct
  },
  watch: {
    productsSelected(v) {
      if (!this.selectedInit) return 0
      this.totalSum = v
        .reduce((prev, next) => {
          return (
            prev +
            next.reduce((p, v) => {
              return p + v.total_premium
            }, 0)
          )
        }, 0)
        .toFixed(2)
    },
    customerName(v) {
      document.title = `${v}的计划书`
    }
  },
  data() {
    return {
      productFrom,
      editorTypes,
      diyData: {},
      diyType: 'add',
      diyProductModalTitle: '',
      // 产品列表每页请求数量
      perPagesize: 7,
      currentSchemeIndex: 0,
      flag: false,
      totalProducts: [],
      perTabPage: [],
      totalSum: 0,
      selectedInit: true,
      proposal: {},
      ect: [],
      productListLoading: false,
      addDiyProductVisible: false,
      paytimeTypes,
      guaranteeTimeTypes,
      baseTypes,
      familyTypes,
      saveProposalTypes,
      schemesTab: 0,
      customerName: '',
      customerId: 0,
      UEditorConfig: {
        initialFrameWidth: null,
        // serverUrl: ''
        UEDITOR_HOME_URL: '/UEditor/'
      },
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
      },
      relationModel: {
        recognizee_policy_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        policy_holder_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        name: '',
        member_id: ''
      },
      proposal_struct_id: 0,
      insuranceList: [],
      supplierList: [],
      insuranceProductList: [],
      products: [],
      productsState: [],
      relationsSelected: [],
      productsSelected: [],
      relations: [],
      formData: {
        customer_id: 1,
        pdf_illustration_type: 'rich',
        illustration_type: 'rich',
        name: '',
        remark: '',
        illustration: '',
        schemes: [],
        is_show_premium: false,
        has_pdf_illustration: 1,
        pdf_illustration: ''
      },
      schemesFilters: [],
      schemesModel: {
        recognizee_policy_member_id: null,
        policy_holder_member_id: null,
        has_illustration: false,
        illustration: '',
        products: []
      },
      productsModel: {
        proposal_product_id: null,
        guarantee_period_value: null,
        guarantee_period_unit: null,
        pay_period_value: null,
        pay_period_unit: null,
        guarantee_quota: null,
        has_social_security: 1,
        insurances: []
      },
      addDialogVisible: false,
      dialogVisible: false,
      previewVisible: false,
      isTextHidden: true,
      isSelectedTextHidden: true,
      isButtonLoading: false,
      isTermsShow: false,
      termsData: [],
      containerWidth: 0,
      is_show_company_profile: 1,
      is_show_link: 0,
      is_show_coverage_aggregate: 0,
      fixedRightPoint: 0,
      showEditMemberStruct: false,
      familyStructId: ''
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.unBindScrollEvent()
  },
  methods: {
    init () {
      const id = this.$route.query.id
      const proposalId = this.$route.query.proposal_id
      this.customerName = this.$route.query.customer_name || ''
      this.customerId = this.$route.query.customer_id || 0
      this.familyStructId = this.$route.query.family_struct_id || ''
      // 计划书入口有三个
      // 1. 计划书列表 > 新增计划书 (query: customer_id&customer_name)
      // 2. 我的客户管理 > 新增计划书 (query: id)
      // 3. 计划书列表 > 编辑/复制 (query: proposal_id)
      if (proposalId) {
        // 3 进入 先请求计划书详情接口，再获取家庭关系
        if (this.customerId > 0) {
          this.getProposalCustomerSync(this.customerId, () => {
            if (this.familyStructId) {
              this.getCopyInfo(proposalId)
            } else {
              this.getProposalInfo(proposalId)
            }
          })
        } else {
          if (this.familyStructId) {
              this.getCopyInfo(proposalId)
            } else {
              this.getProposalInfo(proposalId)
            }
        }
      } else {
        if (id) {
          // 2 进入 先获取用户id，再获取家庭关系
          this.getProposalCustomerSync(id)
        } else {
          // 1 进入 获取家庭关系
          this.getRelations(this.customerId)
          this.customerId = 0
          this.proposal_struct_id = this.$route.query.customer_id
        }
      }
      // this.getInsuranceList()
      // this.getSupplierList()
      this.getInsuranceProductList()
      setTimeout(() => {
        this.bindScrollEvent()
        const shell = document.querySelector('.proposal-card-shell').getBoundingClientRect()
        this.containerWidth = shell.width
        const shellRightPoint = shell.left + shell.width
        this.fixedRightPoint = innerWidth - shellRightPoint
      }, 300)
    },
    saveChange (value) { // 修改家庭关系结构后调用
      // console.log('修改类型', type)
      // this.insureDetailLoading = true
      // if (type === 'update-member') {
      //   this.getRelations(this.proposal_struct_id)
      // } else if (type === 'update-detail') {
      //   this.init()
      // }
      console.log('修改类型', value)
      if (value === 'update-member') {
        this.getRelations(this.proposal_struct_id)
      } else {
        // this.init()
        this.getRelations(this.proposal_struct_id)
        this.changeMemberSchemes(value)
      }
    },
    changeMemberSchemes (list) {
      let self = this
      if (list) {
        list.map(item => {
          self.removeTabInchange(item)
        })
      }
    },
    removeSelectedProduct(index) {
      this.$confirm('是否删全部产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.productsSelected.splice(index, 1, [])
      })
    },
    searchProduct(value, index) {
      if (!value.length) {
        this.$set(this.totalProducts, index, [])
        this.$set(this.perTabPage, index, 1)
        this.$set(this.productsState, index, [])
        this.$set(this.products, index, [])
      } else {
        this.search({}, index)
      }
    },
    familyTypeFormat(value) {
      return familyTypes.find(i => i.value === value).label
    },
    illustrationTypeChange() {
      this.formData.illustration = ''
    },
    pdfIllustrationTypeChange() {
      this.formData.pdf_illustration = ''
    },
    proposalProductScrollHandler(index) {
      if (this.products[index].length === this.totalProducts[index].length) return
      const box = document.querySelectorAll('.proposal-list-scroll-box')[index]
      const boxScrollTop = box.scrollTop
      const boxHeight = box.getBoundingClientRect().height
      const listHeight = box.firstElementChild.getBoundingClientRect().height
      if (boxHeight + boxScrollTop >= listHeight) {
        // 等待前面列表加载完成
        if (this.flag) return

        this.flag = true
        const start = this.perPagesize * this.perTabPage[index]++
        const end = start + this.perPagesize
        // 截取 totalProducts 数据，放进 setProductsState 进行处理
        this.setProductsState(
          index,
          this.totalProducts[index].slice(start, end)
        )
      }
    },
    changeRecognizee(v) {
      if (v) {
        this.relationModel.name = this.relations.find(item => item.id === v)
          ? this.relations.find(item => item.id === v).member_name
          : ''
      } else {
        this.relationModel.name = ''
      }
    },
    checkTermLink(link) {
      window.open(link)
    },
    checkTerms(terms) {
      this.termsData = terms.common_terms
      this.isTermsShow = true
    },
    unBindScrollEvent() {
      document
        .querySelector('.whole-scroller-container .el-scrollbar__wrap')
        .removeEventListener('scroll', this.scrollHandler)
    },
    bindScrollEvent() {
      document
        .querySelector('.whole-scroller-container .el-scrollbar__wrap')
        .addEventListener('scroll', this.scrollHandler)
    },
    addDiyProduct(index) {
      this.diyProductModalTitle = '新建自定义产品'
      this.diyType = 'add'
      this.addDiyProductVisible = true
      this.currentSchemeIndex = index
    },
    editDiyProduct(index, idx, item) {
      this.diyProductModalTitle = '编辑自定义产品'
      this.diyType = 'edit'
      this.addDiyProductVisible = true
      this.currentSchemeIndex = index
      this.currentEditProductIndex = idx
      this.diyData = Object.assign({}, item)
    },
    scrollHandler() {
      // 如果为初始状态，还没选择任何家庭成员，则不执行
      if (!document.querySelector('.proposal-tabs')) return
      const tabBlockTop = document.querySelectorAll('.proposal-card-shell')[2]
        .offsetTop
      const tabBar = document.querySelector('.proposal-tabs .el-tabs__header')
      const tabContent = document.querySelector('.proposal-tabs .el-tabs__content')
      const addSchemeButton = document.querySelector('.proposal-add-scheme')

      const operateBlockTop = document.querySelector(
        '.whole-scroller-container .el-scrollbar__wrap'
      ).scrollTop
      if (operateBlockTop > tabBlockTop + 41) {
        tabBar.classList.add('tab-fixed')
        tabContent.style.marginTop = `41px`
        addSchemeButton.classList.add('tab-fixed')
        addSchemeButton.style.right = `${this.fixedRightPoint + 14}px`
        tabBar.style.width = `${this.containerWidth - 2}px`
      } else {
        tabBar.classList.remove('tab-fixed')
        tabContent.style.marginTop = `0`
        addSchemeButton.classList.remove('tab-fixed')
        addSchemeButton.style.right = `14px`
        tabBar.style.width = `auto`
      }
    },
    changeSelectedPosition(index, idx, type, bool) {
      if (bool) return
      if (type === 'up') {
        const upItem = this.productsSelected[index][idx - 1]
        const downItem = this.productsSelected[index][idx]

        this.$set(this.productsSelected[index], idx, upItem)
        this.$set(this.productsSelected[index], idx - 1, downItem)
      } else {
        const upItem = this.productsSelected[index][idx]
        const downItem = this.productsSelected[index][idx + 1]

        this.$set(this.productsSelected[index], idx, downItem)
        this.$set(this.productsSelected[index], idx + 1, upItem)
      }
    },
    getCopyInfo(proposalId) {
      this.selectedInit = false
      getCopyInfo({ source_proposal_id: proposalId, family_struct_id: this.familyStructId })
        .then(res => {
          this.customerName = res.customer_name
          this.customerId = res.customer_id
          this.is_show_company_profile = !!res.is_show_company_profile
          this.is_show_link = !!res.is_show_link
          this.is_show_coverage_aggregate = !!res.is_show_coverage_aggregate
          this.proposal_struct_id = res.proposal_struct_id
          // if (this.customerId > 0) {
          //   this.getProposalCustomerSync(this.customerId)
          // }
          this.getRelations(res.proposal_struct_id)
          this.formData = {
            name: res.name,
            remark: res.remark,
            illustration: res.illustration,
            is_show_premium: !!res.is_show_premium,
            has_pdf_illustration: !!res.has_pdf_illustration,
            pdf_illustration: res.pdf_illustration,
            pdf_illustration_type: res.pdf_illustration_type,
            illustration_type: res.illustration_type
          }
          this.relationsSelected = res.schemes.map(item => {
            return {
              member_id: item.recognizee_policy_member_id.toString() || '',
              name: item.recognizee_policy_name,
              recognizee_policy_member: {
                id: item.recognizee_policy_member_id,
                name: item.recognizee_policy_name,
                relation: item.recognizee_policy_relation,
                sex: item.recognizee_policy_sex,
                birthday: item.recognizee_policy_birthday,
                struct_member_id: item.recognizee_policy_struct_member_id
              },
              policy_holder_member: {
                id: item.policy_holder_member_id,
                name: item.policy_holder_name,
                relation: item.policy_holder_relation,
                sex: item.policy_holder_sex,
                birthday: item.policy_holder_birthday,
                struct_member_id: item.policy_holder_struct_member_id
              }
            }
          })
          
          this.schemesTab = this.relationsSelected.length > 0 ? this.relationsSelected[0].member_id : 0
          // 获取已选择产品数据，再次进行费率计算
          const selectedData = res.schemes.map((item, index) => {
            const relation = this.relationsSelected[index]
            return item.products.map(product => {
              return {
                source: product.source,
                product_id: product.source_proposal_product_id,
                guarantee_period_value: product.guarantee_period_value,
                guarantee_period_unit: product.guarantee_period_unit,
                pay_period_value: product.pay_period_value,
                pay_period_unit: product.pay_period_unit,
                guarantee_quota: product.guarantee_quota,
                has_social_security: product.has_social_security,
                recognizee_policy_id: relation.recognizee_policy_member.id,
                recognizee_policy_sex: relation.recognizee_policy_member.sex,
                recognizee_policy_birthday:
                  relation.recognizee_policy_member.birthday,
                policy_holder_id: relation.policy_holder_member.id,
                policy_holder_sex: relation.policy_holder_member.sex,
                policy_holder_birthday: relation.policy_holder_member.birthday,
                insurances: product.insurances.map(i => ({
                  id: i.source_proposal_insurance_id,
                  coverage: i.guarantee_quota
                }))
              }
            })
          })

          this.ect = res.schemes.map(i => {
            return {
              has_illustration: !!i.has_illustration,
              illustration: i.illustration
            }
          })

          this.schemesFilters = res.schemes.map(() => {
            return JSON.parse(JSON.stringify(this.schemesFilterModel))
          })

          this.confirmPrice(selectedData, res)

          // this.schemesFilters.forEach((item, index) => {
          //   this.search({}, index)
          // })
        })
        .catch(err => console.log(err))
    },
    getProposalInfo(proposalId) {
      this.selectedInit = false
      getProposalInfo({ id: proposalId })
        .then(res => {
          this.customerName = res.customer_name
          this.customerId = res.customer_id
          this.is_show_company_profile = !!res.is_show_company_profile
          this.is_show_link = !!res.is_show_link
          this.is_show_coverage_aggregate = !!res.is_show_coverage_aggregate
          this.proposal_struct_id = res.proposal_struct_id
          // if (this.customerId > 0) {
          //   this.getProposalCustomerSync(this.customerId)
          // }
          this.getRelations(res.proposal_struct_id)
          this.formData = {
            name: res.name,
            remark: res.remark,
            illustration: res.illustration,
            is_show_premium: !!res.is_show_premium,
            has_pdf_illustration: !!res.has_pdf_illustration,
            pdf_illustration: res.pdf_illustration,
            pdf_illustration_type: res.pdf_illustration_type,
            illustration_type: res.illustration_type
          }
          this.relationsSelected = res.schemes.map(item => {
            return {
              member_id: item.recognizee_policy_member_id.toString() || '',
              name: item.recognizee_policy_name,
              recognizee_policy_member: {
                id: item.recognizee_policy_member_id,
                name: item.recognizee_policy_name,
                relation: item.recognizee_policy_relation,
                sex: item.recognizee_policy_sex,
                birthday: item.recognizee_policy_birthday,
                struct_member_id: item.recognizee_policy_struct_member_id
              },
              policy_holder_member: {
                id: item.policy_holder_member_id,
                name: item.policy_holder_name,
                relation: item.policy_holder_relation,
                sex: item.policy_holder_sex,
                birthday: item.policy_holder_birthday,
                struct_member_id: item.policy_holder_struct_member_id
              }
            }
          })
          
          this.schemesTab = this.relationsSelected.length > 0 ? this.relationsSelected[0].member_id : 0
          // 获取已选择产品数据，再次进行费率计算
          const selectedData = res.schemes.map((item, index) => {
            const relation = this.relationsSelected[index]
            return item.products.map(product => {
              return {
                source: product.source,
                product_id: product.source_proposal_product_id,
                guarantee_period_value: product.guarantee_period_value,
                guarantee_period_unit: product.guarantee_period_unit,
                pay_period_value: product.pay_period_value,
                pay_period_unit: product.pay_period_unit,
                guarantee_quota: product.guarantee_quota,
                has_social_security: product.has_social_security,
                recognizee_policy_id: relation.recognizee_policy_member.id,
                recognizee_policy_sex: relation.recognizee_policy_member.sex,
                recognizee_policy_birthday:
                  relation.recognizee_policy_member.birthday,
                policy_holder_id: relation.policy_holder_member.id,
                policy_holder_sex: relation.policy_holder_member.sex,
                policy_holder_birthday: relation.policy_holder_member.birthday,
                insurances: product.insurances.map(i => ({
                  id: i.source_proposal_insurance_id,
                  coverage: i.guarantee_quota
                }))
              }
            })
          })

          this.ect = res.schemes.map(i => {
            return {
              has_illustration: !!i.has_illustration,
              illustration: i.illustration
            }
          })

          this.schemesFilters = res.schemes.map(() => {
            return JSON.parse(JSON.stringify(this.schemesFilterModel))
          })

          this.confirmPrice(selectedData, res)

          // this.schemesFilters.forEach((item, index) => {
          //   this.search({}, index)
          // })
        })
        .catch(err => console.log(err))
    },
    async confirmPrice(data, res) {
      let tabIndex = 0
      for (let tab of data) {
        let itemIndex = 0
        this.$set(this.productsSelected, tabIndex, [])
        for (let item of tab) {
          // 设置已选商品
          const product = res.schemes[tabIndex].products[itemIndex]
          if (item.source === productFrom.MANUALLY_ENTER) {
            this.productsSelected[tabIndex].push({
              source: product.source,
              base_coverage_value: product.guarantee_quota,
              common_terms: [],
              first_product_category_name: product.first_product_category_name,
              guarantee_period: `${product.guarantee_period_value}_${product.guarantee_period_unit}`,
              has_social_security: 0,
              insurances: [],
              total_premium: product.premium,
              product_id: 0,
              product_name: product.product_name,
              supplier_name: product.supplier_name,
              source_supplier_id: product.source_supplier_id,
              source_category_id: product.source_category_id,
              proposal_product_guarantee_content: product.proposal_product_guarantee_content,
              category_icon: product.category_icon,
              pay_period: `${product.pay_period_value}_${product.pay_period_unit}`,
              insurance_premium: null,
              insurance_ids: [],
              guarantee_responsibilities: []
            })
            // this.totalSum = (product.premium + this.totalSum).toFixed(2)
          } else {
            try {
              let response = await getCost(item)
              let insurances = response.insurances.filter(
                      item => item.select_status === 1
              )
              this.productsSelected[tabIndex].push({
                source: product.source,
                common_terms: product.common_terms || [], // 查看条款
                first_product_category_name: product.first_product_category_name,
                supplier_name: product.supplier_name,
                source_supplier_id: product.source_supplier_id,
                product_name: product.proposal_product_name,
                pay_period: `${product.pay_period_value}_${product.pay_period_unit}`,
                guarantee_period: `${product.guarantee_period_value}_${product.guarantee_period_unit}`,
                base_coverage_value: product.guarantee_quota,
                product_id: product.source_proposal_product_id,
                has_social_security: product.has_social_security,
                insurances: insurances.map(i => ({
                  name: i.name,
                  id: i.id,
                  coverage: i.coverage,
                  type: i.type,
                  coverageText: i.coverages
                          ? i.coverages.filter(y => +y.value === +i.coverage)[0]
                                  .value_text
                          : ''
                })),
                guarantee_responsibilities: insurances
                        .filter(i => i.guarantee_responsibilities)
                        .reduce((prev, next) => {
                          return prev.concat(
                                  next.guarantee_responsibilities.map(
                                          y => `${y.name}: ${y.value_text}`
                                  )
                          )
                        }, []),
                total_premium: response.total_premium
              })

              this.totalSum = (response.total_premium + this.totalSum).toFixed(2)
            } catch (error) {console.log(error)}
          }

          itemIndex += 1
        }

        tabIndex += 1
      }

      this.selectedInit = true
    },
    getProposalCustomerSync(id, cb) {
      getProposalCustomerSync({ customer_id: id })
        .then(res => {
          // this.customerId = res.id
          this.proposal_struct_id = res.id
          this.getRelations(res.id)
          if (cb) {
            cb()
          }
        })
        .catch(err => console.log(err))
    },
    calcAge(val) {
      if (!val) return
      let formatVal = [...(val + '')]
      formatVal.splice(4, 0, '-')
      formatVal.splice(7, 0, '-')
      return calcAge(formatVal.join(''))
    },
    insuranceFormat(data) {
      return data
        .filter(i => i.id)
        .map(item => {
          return `${item.name}${
            item.type === 'accident' ? `:${item.coverageText}` : ''
          }`
        })
    },
    previewPdf(type, mode) {
      this.submit(type, res => {
        const id = res.pcode
        window.open(
          `${process.env.VUE_APP_API_URL}/agent/proxy/proposal/file/view/${mode}?pcode=${id}`
        )
      })
    },
    checkPdf(type) {
      window.open(
        `${process.env.VUE_APP_API_URL}/agent/proxy/proposal/pdf/${type}?proposal_id=${this.proposal.id}`
      )
    },
    submit(type, cb) {
      this.isButtonLoading = true
      this.proposal = {}
      const data = {
        id: this.$route.query.proposal_id
                ? this.$route.query.proposal_id
                : null,
        customer_id: this.$route.query.id || this.customerId || 0,
        proposal_struct_id: this.proposal_struct_id,
        name: this.formData.name,
        customer_name: this.customerName,
        is_show_company_profile: this.is_show_company_profile ? 1 : 0,
        is_show_link: this.is_show_link ? 1 : 0,
        is_show_coverage_aggregate: this.is_show_coverage_aggregate ? 1 : 0,
        status: type,
        remark: this.formData.remark,
        illustration: this.formData.illustration,
        is_show_premium: this.formData.is_show_premium ? 1 : 0,
        pdf_illustration: this.formData.has_pdf_illustration
                ? this.formData.pdf_illustration
                : '',
        has_pdf_illustration: this.formData.has_pdf_illustration ? 1 : 0,
        pdf_illustration_type: this.formData.pdf_illustration_type,
        illustration_type: this.formData.illustration_type,
        schemes: this.productsSelected.map((i, index) => {
          const recognizeePolicyMember = this.relationsSelected[index]
                  .recognizee_policy_member
          const policyHolderMember = this.relationsSelected[index]
                  .policy_holder_member
          return {
            recognizee_policy_member_id: recognizeePolicyMember.id,
            recognizee_policy_name: this.relationsSelected[index].name
                    ? this.relationsSelected[index].name
                    : recognizeePolicyMember.name,
            recognizee_policy_relation: recognizeePolicyMember.relation,
            recognizee_policy_sex: recognizeePolicyMember.sex,
            recognizee_policy_birthday: recognizeePolicyMember.birthday,
            recognizee_policy_struct_member_id:
            recognizeePolicyMember.struct_member_id,
            policy_holder_member_id: policyHolderMember.id,
            policy_holder_name: policyHolderMember.name,
            policy_holder_relation: policyHolderMember.relation,
            policy_holder_sex: policyHolderMember.sex,
            policy_holder_birthday: policyHolderMember.birthday,
            policy_holder_struct_member_id: policyHolderMember.struct_member_id,
            has_illustration: this.ect[index].has_illustration ? 1 : 0,
            illustration: this.ect[index].illustration,
            products: i.map(y => {
              if (y.source === productFrom.MANUALLY_ENTER) {
                return {
                  source: y.source,
                  product_name: y.product_name,
                  premium: y.total_premium,
                  proposal_product_guarantee_content: y.proposal_product_guarantee_content,
                  category_name: y.first_product_category_name,
                  category_icon: y.category_icon,
                  source_category_id: y.source_category_id,
                  proposal_product_id: 0,
                  guarantee_period_value: y.guarantee_period.split('_')[0],
                  guarantee_period_unit: y.guarantee_period.split('_')[1],
                  pay_period_value: y.pay_period.split('_')[0],
                  pay_period_unit: y.pay_period.split('_')[1],
                  guarantee_quota: y.base_coverage_value,
                  has_social_security: 0,
                  supplier_name: y.supplier_name,
                  source_supplier_id: y.source_supplier_id,
                  insurances: []
                }
              }
              return {
                source: productFrom.FROM_INSURANCE,
                proposal_product_id: y.product_id,
                guarantee_period_value: y.guarantee_period.split('_')[0],
                guarantee_period_unit: y.guarantee_period.split('_')[1],
                pay_period_value: y.pay_period.split('_')[0],
                pay_period_unit: y.pay_period.split('_')[1],
                guarantee_quota: y.base_coverage_value,
                has_social_security: y.has_social_security,
                insurances: y.insurances.filter(z => z.id)
              }
            })
          }
        })
      }
      saveProposal({ data: JSON.stringify(data) }).then(res => {
          this.isButtonLoading = false
          this.proposal = res
          if (cb) {
            return cb(res)
          }
          if (type === 1) {
            this.previewVisible = true
          } else if (type === 2) {
            this.dialogVisible = true
          } else {
            this.$message({
              message: '计划书暂存成功',
              type: 'success'
            })
            window.localStorage.setItem('refreshPage', new Date().getTime())
            window.close()
          }
        })
        .catch(() => {
          this.isButtonLoading = false
        })
    },
    changeSelector(value, index, idx) {
      this.getCost(value, index, idx)
    },
    changeRadio(value, index, idx) {
      this.getCost(value, index, idx)
    },
    changeAccidentCheckbox(value, index, idx) {
      this.getCost(value, index, idx)
    },
    changeCheckbox(value, index, idx) {
      const f = this.products[index][idx].product_insurances.map((i, kk) => {
        if (this.productsState[index][idx].insurance_ids.indexOf(i.id) !== -1) {
          if (i.type === 'accident') {
            return Object.assign({}, i, {
              coverage:
                (this.productsState[index][idx].insurances[kk] &&
                  this.productsState[index][idx].insurances[kk].coverage) ||
                this.products[index][idx].product_insurances[kk].coverages[0]
                  .value
            })
          }
          return Object.assign({}, i, {
            coverage:
              (this.productsState[index][idx].insurances[kk] &&
                this.productsState[index][idx].insurances[kk].coverage) ||
              ''
          })
        } else {
          return {
            id: null,
            coverage: null,
            type: i.type
          }
        }
      })
      this.productsState[index][idx].insurances = f

      this.getCost(value, index, idx)
    },
	changeClickCheckbox(value, index, idx, kk){
	if(this.productsState[index][idx].default_ids[kk] == ''){
		return;
	}
	this.$set( this.productsState[index][idx].default_ids, kk, '' );
	this.changeRadioCheckbox('', index, idx);
	},
	changeRadioCheckbox(value, index, idx){
		let product_insurances = [];
		for (let i = 0; i < this.products[index][idx].product_insurance_group.length; i++) {
			for (let j = 0; j < this.products[index][idx].product_insurance_group[i].insurances.length; j++) {
				product_insurances.push(this.products[index][idx].product_insurance_group[i].insurances[j])
			}
		}
		const f = product_insurances.map((i, kk) => {
		if (this.productsState[index][idx].default_ids.indexOf(i.id) !== -1) {
			if (i.type === 'accident') {
				return Object.assign({}, i, {
					coverage:
						(this.productsState[index][idx].insurances[kk]
						&& this.productsState[index][idx].insurances[kk].coverage)
						|| product_insurances[kk].coverages[0].value
					})
			}
			return Object.assign({}, i, {
			coverage:
				(this.productsState[index][idx].insurances[kk] &&
					this.productsState[index][idx].insurances[kk].coverage) ||
					''
			})
		} else {
			return {
				id: null,
				coverage: null,
				type: i.type
			}
		}
		})
		this.productsState[index][idx].insurances = f;
		this.getCost(value, index, idx)
	},
    getCost(value, index, idx) {
      const relation = this.relationsSelected[index]
      const productState = this.productsState[index][idx]
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
        insurance_ids: productState.default_ids.filter(i => i != '')
      }

      getCost(data)
        .then(res => {
          let insurances = res.insurances.filter(
            item => item.select_status === 1
          )
          this.products[index][idx].product_insurances = res.insurances.map(
            i => i
          )
          productState.insurances = productState.insurances.map(
            (item) => {
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
    diyProductSubmit(data, type) {
      const baseCoverageMult = baseTypes.find(i => i.value === data.guarantee_quota_unit).multiple
      const d = {
        source: productFrom.MANUALLY_ENTER,
        base_coverage_value: data.guarantee_quota_value * baseCoverageMult,
        common_terms: [],
        first_product_category_name: data.category_name,
        guarantee_period: `${data.guarantee_period_value}_${data.guarantee_period_unit}`,
        guarantee_responsibilities: [],
        has_social_security: null,
        insurance_ids: [],
        insurance_premium: null,
        insurances: [],
        pay_period: `${data.pay_period_value}_${data.pay_period_unit}`,
        product_id: 0,
        product_name: data.product_name,
        supplier_name: data.supplier_name,
        source_supplier_id: data.source_supplier_id,
        total_premium: +data.premium,
        source_category_id: data.source_category_id || 0,
        proposal_product_guarantee_content: data.proposal_product_guarantee_content,
        category_icon: data.category_icon
      }

      const product = JSON.parse(JSON.stringify(d))
      if (type === 'edit') {
        this.$set(this.productsSelected[this.currentSchemeIndex], this.currentEditProductIndex, product)
        // this.productsSelected[this.currentSchemeIndex][this.currentEditProductIndex] = product
      } else {
        this.productsSelected[this.currentSchemeIndex].push(product)
      }
    },
    // 已选产品
    addProduct(index, idx) {
      const data = JSON.parse(JSON.stringify(this.productsState[index][idx]))
      this.productsSelected[index].push(data)
    },
    removeProduct(index, idx) {
      this.productsSelected[index].splice(idx, 1)
      // this.$confirm('是否删除该产品?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.productsSelected[index].splice(idx, 1)
      // })
    },
    search(value, index) {
      this.productListLoading = true

      this.$set(this.productsState, index, [])

      const filter = Object.assign(this.schemesFilters[index], value)
      const data = Object.assign(
        {},
        filter,
        {
          product_id_and_types:
            (filter.product_id_and_types.length &&
              filter.product_id_and_types.map(i => ({
                id: i.split('_')[0],
                type: i.split('_')[1]
              }))) ||
            ''
        },
        {
          pay_period: filter.pay_period.unit
            ? JSON.stringify(filter.pay_period)
            : '',
          guarantee_period: filter.guarantee_period.unit
            ? JSON.stringify(filter.guarantee_period)
            : '',
          base_coverage_value: filter.base_coverage_value.unit
            ? JSON.stringify(filter.base_coverage_value)
            : ''
        }
      )
      this.getProductList(data, index)
    },
    updateInsuranceProductList(index) {
      const firstIds = this.schemesFilters[index].first_product_category_ids
      const supplierIds = this.schemesFilters[index].supplier_ids

      if (firstIds.length && supplierIds.length) {
        this.getInsuranceProductList(null, firstIds, supplierIds)
      }
    },
    getInsuranceProductList(name, firstIds, supplierIds) {
      getInsuranceProductList({
        name,
        first_product_category_ids: firstIds,
        supplier_ids: supplierIds
      }).then(res => {
        this.insuranceProductList = res
      })
    },
    getProductList(data, index) {
      getProductList(data)
        .then(res => {
          // 将全部产品储存在 totalProducts 以供后续数据截取使用
          this.$set(this.totalProducts, index, JSON.parse(JSON.stringify(res)))
          // 初始化为第一页
          this.$set(this.perTabPage, index, 1)
          this.productListLoading = false
          if (res.length <= this.perPagesize) {
            // this.$set(this.products, index, JSON.parse(JSON.stringify(res)))
            this.setProductsState(index, JSON.parse(JSON.stringify(res)))
          } else {
            // this.$set(this.products, index, JSON.parse(JSON.stringify(res.slice(0, this.perPagesize))))
            // 初始，截取，处理
            this.setProductsState(
              index,
              JSON.parse(JSON.stringify(res.slice(0, this.perPagesize)))
            )
          }
        })
        .catch(() => {
          this.productListLoading = false
        })
    },
    async setProductsState(index, res) {
      const relation = this.relationsSelected[index]

      let data = res.map(item => {
			return {
			common_terms: item.common_terms,
			first_product_category_name: item.first_product_category_name,
			supplier_name: item.supplier_name,
      source_supplier_id: item.source_supplier_id,
			product_name: item.proposal_product_name,
			pay_period: `${item.pay_period[0].value}_${item.pay_period[0].unit}`,
			guarantee_period: `${item.guarantee_period[0].value}_${item.guarantee_period[0].unit}`,
			base_coverage_value: `${item.base_coverage_value[0].value}`,
			product_id: item.id,
			has_social_security: '1',
			insurances: item.product_insurance_group.map((i)=>{
				let isHasDefault = i.insurances.filter(ii=> ii.is_default === 1).length;
					if(isHasDefault){
						return{
							id:i.insurances.filter(ii=> ii.is_default === 1)[0].id,
							name:i.insurances.filter(ii=> ii.is_default === 1)[0].name,
							coverage:i.insurances.filter(ii=> ii.is_default === 1)[0].coverages.length ? i.insurances.filter(ii=> ii.is_default === 1)[0].coverages[0].value : '',
							type:i.insurances.filter(ii=> ii.is_default === 1)[0].type,
							coverageText:i.insurances.filter(ii=> ii.is_default === 1)[0].coverages.length ? i.insurances.filter(ii=> ii.is_default === 1)[0].coverages[0].value_text : ''
						}
					}else{
						return {
							id:'',
							name:'',
							coverage:'',
							type:'',
							coverageText:''
						}
					}
			}),
			insurance_ids:item.product_insurance_group.map(i => i.insurances.filter(ii=> ii.is_default === 1).length ? i.insurances.filter(ii=> ii.is_default === 1)[0].id : ''),
			default_ids:item.product_insurance_group.map(i => i.insurances.filter(ii=> ii.is_default === 1).length ? i.insurances.filter(ii=> ii.is_default === 1)[0].id : ''),
			insurance_premium: null,
			guarantee_responsibilities: [],
			total_premium: null,
			isLoading: true,
			isError: false
        }
      })

      let state = this.productsState[index] || []
      let total = this.totalProducts[index]
      // 产品状态列表
      state = state.concat(data)
      // 产品列表
      total = total.slice(0, this.perPagesize * this.perTabPage[index])
      // 设置赋值
      this.$set(this.productsState, index, state)
      this.$set(this.products, index, total)
      // 前期信息处理完毕
      this.flag = false

      let tag = 0

      for (let item of res) {
        const d = {
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
          insurances: item.product_insurance_group.map((i)=>{
			let isHasDefault = i.insurances.filter(ii=> ii.is_default === 1).length;
				if(isHasDefault){
					return{
						id:i.insurances.filter(ii=> ii.is_default === 1)[0].id,
						name:i.insurances.filter(ii=> ii.is_default === 1)[0].name,
						coverage:i.insurances.filter(ii=> ii.is_default === 1)[0].coverages.length ? i.insurances.filter(ii=> ii.is_default === 1)[0].coverages[0].value : '',
						type:i.insurances.filter(ii=> ii.is_default === 1)[0].type,
						coverageText:i.insurances.filter(ii=> ii.is_default === 1)[0].coverages.length ? i.insurances.filter(ii=> ii.is_default === 1)[0].coverages[0].value_text : ''
					}
				}
			}),
          // insurances: item.product_insurances.map(i => ({ id: i.id, coverage: i.coverages.length ? i.coverages[0].value : '' }))
          // insurance_ids: item.product_insurances.map(i => i.id),
        }

        try {
          let response = await getCost(d)

          let insurances = response.insurances.filter(
            item => item.select_status === 1
          )
          this.products[index][this.perPagesize * (this.perTabPage[index] - 1) + tag]
          .product_insurances = response.insurances.map(i => i)
          // 总额
          data[tag].total_premium = response.total_premium
          // 请求状态
          data[tag].isLoading = false
          // 附加险已勾选
          // data[tag].insurances = response.insurances.map(y => ({ id: y.id, coverage: y.coverage, name: y.name, target: y.target }))
          // 保障内容
          data[tag].guarantee_responsibilities = insurances
            .filter(i => i.guarantee_responsibilities)
            .reduce((prev, next) => {
              return prev.concat(
                next.guarantee_responsibilities.map(
                  y => `${y.name}: ${y.value_text}`
                )
              )
            }, [])

          // this.$set(this.productsState, index, data)
        } catch (error) {
          const message = error.message
          data[tag].total_premium = message
          data[tag].guarantee_responsibilities = ['无']
          data[tag].isLoading = false
          data[tag].isError = true

          // this.$set(this.productsState, index, data)
        }

        tag += 1
      }
    },
    getSupplierList() {
      getSupplierList().then(res => {
        this.supplierList = res
      })
    },
    getInsuranceList() {
      getInsuranceList().then(res => {
        this.insuranceList = res
      })
    },
    selectRelation() {
      if (
        !this.relationModel.policy_holder_member.id ||
        !this.relationModel.recognizee_policy_member.id
      ) {
        return this.$message({
          message: '请选择投保人以及被保人关系',
          type: 'warning'
        })
      }
      this.relationModel.recognizee_policy_member = this.relations.filter(
        i => i.id === this.relationModel.recognizee_policy_member.id
      )[0]
      this.relationModel.policy_holder_member = this.relations.filter(
        i => i.id === this.relationModel.policy_holder_member.id
      )[0]
      this.relationModel.member_id = this.relations.filter(
        i => i.id === this.relationModel.recognizee_policy_member.id
      )[0].id.toString()

      this.relationsSelected.push(this.relationModel)
      this.addDialogVisible = false
      this.schemesTab = this.relationModel.member_id.toString() // `${this.relationsSelected.length - 1}`
      // this.formData.schemes.push(JSON.parse(JSON.stringify(this.schemesModel)))
      this.schemesFilters.push(
        JSON.parse(JSON.stringify(this.schemesFilterModel))
      )
      this.productsSelected.push([])
      this.ect.push({
        has_illustration: false,
        illustration: ''
      })

      this.relationModel = {
        recognizee_policy_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        policy_holder_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        name: '',
        member_id: ''
      }

      // this.search({}, this.schemesFilters.length - 1)
    },
    getRelations(id) {
      getRelationsV2({ id }).then(res => {
        this.relations = res
      })
    },
    addProposal() {
      this.addDialogVisible = true
    },
    showEditMemberStructFunc () {
      this.showEditMemberStruct = true
    },
    addHandleClose() {
      this.addDialogVisible = false
      this.relationModel = {
        recognizee_policy_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        policy_holder_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        name: ''
      }
    },
    previewHandleClose() {
      this.previewVisible = false
    },
    handleClose(done) {
      this.$router.push('/proposal/proposal-list')
      done()
    },
    listTextHidden() {
      this.isTextHidden = !this.isTextHidden
    },
    selectedListTextHidden() {
      this.isSelectedTextHidden = !this.isSelectedTextHidden
    },
    removeTabInchange(targetName) {
      const index = this.relationsSelected.findIndex(item => item.member_id == targetName)
      if (index > -1) {
        this.relationsSelected.splice(index, 1)
        this.schemesFilters.splice(index, 1)
        this.productsSelected.splice(index, 1)
        this.ect.splice(index, 1)
        this.schemesTab = this.relationsSelected[0].member_id.toString()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }
    },
    removeTab(targetName) {
      this.$confirm('请确认删除该项方案?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.relationsSelected.findIndex(item => item.member_id == targetName)
        if (index > -1) {
          this.relationsSelected.splice(index, 1)
          this.schemesFilters.splice(index, 1)
          this.productsSelected.splice(index, 1)
          this.ect.splice(index, 1)
          this.schemesTab = this.relationsSelected[0].member_id.toString()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        
        
        // const index = +targetName
        // this.relationsSelected.splice(index, 1)
        // this.schemesFilters.splice(index, 1)
        // this.productsSelected.splice(index, 1)
        // this.ect.splice(index, 1)
        // this.schemesTab = `${this.relationsSelected.length - 1}`
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "index";
</style>

<style lang="scss">
.add-scheme-form ::v-deep .el-form-item__label {
  padding-bottom: 0 !important;
}
.add-scheme-form {
  margin: 0 0 10px 0 !important;
}
.el-tabs__header.tab-fixed {
  position: fixed !important;
  top: 0 !important;
  background-color: #f5f5f5 !important;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 33 !important;
}

.proposal-add-scheme.tab-fixed {
  position: fixed !important;
  top: 4px !important;
  // right: 6vw !important;
  z-index: 34 !important;
}
.proposal-add-scheme {
  top: -2px !important;
  display: flex;
  align-items: center;
}
.proposal-edit-scheme {
  right: 126px !important;
}

.el-tabs__header {
  margin: 0 !important;
}

.el-tabs__content {
  width: 100% !important;
}

.proposal-tabs .el-tabs__item {
  display: inline-flex;
  align-items: center;
}
.el-select-default {
  .popper__arrow {
    display: none !important;
  }
}
</style>
