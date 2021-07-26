<template>
  <el-dialog width="400px"
             :visible="show"
             :close-on-click-modal="false"
             title="计划书材料"
             @close="modalClose">
    <div class="p16 flex-between material-item">
      <div>
        <div class="title mb8">H5计划书版本</div>
        <div class="tip">请使用微信扫码打开</div>
        <div class="tip">打开后点击右上角按钮转发</div>
      </div>
      <div class="qrcode">
        <img :src="proposalInfo.qr_code" width="100%" height="100%">
      </div>
    </div>
    <div class="p16 flex-between material-item">
      <div>
        <div class="title">PDF版本计划书</div>
      </div>
      <div class="flex-center">
        <el-button type="text"
                   size="mini"
                   @click="check('view', 'pdf')">在线查看</el-button>
        <el-button type="primary"
                   size="small"
                   style="margin-left: 6px;"
                   icon="fs12 iconfont iconchaoxiao_xiazai_bai"
                   @click="check('download', 'pdf')">下载本地</el-button>
      </div>
    </div>
    <div class="p16 flex-between material-item">
      <div>
        <div class="title">图片版本计划书</div>
      </div>
      <div class="flex-center">
        <el-button type="text"
                  size="mini"
                  @click="check('view', 'image')">在线查看</el-button>
        <el-button type="primary"
                  size="small"
                  style="margin-left: 6px;"
                  icon="fs12 iconfont iconchaoxiao_xiazai_bai"
                  @click="check('download', 'image')">下载本地</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    proposalInfo: {
      required: true,
      type: Object
    },
    isDeposit: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  methods: {
    check(type, mode) {
      // window.open(`${process.env.VUE_APP_API_URL}/agent/proxy/proposal/file/${type}/${mode}?pcode=${this.proposalInfo.pcode}`)
      window.open(`${process.env.VUE_APP_API_URL}/agent/proxy/${this.isDeposit ? `deposit-proposal/${mode}/${type}-by-pcode` : `proposal/file/${type}/${mode}`}?pcode=${this.proposalInfo.pcode}`)
    },
    modalClose() {
      this.$emit('update:show', false)
      this.$emit('fresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.material-item {
  margin-bottom: 20px;
  background-color: #F5F5F5;
  border-radius: 4px;
  .title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .tip {
    font-size: 14px;
    color: #808080;
    line-height: 22px;
  }
  .qrcode {
    width: 150px;
    height: 150px;
  }
}
</style>
