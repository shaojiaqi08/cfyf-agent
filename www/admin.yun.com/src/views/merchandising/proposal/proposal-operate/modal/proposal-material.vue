<template>
  <el-dialog width="400px"
             :visible="show"
             :close-on-click-modal="false"
             :title="title"
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
      <div>
        <el-button type="text" size="mini" @click="check('view')">在线查看</el-button>
        <el-button type="primary" @click="check('download')">下载本地</el-button>
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
    title: {
      type: String
    },
    from: {
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    check(type) {
      window.open(`${process.env.VUE_APP_API_URL}/agent/proxy/proposal/pdf/${type}?proposal_id=${this.proposalInfo.id}`)
    },
    modalClose() {
      // this.$emit('update:show', false)
      // this.$emit('fresh')
      window.localStorage.setItem('refreshPage', new Date().getTime())
      window.close()
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
    width: 128px;
    height: 128px;
  }
}
</style>
