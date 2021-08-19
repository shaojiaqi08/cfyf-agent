<template>
  <el-scrollbar style="height: 88vh;">
    <el-card class="mb10">
      <div class="card-header">
        计划书基本信息
      </div>
      <div class="card-body">
        <div class="form-row" style="justify-content: flex-start;">
          <div class="form-item customer">
            <div class="label">所属客户</div>
            <el-input placeholder="请输入客户姓名"
                      v-model="baseInfo.customer_name"></el-input>
          </div>
          <div class="form-item proposal-name">
            <div class="label">计划书名称</div>
            <el-input placeholder="请输入计划书名称"
                      v-model="baseInfo.name"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <div class="label">备注</div>
            <el-input placeholder="备注信息不对客户展示，仅作为自我记忆使用"
                      v-model="baseInfo.remark"
                      type="textarea"
                      rows="2"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <div class="label">
              家庭基本信息（PDF版本使用）
              <el-switch
                class="ml10"
                v-model="baseInfo.has_pdf_illustration"
                active-color="#FF9B19"
                inactive-color="#E6E6E6">
              </el-switch>
              <span class="switcher-tips" :class="{ active: baseInfo.has_pdf_illustration }">
                {{ baseInfo.has_pdf_illustration ? '展示' : '不展示' }}
              </span>
              <template v-if="baseInfo.has_pdf_illustration">
                <el-radio class="ml20"
                          v-model="baseInfo.pdf_illustration_type"
                          :label="editorTypes.ORDINARY"
                          @change="pdfIllustrationTypeChange">普通文本</el-radio>
                <el-radio v-model="baseInfo.pdf_illustration_type"
                          :label="editorTypes.RICH"
                          @change="pdfIllustrationTypeChange">富文本</el-radio>
              </template>
            </div>
            <template v-if="baseInfo.has_pdf_illustration">
              <el-input placeholder="需对客户进行展示，请输入客户家庭基本信息分析内容"
                        type="textarea"
                        v-if="baseInfo.pdf_illustration_type === editorTypes.ORDINARY"
                        v-model="baseInfo.pdf_illustration"
                        rows="4"></el-input>
              <vue-ueditor-wrap v-if="baseInfo.pdf_illustration_type === editorTypes.RICH"
                                v-model="baseInfo.pdf_illustration"
                                style="width: 100%;"
                                :config="UEditorConfig"></vue-ueditor-wrap>
            </template>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <div class="label">
              家庭风险分析
              <el-radio class="ml20"
                        v-model="baseInfo.illustration_type"
                        :label="editorTypes.ORDINARY"
                        @change="illustrationTypeChange">普通文本</el-radio>
              <el-radio v-model="baseInfo.illustration_type"
                        :label="editorTypes.RICH"
                        @change="illustrationTypeChange">富文本</el-radio>
            </div>
            <el-input placeholder="需对客户进行展示，请输入客户家庭基本信息分析内容"
                        type="textarea"
                        v-if="baseInfo.illustration_type === editorTypes.ORDINARY"
                        v-model="baseInfo.illustration"
                        rows="4"></el-input>
            <vue-ueditor-wrap v-if="baseInfo.illustration_type === editorTypes.RICH"
                              v-model="baseInfo.illustration"
                              style="width: 100%;"
                              :config="UEditorConfig"></vue-ueditor-wrap>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="card-header">
        计划书展示设置
      </div>
      <div class="card-body">
        <div class="form-row mb24">
          <div>
            家庭汇总保费
            <el-switch
              class="ml10"
              v-model="baseInfo.is_show_premium"
              active-color="#FF9B19"
              inactive-color="#E6E6E6">
            </el-switch>
            <span class="switcher-tips" :class="{ active: baseInfo.is_show_premium }">
              {{ baseInfo.is_show_premium ? '展示' : '不展示' }}
            </span>
          </div>
        </div>
        <div class="form-row mb24">
          <div>
            保险公司介绍
            <el-switch
              class="ml10"
              v-model="baseInfo.is_show_company_profile"
              active-color="#FF9B19"
              inactive-color="#E6E6E6">
            </el-switch>
            <span class="switcher-tips" :class="{ active: baseInfo.is_show_company_profile }">
              {{ baseInfo.is_show_company_profile ? '展示' : '不展示' }}
            </span>
          </div>
        </div>
        <div class="form-row">
          <div>
            投保链接
            <el-switch
              style="margin-left: 37px;"
              v-model="baseInfo.is_show_link"
              active-color="#FF9B19"
              inactive-color="#E6E6E6">
            </el-switch>
            <span class="switcher-tips" :class="{ active: baseInfo.is_show_link }">
              {{ baseInfo.is_show_link ? '展示' : '不展示' }}
            </span>
          </div>
        </div>
      </div>
    </el-card>
  </el-scrollbar>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
const editorTypes = {
  ORDINARY: 'ordinary',
  RICH: 'rich'
}
export default {
  props: {
    baseInfo: {
      required: true,
      type: Object
    }
  },
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      editorTypes,
      radio: '1',
      value1: '',
      UEditorConfig: {
        initialFrameWidth: null
      }
    }
  },
  methods: {
    pdfIllustrationTypeChange() {
      this.baseInfo.pdf_illustration = ''
    },
    illustrationTypeChange() {
      this.baseInfo.illustration = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.card-header {
  padding-bottom: 14px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #E6E6E6;
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
.card-body {
  padding: 16px 0 0;
  .form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .form-item {
      margin: 0 !important;
      width: 100%;
      &.customer {
        display: inline-block;
        width: 200px;
        margin-bottom: 24px;
      }
      &.proposal-name {
        display: inline-block;
        margin-left: 24px !important;
        flex: 1;
        // width: 528px;
      }
      .label {
        padding: 0 0 8px;
        font-size: 14px;
        color: #333;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.body {
  .list-item {
    margin: 0 auto 8px;
    padding: 16px;
    min-width: 784px;
    height: 160px;
    border: 1px solid rgba(230,230,230,1);
    background-color: #F5F5F5;
    border-radius: 4px;
    cursor: pointer;
    .item-header {
      font-size: 16px;
      color: #333;
      font-weight: bold;
      .state-sign {
        padding: 2px 10px;
        font-size: 12px;
        border-radius: 4px;
        &.hold {
          background-color: #FFEDED;
          color: rgba(255,81,81,1);
          border: 1px solid rgba(255,81,81,0.1);
        }
      }
    }
    .item-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid #E6E6E6;
      .info-item {
        flex: 0 0 160px;
        .title {
          color: #333;
          font-size: 12px;
        }
        .value {
          margin-top: 6px;
          color: #333;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 54px;
      .button {
        color: #FF9301;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
</style>
