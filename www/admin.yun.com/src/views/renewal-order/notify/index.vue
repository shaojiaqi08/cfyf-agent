<template>
  <div class="renewal-notify page-container">
    <div class="header">
      续保续期短信通知
    </div>
    <el-scrollbar class="content-body scrollbar" v-loading="loading">
      <el-switch
        class="mb16"
        v-model="isAutoSend"
        inactive-text="是否自动发送续保续期短信给客户（投保人）"
        :active-text="isAutoSend ? '是' : '否'"
      ></el-switch>
      <template v-if="isSales">
        <div class="sales-wrap">
          <div>
            <span>工作昵称</span>
            <el-tooltip content="昵称用于发送给客户相关短信时的称呼" placement="top">
              <i class="iconfont iconxiao16_gengduoxinxi ml4 mr12"></i>
            </el-tooltip>
            <b>李四</b>
          </div>
          <div>
            <span>工作手机</span>
            <el-tooltip content="工作手机用于接收本平台各类提醒，同时，也用于发送给客户相关短信，以便客户回拨电话时，联系您" placement="top">
              <i class="iconfont iconxiao16_gengduoxinxi ml4 mr12"></i>
            </el-tooltip>
            <b>138000138000</b>
            <el-tooltip content="去修改个人信息" placement="top" :open-delay="1000">
              <i class="ml4 iconfont iconxiao16_bianji" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
        </div>
      </template>
      <h3>短信示例</h3>
      <div class="main-text">【保单管理助手】尊敬的张三：您去年投保的“复星联合康乐一生重大疾病保险B款”，保单号8001005186于2020年08月08日保险到期。为使您未来一年得到相应的保障，请您及时完成续保。</div>
      <div class="main-text">【保单管理助手】尊敬的张三：您去年投保的“复星联合康乐一生重大疾病保险B款”，保单号8001005186于2020年08月08日保险到期。为使您未来一年得到相应的保障，请您及时完成续保。</div>
      <h3>短信发送规则</h3>
      <div class="main-text">短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则短信发送规则超长换行展示</div>
      <el-switch
          v-if="!isSales"
          class="mb16"
          v-model="isAuth"
          inactive-text="是否授权创富云服协助跟进续保续期"
          :active-text="isAuth ? '是' : '否'"
      ></el-switch>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="submitting"
        @click="save">保存</el-button>
    </el-scrollbar>
    <el-dialog
      :title="`编辑销售`"
    ></el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RenewalNotify',
  data() {
    return {
      loading: false,
      submitting: false,
      isAutoSend: false,
      isAuth: false,
      dialogVisible: false,
      formModel: {
        name: '',
        mobile: ''
      },
      rules: {
        name: { required: true, message: '' }
      }
    }
  },
  computed: {
    isSales() {
      return true
    }
  },
  methods: {
    save() {}
  }
}
</script>

<style scoped lang="scss">
.renewal-notify {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input {
      width: 360px;
    }
  }
  .content-body {
    flex: 1;
    overflow: hidden;
    background-color: #fff;
    ::v-deep .el-scrollbar__view {
      padding: 16px;
      .sales-wrap {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #4D4D4D;
        margin-bottom: 16px;
        & > div {
          width: 380px;
          display: flex;
          align-items: center;
        }
        .iconfont {
          color: #1F78FF;
          line-height: 16px;
        }
        b {
          color: #1A1A1A;
        }
      }

      & > h3 {
        font-size: 16px;
        margin: 0 0 16px 0;
        color: #333;
        line-height: 24px;
      }

      & > .main-text {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 16px;
        text-align: justify;
      }

      & > .el-button {
        display: block;
        margin: 93px auto 0 auto;
        width: 126px;
      }

      .txt-primary {
        color: #1F78FF;
        cursor: pointer;
      }
    }

    ::v-deep .el-switch {
      display: flex;
      align-items: center;
      .el-switch__label--left {
        font-weight: bold;
        color: #1A1A1A;
        font-size: 16px;
        transform: translateY(-2px);
      }
      .el-switch__label--right {
        color: #808080;
      }
    }
  }
}
</style>
